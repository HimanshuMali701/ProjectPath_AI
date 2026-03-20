from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from io import BytesIO
import json

from modules.skill_extractor import extract_skills
from modules.skill_gap import find_skill_gap, advanced_recommendations
from modules.project_recommender import recommend_projects
from modules.resume_score import calculate_resume_score
from modules.job_market_analyzer import get_trending_skills
from modules.skill_graph import expand_skills
from modules.resume_parser import extract_resume_text
from modules.blueprint_generator import create_blueprint_zip

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({"message": "ProjectPath AI Backend Running 🚀"})


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        role = data.get("role")
        skills = data.get("skills", [])

        gap = find_skill_gap(skills, role)
        advanced = advanced_recommendations(skills)
        expanded = expand_skills(skills)
        recommendations = recommend_projects(gap, skills, role, top_n=3)
        trending = get_trending_skills(role)
        score, missing = calculate_resume_score(skills, role)

        return jsonify({
            "skills": skills,
            "score": score,
            "missing": missing,
            "gap": gap,
            "advanced": advanced,
            "expanded": expanded,
            "recommendations": recommendations,
            "trending": trending
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/analyze_resume", methods=["POST"])
def analyze_resume():
    try:
        file = request.files["file"]
        role = request.form.get("role")

        text = extract_resume_text(file)
        skills = extract_skills(text)

        gap = find_skill_gap(skills, role)
        advanced = advanced_recommendations(skills)
        expanded = expand_skills(skills)
        recommendations = recommend_projects(gap, skills, role, top_n=3)
        trending = get_trending_skills(role)
        score, missing = calculate_resume_score(skills, role)

        return jsonify({
            "skills": skills,
            "score": score,
            "missing": missing,
            "gap": gap,
            "advanced": advanced,
            "expanded": expanded,
            "recommendations": recommendations,
            "trending": trending
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/download_blueprint", methods=["POST"])
def download_blueprint():
    try:
        project = request.json
        zip_bytes = create_blueprint_zip(project)

        return send_file(
            BytesIO(zip_bytes),
            mimetype="application/zip",
            as_attachment=True,
            download_name=f"{project['name'].replace(' ', '_').lower()}.zip"
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)