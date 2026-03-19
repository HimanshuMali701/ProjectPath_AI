import json


def load_market_skills():

    with open("data/job_market_skills.json") as f:
        return json.load(f)


def calculate_resume_score(user_skills, role):

    market = load_market_skills()

    role_skills = market.get(role, {})

    total = len(role_skills)

    match = 0

    for skill in user_skills:

        if skill in role_skills:
            match += 1

    score = int((match / total) * 100) if total else 0

    missing = []

    for skill in role_skills:

        if skill not in user_skills:
            missing.append(skill)

    return score, missing[:5]