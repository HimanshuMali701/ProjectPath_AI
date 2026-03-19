import json


def load_job_skills():

    with open("data/job_market_skills.json") as f:
        return json.load(f)


def get_trending_skills(role):

    skills = load_job_skills()

    role_skills = skills.get(role, {})

    sorted_skills = sorted(
        role_skills.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return sorted_skills