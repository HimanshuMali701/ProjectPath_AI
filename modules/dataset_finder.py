import json


def load_projects():

    with open("data/projects_db.json") as f:
        projects = json.load(f)

    return projects


def find_datasets(project_name):

    projects = load_projects()

    for project in projects:

        if project["name"] == project_name:

            return project.get("datasets", [])

    return []