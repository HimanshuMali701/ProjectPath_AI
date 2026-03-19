import plotly.graph_objects as go


def create_skill_chart(skills):

    categories = [
        "machine learning",
        "deep learning",
        "nlp",
        "data visualization",
        "statistics"
    ]

    values = []

    for c in categories:

        if c in skills:
            values.append(1)
        else:
            values.append(0.2)

    fig = go.Figure()

    fig.add_trace(go.Scatterpolar(
        r=values,
        theta=categories,
        fill='toself'
    ))

    fig.update_layout(
        polar=dict(radialaxis=dict(visible=False)),
        showlegend=False
    )

    return fig