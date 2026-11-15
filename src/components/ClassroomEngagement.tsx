import React, { useState } from 'react';
import { EngagementData, UserRole } from '../types';
import { getClientFallbackParticipationAnalysis } from '../utils/aiFallback';
import {
  Activity,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Users,
  Clock,
  MessageCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface ClassroomEngagementProps {
  data: EngagementData;
  role: UserRole;
  onRefreshData?: () => void;
}

export const ClassroomEngagement: React.FC<ClassroomEngagementProps> = ({
  data,
  role
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<EngagementData>(data);

  const handleGenerateFreshAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionData: currentData })
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const result = await res.json();
      if (result && result.aiTeachingAdvice) {
        setCurrentData((prev) => ({
          ...prev,
          aiAdvice: result.aiTeachingAdvice
        }));
      }
    } catch {
      const fallback = getClientFallbackParticipationAnalysis();
      setCurrentData((prev) => ({
        ...prev,
        aiAdvice: fallback.aiTeachingAdvice
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            板块 9 · 课堂交互与专注度大数据智能分析
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            45分钟全流程课堂参与度洞察与学情雷达
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            动态捕捉学生注意力波峰波谷、答题时延、发问热度与理解阻力拐点
          </p>
        </div>

        {/* Refresh Analysis CTA */}
        <button
          onClick={handleGenerateFreshAnalysis}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-lg transition shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'AI 正在重新聚类研判...' : '重新生成 AI 教学督导建议'}
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>课堂专注度指数</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              {currentData.overallScore}%
            </span>
            <span className="text-emerald-400 font-bold text-[11px]">↑ +4.2%</span>
          </div>
          <p className="text-[10px] text-slate-500">高于学院工科平均线 (82%)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>课堂出勤与在线率</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
              {currentData.attendanceRate}%
            </span>
            <span className="text-slate-400 text-[11px]">48 / 50人</span>
          </div>
          <p className="text-[10px] text-slate-500">全员完成随堂签到与预习关联</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>随堂互动与抢答量</span>
            <MessageCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
              {currentData.interactionCount}
            </span>
            <span className="text-slate-400 text-[11px]">人次</span>
          </div>
          <p className="text-[10px] text-slate-500">人均随堂互动 7.1 次</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>抢答平均响应延时</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {currentData.averageResponseTime}s
            </span>
            <span className="text-emerald-400 font-bold text-[11px]">极速响应</span>
          </div>
          <p className="text-[10px] text-slate-500">知识掌握熟练度达标</p>
        </div>
      </div>

      {/* 45-Min Timeline Wave Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              45分钟授课节律 · 专注度与困惑度波形曲线
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              青色柱代表注意力指数，暗红曲线代表全班困惑度比例
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" /> 专注度指数 (Attention)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> 困惑度指数 (Confusion)
            </span>
          </div>
        </div>

        {/* Visual Wave Chart Grid */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {currentData.timelineData.map((slot) => {
              const isPeak = slot.attentionScore >= 95;
              const isConfusionHigh = slot.confusionIndex >= 50;

              return (
                <div
                  key={slot.minute}
                  className={`bg-slate-950 p-3.5 rounded-xl border text-xs space-y-2 flex flex-col justify-between ${
                    isConfusionHigh
                      ? 'border-rose-800/80'
                      : isPeak
                      ? 'border-cyan-500/80 shadow-md'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400">第 {slot.minute} 分钟</span>
                    {isPeak && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        注意力波峰
                      </span>
                    )}
                    {isConfusionHigh && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        难点阻力
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-slate-200 text-[11px] line-clamp-2 leading-tight">
                    {slot.activity}
                  </p>

                  <div className="space-y-1.5 pt-1 border-t border-slate-900 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">专注:</span>
                      <span className="text-cyan-400 font-bold">{slot.attentionScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${slot.attentionScore}%` }} />
                    </div>

                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-400">困惑:</span>
                      <span className="text-rose-400 font-bold">{slot.confusionIndex}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${slot.confusionIndex}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Hot Confusion Topics & AI Teacher Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hot Confusion Topics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              课堂提问热点聚类 & 困惑度排行
            </h3>
            <span className="text-[11px] text-slate-400">TOP 3 瓶颈</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {currentData.hotQuestions.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-cyan-400 font-bold">#0{idx + 1} 核心疑惑</span>
                  <span className="text-rose-400 font-mono font-bold">
                    全班困惑度：{item.confusionRate}%
                  </span>
                </div>
                <p className="font-semibold text-slate-200">
                  {item.topic}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>累计提出/点赞: {item.count} 次</span>
                  <span className="text-indigo-400">已列入课后AI专题巩固</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Teaching Advice for Teacher / Students */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              AI 智能教学改进与督导处方
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
              教学改进建议
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {currentData.aiAdvice.map((advice, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p>{advice}</p>
              </div>
            ))}

            <div className="bg-indigo-950/30 border border-indigo-500/30 p-3.5 rounded-xl space-y-1">
              <span className="font-bold text-indigo-300 text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                督导综合结论
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                本堂课师生双向代码沙盒互动效果显著，有效避免了传统“纯理论数学推导”导致的后排注意力脱轨问题。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
