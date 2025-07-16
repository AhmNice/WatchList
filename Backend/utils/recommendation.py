# recommend.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS if calling from frontend

# === Utility: Fetch movie genres from TMDB if not cached ===
def get_movie_details(tmdb_id, api_key):
    url = f"https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return {
            "tmdbId": tmdb_id,
            "title": data.get("title"),
            "genres": [g['name'] for g in data.get("genres", [])]
        }
    return None

# === Build genre-based similarity matrix ===
def build_genre_matrix(movie_data):
    df = pd.DataFrame(movie_data)
    df['genre_str'] = df['genres'].apply(lambda x: ' '.join(x))
    cv = CountVectorizer()
    genre_matrix = cv.fit_transform(df['genre_str'])
    similarity = cosine_similarity(genre_matrix)
    return df, similarity

# === Collaborative Filtering (user similarity) ===
def get_collab_recommendations(user_id, interactions):
    df = pd.DataFrame(interactions)
    if df.empty:
        return []

    user_movie_matrix = pd.pivot_table(
        df, index='userId', columns='tmdbId',
        aggfunc=lambda x: 1, fill_value=0
    )

    if user_id not in user_movie_matrix.index:
        return []

    user_vector = user_movie_matrix.loc[user_id].values.reshape(1, -1)
    similarities = cosine_similarity(user_vector, user_movie_matrix)[0]

    similar_users = user_movie_matrix.index[similarities.argsort()[::-1][1:6]]  # top 5

    recommended_movies = set()
    for u in similar_users:
        liked = user_movie_matrix.loc[u]
        liked_movies = liked[liked == 1].index
        recommended_movies.update(liked_movies)

    already_watched = set(user_movie_matrix.loc[user_id][user_movie_matrix.loc[user_id] == 1].index)
    return list(recommended_movies - already_watched)

# === Flask API Endpoint ===
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = data.get("userId")
    interactions = data.get("interactions", [])
    movies = data.get("movies", {})  # optional movie metadata
    api_key = data.get("tmdbApiKey")

    # Collaborative recommendations
    collab_recs = get_collab_recommendations(user_id, interactions)

    # Prepare movie metadata
    if not movies and api_key:
        unique_ids = list({x["tmdbId"] for x in interactions})
        movie_data = [get_movie_details(mid, api_key) for mid in unique_ids]
        movie_data = [m for m in movie_data if m]
    else:
        movie_data = [{"tmdbId": int(k), **v} for k, v in movies.items()]

    if not movie_data:
        return jsonify({
            "userId": user_id,
            "collaborative_recommendations": collab_recs[:5],
            "content_recommendations": []
        })

    # Content-based recommendations (genre)
    df, genre_sim = build_genre_matrix(movie_data)
    user_watched = [x["tmdbId"] for x in interactions if x["userId"] == user_id]
    watched_indices = df[df["tmdbId"].isin(user_watched)].index

    if len(watched_indices) == 0:
        content_recs = []
    else:
        genre_scores = genre_sim[watched_indices].mean(axis=0)
        genre_ranks = genre_scores.argsort()[::-1]
        content_recs = df.iloc[genre_ranks]["tmdbId"].tolist()
        content_recs = [mid for mid in content_recs if mid not in user_watched]

    return jsonify({
        "userId": user_id,
        "collaborative_recommendations": collab_recs[:5],
        "content_recommendations": content_recs[:5]
    })

if __name__ == "__main__":
    app.run(port=5000)
