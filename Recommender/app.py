from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender_logic import generate_recommendations
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Recommender API is running 🚀"})

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        user_id = data.get("userId")
        interactions = data.get("interactions", [])
        all_movies = data.get("allMovies", {})

        result = generate_recommendations(user_id, interactions, all_movies)
        return jsonify(result)

    except Exception as e:
        print("Recommendation error:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
