import React from 'react';
import { CompetencyDimension } from '../types';
import {
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface LearningReportProps {
  competencies: CompetencyDimension[];
  onNavigateToResources: () => void;
}

export const LearningReport: React.FC<LearningReportProps> = ({
  competencies,
  onNavigateToResources
}) => {
  const avgScore = Math.round(
    competencies.reduce((acc, cur) => acc + cur.score, 0) / (competencies.length || 1)
  );

  // SVG Radar Chart calculations
  const numDimensions = competencies.length;
  const radius = 90;
  const center = 120; // 240x240 box

  // Helper to get coordinates on polygon
  const getCoordinates = (index: number, score: number) => {
    const angle = (Math.PI * 2 / numDimensions) * index - Math.PI / 2;
    const r = (score / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Radar points for user score
  const userPoints = competencies
    .map((c, i) => {
      const { x, y } = getCoordinates(i, c.score);
      return `${x},${y}`;
    })
    .join(' ');

  // Grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            板块 4 · 全周期学情报告与能力画像
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            游戏程序设计六维能力模型与学情评估
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            实时融合预习、随堂测试、作业批改及错题本的大数据智能学情画像
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">综合能力评级</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-mono">
              {avgScore >= 90 ? 'S (卓越)' : avgScore >= 80 ? 'A (优良)' : 'B+ (良好)'}
            </span>
          </div>
          <div className="w-[1px] h-9 bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">综合得分</span>
            <span className="text-2xl font-black text-white font-mono">{avgScore} <span className="text-xs text-slate-500 font-normal">/100</span></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar & Competency Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: SVG Radar Chart */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center space-y-4">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" />
              游戏研发核心六维雷达
            </h3>
            <span className="text-[10px] text-slate-400">更新时间：今日 22:50</span>
          </div>

          <div className="relative w-full aspect-square max-w-[280px]">
            <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
              {/* Background Concentric Polygons */}
              {gridLevels.map((lvl, lIdx) => {
                const pts = competencies
                  .map((_, i) => {
                    const { x, y } = getCoordinates(i, lvl * 100);
                    return `${x},${y}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={lIdx}
                    points={pts}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray={lIdx === 3 ? 'none' : '3 3'}
                  />
                );
              })}

              {/* Axis lines */}
              {competencies.map((_, i) => {
                const { x, y } = getCoordinates(i, 100);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                );
              })}

              {/* User Competency Polygon */}
              <polygon
                points={userPoints}
                fill="rgba(6, 182, 212, 0.25)"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Points & Labels */}
              {competencies.map((c, i) => {
                const pt = getCoordinates(i, c.score);
                const labelPt = getCoordinates(i, 118);
                return (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
                    <text
                      x={labelPt.x}
                      y={labelPt.y}
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {c.name} ({c.score})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-[11px] text-slate-400 text-center font-sans">
            青色区域为你的实际综合技能轮廓，面积越大代表综合综合工程能力越均衡
          </p>
        </div>

        {/* Right 7 Cols: Detailed Dimensions List */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            各维度掌握细目与评语
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {competencies.map((comp) => {
              const isLow = comp.score < 75;
              return (
                <div
                  key={comp.name}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    isLow
                      ? 'bg-rose-950/20 border-rose-800/40'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{comp.name}</span>
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        isLow
                          ? 'bg-rose-900 text-rose-200'
                          : comp.score >= 90
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-cyan-950 text-cyan-300'
                      }`}
                    >
                      {comp.score}分 · {comp.level}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isLow ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                      }`}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {comp.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Academic Diagnosis & Improvement Prescription */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              AI 教学大数据学情诊断与提分处方
            </h3>
          </div>
          <button
            onClick={onNavigateToResources}
            className="text-xs text-indigo-300 hover:text-white font-semibold flex items-center gap-1 transition"
          >
            前往推荐资源巩固 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> 优势壁垒 (Strengths)
            </div>
            <p className="text-slate-300 leading-relaxed">
              在【游戏数学】(91分) 与【游戏AI】(89分) 表现优异，具备扎实的三维空间几何基础，有限状态机与行为树逻辑严密。
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-rose-400 font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> 重点攻坚短板 (Bottlenecks)
            </div>
            <p className="text-slate-300 leading-relaxed">
              【图形学与着色器】得分仅 68 分。主要失分点为顶点变换流水线、透视裁剪与片元着色器光照公式推导，属于当前进阶瓶颈。
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> 本周提分建议 (Action Plan)
            </div>
            <p className="text-slate-300 leading-relaxed">
              系统已在「个性化资源推荐」中为你匹配了《LearnOpenGL MVP流水线》与着色器实机演练，预计投入 3.5 小时即可突破 80 分。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
