import json


def load_roles():

    with open("data/roles_db.json") as f:
        roles = json.load(f)

    return roles


def find_skill_gap(user_skills, role):

    roles = load_roles()

    required_skills = roles[role]

    user_skills = set(user_skills)
    required_skills = set(required_skills)

    missing = required_skills - user_skills

    return list(missing)


def load_skill_tree():

    with open("data/skill_tree.json") as f:
        tree = json.load(f)

    return tree


def advanced_recommendations(user_skills):

    tree = load_skill_tree()

    recommendations = {}

    for skill in user_skills:

        if skill in tree:
            recommendations[skill] = tree[skill]

    return recommendations