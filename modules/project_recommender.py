# modules/project_recommender.py
import json
from modules.skill_graph import expand_skills

def get_user_level(user_skills):

    n = len(user_skills)

    if n <= 5:
        return "Beginner"
    elif n <= 10:
        return "Intermediate"
    else:
        return "Advanced"

def difficulty_to_score(level):

    mapping = {
        "Beginner": 1,
        "Intermediate": 2,
        "Advanced": 3
    }

    return mapping.get(level, 2)

def load_projects():
    with open("data/projects_db.json", "r", encoding="utf-8") as f:
        return json.load(f)


def _score_project(project, skill_gap, user_skills):

    proj_skills = set([s.lower() for s in project.get("skills", [])])
    gap = set([s.lower() for s in skill_gap])
    user = set([s.lower() for s in user_skills])

    gap_match = proj_skills & gap
    known_overlap = proj_skills & user

    # -----------------------
    # Difficulty Matching
    # -----------------------

    user_level = get_user_level(user_skills)
    project_level = project.get("difficulty", "Intermediate")

    user_score = difficulty_to_score(user_level)
    project_score = difficulty_to_score(project_level)

    difficulty_diff = abs(user_score - project_score)

    # closer = better
    difficulty_score = max(0, 2 - difficulty_diff)

    # -----------------------
    # Final Score
    # -----------------------

    raw_score = (
        len(gap_match) * 2 +
        len(known_overlap) +
        difficulty_score * 2
    )

    max_possible = len(proj_skills) * 3 + 4
    percent = int((raw_score / max_possible) * 100)

    reasons = {
        "gap_match": list(gap_match),
        "known_overlap": list(known_overlap),
        "difficulty_fit": project_level
    }

    return raw_score, percent, reasons


def recommend_projects(skill_gap, user_skills, role, top_n=3):

    projects = load_projects()

    recommendations = []

    for project in projects:

        # Skip if role not relevant
        if role not in project.get("roles", []):
            continue

        raw_score, percent, reasons = _score_project(project, skill_gap, user_skills)

        item = project.copy()
        item["score"] = raw_score
        item["percent"] = percent
        item["reasons"] = reasons

        recommendations.append(item)

    recommendations = sorted(
        recommendations,
        key=lambda x: x["score"],
        reverse=True
    )

    return recommendations[:top_n]