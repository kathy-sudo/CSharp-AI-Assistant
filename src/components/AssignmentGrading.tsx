import React, { useState } from 'react';
import { AssignmentPreset, GradeResult } from '../types';
import { getClientFallbackGrading } from '../utils/aiFallback';
import {
  FileCode,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Layers,
  Flame,
  Award
} from 'lucide-react';

interface AssignmentGradingProps {
  presets: AssignmentPreset[];
}

export const AssignmentGrading: React.FC<AssignmentGradingProps> = ({ presets }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0]?.id || '');
  const [userCode, setUserCode] = useState<string>(presets[0]?.defaultCode || '');
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const activePreset = presets.find((p) => p.id === selectedPresetId) || presets[0];

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const target = presets.find((p) => p.id === presetId);
    if (target) {
      setUserCode(target.defaultCode);
      setGradeResult(null);
    }
  };

  const handleStartGrading = async () => {
    setIsGrading(true);
    try {
      const res = await fetch('/api/grade-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activePreset?.title || '游戏作业',
          assignmentPrompt: activePreset?.description || '',
          code: userCode,
          language: activePreset?.language || 'cpp'
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setGradeResult(data);
    } catch {
      setGradeResult(getClientFallbackGrading(activePreset?.title || '游戏作业', userCode));
    } finally {
      setIsGrading(false);
    }
  };

  const handleCopyCode = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
            <FileCode className="w-3.5 h-3.5" />
            板块 6 · 游戏工程作业 AI 智能多维批阅
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            代码静态分析与工业级游戏引擎规范评审
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            深度检测内存泄漏、GC微顿挫、半隐式积分稳定性与多线程安全性
          </p>
        </div>

        {/* Action Trigger */}
        <button
          onClick={handleStartGrading}
          disabled={isGrading || !userCode.trim()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-xl transition disabled:opacity-50 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          {isGrading ? 'AI 静态引擎批改中...' : '一键启动 AI 工业级深度批阅'}
        </button>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400 font-medium">切换作业题目：</span>
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelectPreset(preset.id)}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              selectedPresetId === preset.id
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {preset.title.split('：')[0]} ({preset.language.toUpperCase()})
          </button>
        ))}
      </div>

      {/* Main Grid: Left Code Editor, Right Grading Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Code Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <div>
              <h3 className="font-bold text-white">{activePreset?.title}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{activePreset?.description}</p>
            </div>
            <button
              onClick={() => setUserCode(activePreset?.defaultCode || '')}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              title="重置为默认参考模板代码"
            >
              <RefreshCw className="w-3 h-3" /> 重置代码
            </button>
          </div>

          {/* Code Textarea */}
          <div className="relative flex-1 min-h-[420px]">
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-full min-h-[420px] bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-cyan-300 leading-relaxed focus:outline-none focus:border-cyan-500 resize-none selection:bg-cyan-900"
              spellCheck={false}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
            <span>支持 C++ / C# / HLSL 静态语法树与算法逻辑审查</span>
            <span>字符数: {userCode.length}</span>
          </div>
        </div>

        {/* Right Col: Grading Report */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg min-h-[480px]">
          {isGrading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[380px] space-y-3 text-center">
              <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-sm font-bold text-white">AI 正在深度审查代码...</p>
              <p className="text-xs text-slate-400 max-w-sm">
                分析抽象语法树 (AST)、刚体冲量恢复物理正确性、GC 分配热点与内存边界
              </p>
            </div>
          ) : gradeResult ? (
            <div className="space-y-4 animate-fade-in text-xs">
              {/* Score Header */}
              <div className="bg-gradient-to-r from-slate-950 to-indigo-950/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">综合得分判定</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-mono">
                      {gradeResult.totalScore}
                    </span>
                    <span className="text-sm font-bold text-slate-400">/ 100 分</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">评级等第</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {gradeResult.letterGrade}
                  </span>
                </div>
              </div>

              {/* 4 Dimension Bars */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-white text-xs">四维工程质量评估细则：</h4>
                {gradeResult.dimensions?.map((dim, idx) => (
                  <div key={idx} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-200">{dim.name}</span>
                      <span className="font-mono text-cyan-400 font-bold">{dim.score} / {dim.maxScore}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">{dim.comment}</p>
                  </div>
                ))}
              </div>

              {/* Strengths & Bugs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl space-y-1.5">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 优秀亮点
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {gradeResult.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl space-y-1.5">
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> 潜在缺陷与隐患
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {gradeResult.flawsAndBugs?.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Refactored Snippet */}
              {gradeResult.refactoredSnippet && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      AI 推荐重构优化方案 (消除隐患)
                    </span>
                    <button
                      onClick={() => handleCopyCode(gradeResult.refactoredSnippet)}
                      className="text-cyan-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet ? '已复制' : '复制重构代码'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 bg-slate-900 rounded-lg font-mono text-[11px] text-cyan-300 overflow-x-auto">
                    {gradeResult.refactoredSnippet}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[380px] space-y-3 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-cyan-400/60 animate-bounce" />
              <p className="text-sm font-semibold text-slate-300">准备就绪，等待批阅</p>
              <p className="text-xs max-w-sm">
                点击上方「一键启动 AI 工业级深度批阅」，即可获得全方位的规范性打分、漏洞警报与重构示范代码。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
