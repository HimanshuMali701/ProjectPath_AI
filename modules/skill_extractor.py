import json

def load_skills():

    with open("data/skills_db.json") as f:
        skills = json.load(f)

    return skills


def extract_skills(text):

    skills_db = load_skills()

    detected_skills = []

    text = text.lower()

    for skill in skills_db:

        if skill in text:
            detected_skills.append(skill)

    return detected_skills