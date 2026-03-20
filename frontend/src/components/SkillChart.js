import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

function SkillChart({ skills }) {
  // Better mock logic (stable + smoother variation)
  const data = skills.map((skill, index) => ({
    skill: skill.length > 12 ? skill.slice(0, 12) + "…" : skill,
    value: 65 + (index * 7) % 30, // stable variation instead of full random
  }));

  if (!skills || skills.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/70">
        <h2 className="text-xl font-bold mb-2">📊 Skill Strength Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          No skills available to display.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl transition dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
    >
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
        📊 Skill Strength Profile
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data}>
          {/* Grid */}
          <PolarGrid
            strokeOpacity={0.2}
            className="dark:stroke-slate-700"
          />

          {/* Labels */}
          <PolarAngleAxis
            dataKey="skill"
            tick={{
              fill: "#64748b",
              fontSize: 12,
            }}
            className="dark:[&_text]:fill-slate-300"
          />

          {/* Radius */}
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{
              fill: "#94a3b8",
              fontSize: 10,
            }}
            className="dark:[&_text]:fill-slate-200"
          />

          {/* Radar */}
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#06b6d4"
            fill="#22d3ee"
            fillOpacity={0.4}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default SkillChart;