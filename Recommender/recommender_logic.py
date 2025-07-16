import requests
import os
from collections import Counter

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"
IMG_BASE_URL = "https://image.tmdb.org/t/p/w500"

def fetch_movie_details(tmdb_id):
    try:
        headers = {
            "Authorization": f"Bearer {TMDB_API_KEY}",
            "accept": "application/json"
        }

        movie_res = requests.get(f"{TMDB_BASE_URL}/movie/{tmdb_id}", headers=headers).json()
        credits = requests.get(f"{TMDB_BASE_URL}/movie/{tmdb_id}/credits", headers=headers).json()
        videos = requests.get(f"{TMDB_BASE_URL}/movie/{tmdb_id}/videos", headers=headers).json()

        director = next((crew["name"] for crew in credits.get("crew", []) if crew["job"] == "Director"), None)

        cast = [
            {
                "id": c.get("id"),
                "name": c.get("name"),
                "profile_path": f"https://image.tmdb.org/t/p/w500{c['profile_path']}" if c.get("profile_path") else None
            }
            for c in credits.get("cast", [])[:5]
        ]

        trailer_key = next((v["key"] for v in videos.get("results", []) if v["type"] == "Trailer" and v["site"] == "YouTube"), None)
        trailer = f"https://www.youtube.com/watch?v={trailer_key}" if trailer_key else None

        return {
            "tmdbId": movie_res.get("id"),
            "title": movie_res.get("title"),
            "backdrop": IMG_BASE_URL + movie_res.get("backdrop_path") if movie_res.get("backdrop_path") else None,
            "poster": IMG_BASE_URL + movie_res.get("poster_path") if movie_res.get("poster_path") else None,
            "genre_ids": movie_res.get("genre_ids", []),
            "overview": movie_res.get("overview"),
            "director": director,
            "cast": cast,
            "runtime": movie_res.get("runtime"),
            "releaseYear": int(movie_res["release_date"][:4]) if movie_res.get("release_date") else None,
            "vote": str(movie_res.get("vote_average")) if movie_res.get("vote_average") else None,
            "trailer": trailer
        }
    except Exception as e:
        print(f"Error fetching movie {tmdb_id}: {e}")
        return None


def collaborative_filtering(user_id, interactions):
    similar_users = [i for i in interactions if i.get("userId") != user_id]
    recommended_ids = []

    for user in similar_users:
        movie_ids = user.get("movieIds", [])
        recommended_ids.extend(movie_ids)

    counter = Counter(recommended_ids)
    top_ids = [mid for mid, _ in counter.most_common(5)]
    return top_ids


def content_based(user_id, interactions, all_movies):
    user_interactions = [i for i in interactions if i.get("userId") == user_id]
    liked_movies = [mid for i in user_interactions for mid in i.get("movieIds", [])]

    liked_genres = []
    for mid in liked_movies:
        genres = all_movies.get(str(mid), {}).get("genres", [])
        liked_genres.extend(genres)

    genre_counter = Counter(liked_genres)
    common_genres = set([g for g, _ in genre_counter.most_common(3)])

    recommended = []
    for mid, info in all_movies.items():
        if set(info.get("genres", [])) & common_genres and int(mid) not in liked_movies:
            recommended.append(int(mid))

    return recommended[:5]


def cold_start(all_movies):
    popular_ids = list(all_movies.keys())[:5]
    return [int(mid) for mid in popular_ids]


def generate_recommendations(user_id, interactions, all_movies):
    print("Generating recommendations for:", user_id)
    print("Total interactions:", len(interactions))
    print("Total movies in DB:", len(all_movies))
    has_history = any(i for i in interactions if i.get("userId") == user_id)

    if has_history:
        collab_ids = collaborative_filtering(user_id, interactions)
        content_ids = content_based(user_id, interactions, all_movies)
    else:
        collab_ids = []
        content_ids = []

    cold_ids = cold_start(all_movies)

    # Combine and deduplicate
    all_ids = list(dict.fromkeys(collab_ids + content_ids + cold_ids))

    # Fetch all movie details once
    id_to_details = {}
    for movie_id in all_ids:
        details = fetch_movie_details(movie_id)
        if details:
            id_to_details[movie_id] = details

    # Build response sections using the fetched data
    response = {
        "userId": user_id,
        "collaborative": [id_to_details[mid] for mid in collab_ids if mid in id_to_details],
        "contentBased": [id_to_details[mid] for mid in content_ids if mid in id_to_details],
        "coldStart": [id_to_details[mid] for mid in cold_ids if mid in id_to_details],
        "recommended": list(id_to_details.values())  # Combined deduplicated list
    }

    return response
