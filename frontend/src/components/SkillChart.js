import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

function SkillChart({ skills }) {
  const isDark = document.documentElement.classList.contains("dark");

  const chartData = skills.map((skill, index) => ({
    skill: skill.length > 12 ? skill.slice(0, 12) + "…" : skill,
    value: 60 + ((index * 13) % 35), // better variation
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75"
    >
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
        📊 Skill Strength Profile
      </h2>

      <div className="dark:drop-shadow-[0_0_25px_rgba(34,211,238,0.25)]">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={chartData}>
            
            {/* Grid */}
            <PolarGrid
              stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            />

            {/* Labels */}
            <PolarAngleAxis
              dataKey="skill"
              tick={{
                fill: isDark ? "#cbd5f5" : "#334155",
                fontSize: 12,
              }}
            />

            {/* Radius */}
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{
                fill: isDark ? "#94a3b8" : "#64748b",
                fontSize: 10,
              }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#020617" : "#ffffff",
                border: "none",
                borderRadius: "10px",
                color: isDark ? "#e2e8f0" : "#0f172a",
              }}
            />

            {/* Animated Radar */}
            <Radar
              name="Skills"
              dataKey="value"
              stroke={isDark ? "#22d3ee" : "#0284c7"}
              fill={isDark ? "#22d3ee" : "#0ea5e9"}
              fillOpacity={0.35}
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={1200}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default SkillChart;