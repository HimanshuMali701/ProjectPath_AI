# modules/blueprint_generator.py
import io
import zipfile
import json


def create_blueprint_zip(project):

    buf = io.BytesIO()

    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:

        project_name = project["name"]

        # README
        readme = f"""
# {project_name}

## Project Goal
Build a machine learning model for **{project_name}**

## Dataset
Use recommended dataset from Kaggle.

## Project Steps
1. Load dataset
2. Perform EDA
3. Feature Engineering
4. Train baseline model
5. Improve model
6. Evaluate performance

## Skills Learned
{', '.join(project['skills'])}
"""

        z.writestr("README.md", readme)

        # requirements
        requirements = """pandas
numpy
scikit-learn
matplotlib
seaborn
jupyter
"""

        z.writestr("requirements.txt", requirements)

        # training script
        train_py = """
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

print("Start training pipeline")

# TODO: load dataset
"""

        z.writestr("train.py", train_py)

        # data folder placeholder
        z.writestr("data/README.txt", "Place dataset files here")

        # notebook placeholder
        notebook = {
            "cells": [
                {
                    "cell_type": "markdown",
                    "metadata": {},
                    "source": [f"# {project_name} Analysis Notebook"]
                }
            ],
            "metadata": {},
            "nbformat": 4,
            "nbformat_minor": 2
        }

        z.writestr("notebook.ipynb", json.dumps(notebook))

    buf.seek(0)

    return buf.read()