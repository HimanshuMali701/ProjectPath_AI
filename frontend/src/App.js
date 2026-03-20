import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SkillChart from "./components/SkillChart";
import { AnimatePresence, motion } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import AnimatedNumber from "./components/AnimatedNumber";

const API = "https://projectpath-ai-yjgy.onrender.com/";

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
        res = await axios.post(`${API}/analyze`, {
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

        res = await axios.post(`${API}/analyze_resume`, formData);
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
      const res = await axios.post(`${API}/download_blueprint`,
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
    
    <div
  className={`${
    darkMode
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
      : "bg-gradient-to-br from-slate-100 to-slate-200 text-black"
  } min-h-screen transition-colors duration-500`}
>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative min-h-screen overflow-hidden bg-slate-50/80 text-slate-900 transition-colors duration-500 dark:bg-slate-950/80 dark:text-slate-100"
      >
       <div className="absolute inset-0 -z-10">
  
          {/* Base gradient */}
<div className="absolute inset-0 opacity-20 dark:opacity-40 animate-pulse bg-[radial-gradient(circle,rgba(56,189,248,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
          {/* Subtle glow (ONLY in dark mode) */}
          <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.12),transparent_40%)]" />

        </div>
          {/* Living Background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Soft glow blobs */}
            <div className="absolute -top-24 left-[-80px] h-72 w-72 rounded-full " />
            <div className="absolute top-40 right-[-60px] h-80 w-80 rounded-full " />
            <div className="absolute bottom-[-100px] left-1/3 h-96 w-96 rounded-full " />

            {/* Ambient stars */}
            <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              fullScreen: { enable: false },
              background: { color: "transparent" },
              fpsLimit: 60,

              particles: {
                number: {
                  value: 80,
                  density: { enable: true, area: 800 },
                },

                color: {
                  value: darkMode ? "#ffffff" : "#0f172a", // visible in both modes
                },

                size: {
                  value: { min: 1.5, max: 3 },
                },

                opacity: {
                  value: { min: 0.4, max: 1 },
                },

                move: {
                  enable: true,
                  speed: 0.5,
                  direction: "none",
                  random: true,
                },
              },

              interactivity: {
                events: {
                  onHover: { enable: true, mode: "repulse" },
                },
                modes: {
                  repulse: {
                    distance: 100,
                  },
                },
              },
            }}
            className="absolute inset-0 z-10"
          />

            {/* Shooting stars */}
            <Particles
              id="shooting"
              init={particlesInit}
              options={{
                fullScreen: { enable: false },

                particles: {
                  number: { value: 5 },

                  color: { value: "#ffffff" },

                  size: { value: 2 },

                  move: {
                    enable: true,
                    speed: 20,
                    direction: "top-right",
                    straight: true,
                    outModes: { default: "out" },
                  },

                  opacity: {
                    value: 1,
                  },
                },
              }}
              className="absolute inset-0 z-10"
            />
          </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-[-80px] h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-500/10" />
          <div className="absolute top-40 right-[-60px] h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-500/10" />
          <div className="absolute bottom-[-100px] left-1/3 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
              <header className="relative mx-auto mb-12 max-w-4xl text-center">

                  {/* Dark Mode Toggle */}
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    whileHover={{  scale: 1.02, y: -2 }}
                    onClick={() => setDarkMode((v) => !v)}
                    className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-full border border-slate-200/70 bg-white/60 px-3 py-2 shadow-sm backdrop-blur-xl transition hover:shadow-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/70 transition-all duration-300 ease-in-out"
                  >
                    <div className="relative h-5 w-10 rounded-full bg-slate-200 transition dark:bg-slate-700">
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md ${
                          darkMode ? "left-5" : "left-0.5"
                        }`}
                      />
                    </div>

                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {darkMode ? "Dark" : "Light"}
                    </span>
                  </motion.button>

                  {/* Tag */}
                 <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-5 py-2 text-xs font-semibold tracking-[0.25em] text-slate-600 shadow backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
                >
                  PROJECTPATH AI
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="mt-6 text-5xl font-black tracking-tight md:text-7xl"
                >
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.35)] dark:drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
                      ProjectPath AI
                    </span>
                  </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg dark:text-slate-300"
                >
                  Turn skills into projects, and projects into career growth.
                </motion.p>

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
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 py-3.5 font-semibold text-white shadow-lg hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-200"
                >
               {loading ? "🧠 AI is analyzing your profile..." : "🚀 Analyze Your Profile"}
            </motion.button>
            {!loading && !result && (
              <p className="
                  text-xs mt-3 text-center px-4 py-1.5 rounded-full inline-block mx-auto backdrop-blur
                  bg-yellow-100 text-yellow-800 border border-yellow-300
                  dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-400/20
                ">
                  💡 First request may take ~30–60 seconds (free server warm-up)
                </p>
            )}
          </motion.section>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 flex justify-center"
              >
                <div className="flex justify-center items-center mt-6">
                  <div className="bg-white/20 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <div>
                      <p className="font-semibold">🧠 Building your career path...</p>
                      <p className="text-xs text-gray-400">
                        This may take up to a minute on first request
                      </p>
                    </div>
                  </div>
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
                <div className="mb-8 grid gap-6 lg:grid-cols-3">

                    {/* LEFT: Chart */}
                    <motion.div
                      variants={sectionVariants}
                      initial="hidden"
                      animate="visible"
                      className="lg:col-span-2"
                    >                   
                        <div className="w-full h-[420px]">
                          <SkillChart skills={result.skills || []} />
                        </div>                     
                    </motion.div>

                    {/* RIGHT: KPI */}
                  <div className="flex flex-col gap-4">

                      <StatCard
                        title="📊 Resume Score"
                        value={
                          <>
                            <AnimatedNumber value={result.score} />/100
                          </>
                        }
                      />

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

              <div className="flex flex-col items-center gap-3">
                
                <p className="text-sm">
                  Built by{" "}
                  <span className="font-semibold text-slate-700 dark:text-white">
                    Himanshu Mali
                  </span>
                </p>

                <div className="flex items-center gap-4">
                  
                  <a
                    href="https://www.linkedin.com/in/himanshu-mali701/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm transition hover:scale-105 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-blue-400"                  >
                    💼 LinkedIn
                  </a>

                  <span className="text-xs opacity-150">
                    AI Career Tool 🚀
                  </span>

                </div>
              </div>
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
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75"
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 transition hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-indigo-500/10 blur-2xl" />
      </div>

      <div className="relative">
        {/* Title */}
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>

        {/* Value */}
        <p
          className={`mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white ${
            capitalize ? "capitalize" : ""
          }`}
        >
          {value}
        </p>
      </div>
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