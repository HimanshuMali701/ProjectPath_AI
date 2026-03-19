import json


def load_skill_graph():

    with open("data/skill_graph.json") as f:
        return json.load(f)


def expand_skills(user_skills):

    graph = load_skill_graph()

    expanded = set(user_skills)

    for skill in user_skills:

        if skill in graph:

            related = graph[skill]

            for r in related:
                expanded.add(r)

    return list(expanded)