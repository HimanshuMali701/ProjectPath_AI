import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SkillChart from "./components/SkillChart";
import { AnimatePresence, motion } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function App() {
  const [mode, setMode] = useState("manual");
  const [skills, setSkills] = useState("");
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("data_scientist");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("projectpath-theme");
    const initialDark = savedTheme ? savedTheme === "dark" : false;
    setDarkMode(initialDark);
  }, []);

  useEffect(() => {
    localStorage.setItem("projectpath-theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  const parsedSkills = useMemo(() => {
    return skills
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }, [skills]);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      let res;

      if (mode === "manual") {
        res = await axios.post("http://127.0.0.1:5000/analyze", {
          role,
          skills: parsedSkills,
        });
      } else {
        if (!file) {
          alert("Please upload a PDF resume.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("role", role);

        res = await axios.post("http://127.0.0.1:5000/analyze_resume", formData);
      }

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const downloadBlueprint = async (project) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/download_blueprint",
        project,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${project.name.replace(/\s+/g, "_").toLowerCase()}.zip`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Could not download starter pack.");
    }
  };

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };
  return (
    <div className={darkMode ? "dark" : ""}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative min-h-screen overflow-hidden bg-slate-50/80 text-slate-900 transition-colors duration-500 dark:bg-slate-950/80 dark:text-slate-100"
      >
        <Particles
              id="tsparticles"
              init={particlesInit}
              options={{
                fullScreen: { enable: false },
                background: { color: "transparent" },
                particles: {
                  number: { value: 100 },
                  color: { value: "#ffffff" },
                  size: { value: 2 },
                  move: {
                    enable: true,
                    speed: 1,
                    direction: "bottom",
                    outModes: { default: "out" },
                  },
                },
              }}
              className="absolute inset-0 z-0"
            />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-[-80px] h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-500/10" />
          <div className="absolute top-40 right-[-60px] h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-500/10" />
          <div className="absolute bottom-[-100px] left-1/3 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <header className="relative mb-8 text-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setDarkMode((v) => !v)}
              className="absolute right-0 top-0 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-xl transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-900"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-slate-600 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
            >
              PROJECTPATH AI
            </motion.div>

            <h1 className="mt-5 bg-gradient-to-r from-slate-900 via-cyan-700 to-indigo-700 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl dark:from-white dark:via-cyan-300 dark:to-indigo-300">
              🚀 ProjectPath AI
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 md:text-lg dark:text-slate-300">
              From Skills → Projects → Career Growth 🚀
            </p>
          </header>

          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 rounded-3xl border border-white/60 bg-white/75 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20 md:p-8"
          >
            <div className="mb-5 flex flex-wrap gap-3">
              <button
                onClick={() => setMode("manual")}
                className={`rounded-xl px-4 py-2.5 font-medium transition ${
                  mode === "manual"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                Enter skills manually
              </button>
              <button
                onClick={() => setMode("resume")}
                className={`rounded-xl px-4 py-2.5 font-medium transition ${
                  mode === "resume"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                Upload resume
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  🎯 Target Role
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="data_scientist">Data Scientist</option>
                  <option value="data_analyst">Data Analyst</option>
                  <option value="ml_engineer">ML Engineer</option>
                </select>
              </div>

              <div className="md:col-span-2">
                {mode === "manual" ? (
                  <>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      ✍️ Enter Skills
                    </label>
                    <textarea
                      className="min-h-[130px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      placeholder="example: python, pandas, numpy, machine learning, sql"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Separate skills using commas.
                    </p>
                  </>
                ) : (
                  <>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      📄 Upload Resume (PDF)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:border-cyan-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:file:bg-cyan-500"
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Upload a resume to extract skills automatically.
                    </p>
                  </>
                )}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 font-semibold text-white shadow-xl shadow-emerald-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "🧠 AI is analyzing your profile..." : "Analyze"}
            </motion.button>
          </motion.section>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 flex justify-center"
              >
                <div className="rounded-full border border-white/60 bg-white/80 px-6 py-4 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                  <span className="animate-pulse">
                    🧠 Building your career path...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20">
                      <SkillChart skills={result.skills || []} />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center justify-center rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
                  >
                    <div className="text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Overall Score
                      </p>
                      <motion.h1
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mt-2 text-6xl font-black tracking-tight md:text-7xl"
                      >
                        {result.score}
                      </motion.h1>
                    </div>
                  </motion.div>
                </div>

                <div className="mb-8 grid gap-6 md:grid-cols-3">
                  <StatCard title="📊 Resume Score" value={`${result.score}/100`} />
                  <StatCard
                    title="🎯 Target Role"
                    value={role.replace("_", " ")}
                    capitalize
                  />
                  <StatCard
                    title="🧭 Current Level"
                    value={
                      result.score >= 80
                        ? "Advanced"
                        : result.score >= 55
                        ? "Intermediate"
                        : "Beginner"
                    }
                  />
                </div>

                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                  <Card title="🧠 Current Skills">
                    <TagList items={result.skills || []} />
                  </Card>

                  <Card title="⚠️ Skill Gap">
                    <ListItems items={result.gap || []} />
                  </Card>

                  <Card title="📌 High-Demand Missing Skills">
                    <ListItems items={result.missing || []} />
                  </Card>

                  <Card title="🔗 Related Skills to Learn">
                    <TagList
                      items={(result.expanded || [])
                        .filter((s) => !(result.skills || []).includes(s))
                        .slice(0, 12)}
                    />
                  </Card>
                </div>

                <motion.section
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-8 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
                >
                  <h2 className="mb-5 text-2xl font-bold">
                    📚 Advanced Learning Path
                  </h2>

                  <div className="space-y-4">
                    {result.advanced &&
                      Object.entries(result.advanced).map(([skill, details]) => (
                        <details
                          key={skill}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/60"
                        >
                          <summary className="cursor-pointer px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">
                            🚀 {skill}
                          </summary>
                          <div className="grid gap-4 border-t border-slate-200 p-4 dark:border-slate-800 md:grid-cols-2">
                            {Object.entries(details).map(([category, items]) => (
                              <div key={category}>
                                <p className="mb-2 font-semibold text-slate-700 dark:text-slate-200">
                                  {category}
                                </p>
                                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                  {items.map((item, idx) => (
                                    <li key={idx} className="flex gap-2">
                                      <span>•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </details>
                      ))}
                  </div>
                </motion.section>

                <motion.section
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-8 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
                >
                  <h2 className="mb-5 text-2xl font-bold">🚀 Recommended Projects</h2>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {result.recommendations?.map((project, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/60"
                      >
                        {idx === 0 && (
                          <div className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-400/20 dark:text-amber-300">
                            🏆 Best Match
                          </div>
                        )}

                        <h3 className="text-xl font-bold">{project.name}</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          Match Score: <strong>{project.percent}%</strong>
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          Difficulty: <strong>{project.difficulty}</strong>
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          Level Fit: <strong>{project.reasons?.difficulty_fit}</strong>
                        </p>

                        <div className="mt-4">
                          <p className="mb-2 font-semibold">📂 Recommended Datasets</p>
                          <ListItems items={project.datasets || []} />
                        </div>

                        <div className="mt-4">
                          <p className="mb-2 font-semibold">🎯 Why This Project</p>
                          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                            {project.reasons?.gap_match?.length > 0 && (
                              <li>• Covers gap: {project.reasons.gap_match.join(", ")}</li>
                            )}
                            {project.reasons?.known_overlap?.length > 0 && (
                              <li>
                                • Uses your skills: {project.reasons.known_overlap.join(", ")}
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="mt-4">
                          <p className="mb-2 font-semibold">🧠 Skills You’ll Gain</p>
                          <TagList items={project.skills || []} />
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => downloadBlueprint(project)}
                          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95"
                        >
                          📥 Download Starter Kit
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                <motion.section
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-8 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
                >
                  <h2 className="mb-5 text-2xl font-bold">📈 Job Market Insights</h2>
                  <div className="space-y-4">
                    {result.trending?.map(([skill, score]) => (
                      <div key={skill}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-semibold">{skill}</span>
                          <span>{score}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="py-8 text-center text-slate-500 dark:text-slate-400">
            <hr className="mb-6 border-slate-200 dark:border-slate-800" />
            Built by Himanshu Mali • AI Career Tool 🚀
          </footer>
        </div>
      </motion.div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
    >
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      {children}
    </motion.div>
  );
}

function StatCard({ title, value, capitalize = false }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
    >
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p
        className={`mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}

function TagList({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400">No items found.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span
          key={idx}
          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-700 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ListItems({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400">No items found.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-2 text-slate-700 dark:text-slate-300">
          <span className="text-slate-400">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default App;