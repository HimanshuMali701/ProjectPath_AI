import streamlit as st

from modules.resume_parser import extract_resume_text
from modules.skill_extractor import extract_skills
from modules.skill_gap import find_skill_gap, advanced_recommendations
from modules.project_recommender import recommend_projects, get_user_level
from modules.blueprint_generator import create_blueprint_zip
from modules.job_market_analyzer import get_trending_skills
from modules.skill_graph import expand_skills
from modules.resume_score import calculate_resume_score
from modules.skill_visualizer import create_skill_chart


# -------------------------------------------------------
# PAGE CONFIG
# -------------------------------------------------------

st.set_page_config(
    page_title="ProjectPath AI",
    page_icon="🚀",
    layout="wide"
)

# -------------------------------------------------------
# HEADER
# -------------------------------------------------------

st.markdown("""
<h1 style='text-align: center;'>🚀 ProjectPath AI</h1>
<p style='text-align: center; font-size:18px; color: gray;'>
From Skills → Projects → Career Growth 🚀
</p>
<hr>
""", unsafe_allow_html=True)

# -------------------------------------------------------
# HOW IT WORKS
# -------------------------------------------------------

st.markdown("""
### 🔍 How It Works
1. Upload resume or enter skills  
2. AI analyzes your strengths & gaps  
3. Get personalized project recommendations  
4. Build projects to grow your career 🚀
""")

st.divider()

# -------------------------------------------------------
# SIDEBAR
# -------------------------------------------------------

st.sidebar.markdown("## ⚙️ Configuration")

role = st.sidebar.selectbox(
    "🎯 Target Role",
    ["data_scientist", "data_analyst", "ml_engineer"]
)

input_method = st.sidebar.radio(
    "📥 Input Method",
    ["Upload Resume", "Enter Skills Manually"]
)

skills = []
uploaded_file = None

# -------------------------------------------------------
# INPUT HANDLING
# -------------------------------------------------------

if input_method == "Upload Resume":

    uploaded_file = st.sidebar.file_uploader("📄 Upload Resume (PDF)", type=["pdf"])

    if uploaded_file:
        text = extract_resume_text(uploaded_file)
        skills = extract_skills(text)

else:
    manual_input = st.sidebar.text_area(
        "✍️ Enter your skills",
        placeholder="python, pandas, machine learning, sql"
    )

    if manual_input:
        skills = [s.strip().lower() for s in manual_input.split(",") if s.strip()]

# -------------------------------------------------------
# EMPTY STATE
# -------------------------------------------------------

if not skills:
    st.markdown("""
    <div style='text-align:center; margin-top:80px;'>
        <h3>👈 Get Started</h3>
        <p style='color:gray;'>Upload your resume or enter skills to receive personalized project recommendations</p>
    </div>
    """, unsafe_allow_html=True)
    st.stop()

# -------------------------------------------------------
# MAIN PIPELINE
# -------------------------------------------------------

with st.spinner("🧠 AI is analyzing your skills and building your career path..."):

    try:
        gap = find_skill_gap(skills, role)
        advanced = advanced_recommendations(skills)
        expanded = expand_skills(skills)
        recommendations = recommend_projects(gap, skills, role, top_n=3)
        trending = get_trending_skills(role)
        score, missing = calculate_resume_score(skills, role)

    except Exception as e:
        st.error(f"❌ Error: {e}")
        st.stop()

st.success("✅ Analysis Complete!")

# -------------------------------------------------------
# TOP SUMMARY
# -------------------------------------------------------

level = get_user_level(skills)

col1, col2, col3 = st.columns(3)

with col1:
    st.metric("📊 Resume Score", f"{score}/100")

with col2:
    st.metric("🎯 Target Role", role.replace("_", " ").title())

with col3:
    color = "#4CAF50" if level == "Beginner" else "#FFC107" if level == "Intermediate" else "#2196F3"
    st.markdown(
        f"<div style='padding:10px; border-radius:10px; background:{color}20; text-align:center;'>"
        f"<b>{level}</b></div>",
        unsafe_allow_html=True
    )

st.divider()

# -------------------------------------------------------
# TABS
# -------------------------------------------------------

tab1, tab2, tab3 = st.tabs(
    ["📊 Skill Analysis", "🚀 Projects", "📈 Market Trends"]
)

# ======================================================
# TAB 1
# ======================================================

with tab1:

    st.markdown("### 📌 Skill Profile")
    chart = create_skill_chart(skills)
    st.plotly_chart(chart, use_container_width=True)

    st.divider()

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("### 🧠 Current Skills")
        for skill in skills:
            st.markdown(f"✔️ {skill}")

    with col2:
        st.markdown("### ⚠️ Skill Gaps")
        if gap:
            for skill in gap:
                st.markdown(f"❌ {skill}")
        else:
            st.success("No major gaps 🎉")

    with col3:
        st.markdown("### 🔗 Related Skills")
        related = [s for s in expanded if s not in skills]
        for s in related[:10]:
            st.markdown(f"🔹 {s}")

    st.divider()

    st.markdown("### 📌 High-Demand Skills Missing")
    for m in missing:
        st.markdown(f"- {m}")

    st.divider()

    st.markdown("### 📚 Advanced Learning Path")
    for skill, details in advanced.items():
        with st.expander(f"🚀 {skill.title()}"):
            for category, items in details.items():
                st.write(f"**{category}**")
                for item in items:
                    st.markdown(f"- {item}")

# ======================================================
# TAB 2
# ======================================================

with tab2:

    st.markdown("## 🚀 Recommended Projects")

    cols = st.columns(3)

    for i, project in enumerate(recommendations):

        if project["percent"] < 20:
            continue

        with cols[i]:

            st.markdown("---")

            if i == 0:
                st.markdown("🏆 **Best Match**")

            st.markdown(f"### {project['name']}")

            st.progress(project["percent"] / 100)
            st.caption(f"Match Score: {project['percent']}%")

            st.markdown(f"**Difficulty:** {project['difficulty']}")
            st.markdown(f"**Level Fit:** {project['reasons']['difficulty_fit']}")

            st.markdown("**📂 Datasets**")
            for dataset in project.get("datasets", []):
                st.markdown(f"- {dataset}")

            st.markdown("**🎯 Why This Project**")

            if project["reasons"]["gap_match"]:
                st.markdown(f"• Covers gap: {', '.join(project['reasons']['gap_match'])}")

            if project["reasons"]["known_overlap"]:
                st.markdown(f"• Uses your skills: {', '.join(project['reasons']['known_overlap'])}")

            st.markdown("**🧠 Skills You’ll Gain**")
            for skill in project["skills"]:
                st.markdown(f"- {skill}")

            st.divider()

            zip_bytes = create_blueprint_zip(project)

            st.download_button(
                "📥 Download Starter Kit",
                data=zip_bytes,
                file_name=f"{project['name'].replace(' ', '_').lower()}.zip",
                mime="application/zip",
                use_container_width=True
            )

# ======================================================
# TAB 3
# ======================================================

with tab3:

    st.markdown("## 📈 Job Market Insights")

    for skill, score in trending:

        col1, col2 = st.columns([1, 4])

        with col1:
            st.markdown(f"**{skill}**")

        with col2:
            st.progress(score / 100)

# -------------------------------------------------------
# FOOTER
# -------------------------------------------------------

st.markdown("""
<hr>
<p style='text-align:center; color:gray;'>
Built by Himanshu Mali • AI Career Tool 🚀
</p>
""", unsafe_allow_html=True)