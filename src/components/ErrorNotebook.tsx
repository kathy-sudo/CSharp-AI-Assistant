import React, { useState } from 'react';
import { MistakeItem } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  Flame,
  Sparkles,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface ErrorNotebookProps {
  mistakes: MistakeItem[];
  onToggleMastered: (id: string) => void;
}

export const ErrorNotebook: React.FC<ErrorNotebookProps> = ({
  mistakes,
  onToggleMastered
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('全部');
  const [filterMastered, setFilterMastered] = useState<string>('all'); // 'all' | 'unmastered' | 'mastered'
  const [activeMistakeId, setActiveMistakeId] = useState<string>(mistakes[0]?.id || '');
  const [variantTesting, setVariantTesting] = useState<boolean>(false);
  const [variantOptionChosen, setVariantOptionChosen] = useState<number | null>(null);
  const [variantAnswered, setVariantAnswered] = useState<boolean>(false);

  const topics = ['全部', '游戏数学', '物理引擎', '内存优化'];

  const filteredMistakes = mistakes.filter((m) => {
    const matchTopic = selectedTopic === '全部' || m.topic === selectedTopic;
    const matchStatus =
      filterMastered === 'all'
        ? true
        : filterMastered === 'mastered'
        ? m.mastered
        : !m.mastered;
    return matchTopic && matchStatus;
  });

  const activeMistake = mistakes.find((m) => m.id === activeMistakeId) || filteredMistakes[0];
  const masteredCount = mistakes.filter((m) => m.mastered).length;
  const eliminationRate = Math.round((masteredCount / (mistakes.length || 1)) * 100);

  const handleStartVariant = () => {
    setVariantTesting(true);
    setVariantOptionChosen(null);
    setVariantAnswered(false);
  };

  const handleFinishVariant = (isCorrect: boolean) => {
    setVariantAnswered(true);
    if (isCorrect && activeMistake && !activeMistake.mastered) {
      onToggleMastered(activeMistake.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            板块 7 · 游戏开发易错难点智能梳理
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            错题根因透视与变式专项攻坚
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            自动汇集作业与随堂测验中的高频陷阱，支持一键生成同类变式靶向消灭
          </p>
        </div>

        {/* Elimination Rate Card */}
        <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">已攻克错题</span>
            <span className="text-base font-bold text-white font-mono">{masteredCount} / {mistakes.length}</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div>
            <span className="text-slate-400 block text-[10px]">错题消灭率</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{eliminationRate}%</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> 领域筛选:
          </span>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedTopic === t
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setFilterMastered('all')}
            className={`px-2.5 py-1 rounded-md transition ${filterMastered === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
          >
            全部 ({mistakes.length})
          </button>
          <button
            onClick={() => setFilterMastered('unmastered')}
            className={`px-2.5 py-1 rounded-md transition ${filterMastered === 'unmastered' ? 'bg-rose-900/60 text-rose-200 font-bold' : 'text-slate-400'}`}
          >
            待消灭 ({mistakes.filter(m => !m.mastered).length})
          </button>
          <button
            onClick={() => setFilterMastered('mastered')}
            className={`px-2.5 py-1 rounded-md transition ${filterMastered === 'mastered' ? 'bg-emerald-900/60 text-emerald-200 font-bold' : 'text-slate-400'}`}
          >
            已攻克 ({masteredCount})
          </button>
        </div>
      </div>

      {/* Main Split: Left Mistakes List, Right Detail & Variant Test */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Mistake List */}
        <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
          {filteredMistakes.map((item) => {
            const isSelected = activeMistake?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveMistakeId(item.id);
                  setVariantTesting(false);
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition select-none text-xs space-y-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-950/40 to-slate-900 border-rose-500/80 shadow-md'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 font-medium">
                    {item.topic} · {item.category}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {item.errorFrequency > 2 && (
                      <span className="flex items-center gap-0.5 text-rose-400 font-bold text-[10px]" title="连续犯错多次">
                        <Flame className="w-3 h-3 fill-rose-400" />
                        高频 {item.errorFrequency}次
                      </span>
                    )}
                    {item.mastered ? (
                      <span className="text-emerald-400 text-[10px] font-bold">已攻克</span>
                    ) : (
                      <span className="text-amber-400 text-[10px]">待复习</span>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-slate-200 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-[10px] text-slate-500 font-mono">
                  最近记录: {item.errorDate}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right 2 Cols: Mistake In-depth Analysis & Variant Test */}
        <div className="lg:col-span-2">
          {activeMistake ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60 font-semibold">
                      {activeMistake.topic}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      归因分类：{activeMistake.category}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white mt-1.5">
                    {activeMistake.title}
                  </h2>
                </div>

                <button
                  onClick={() => onToggleMastered(activeMistake.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    activeMistake.mastered
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {activeMistake.mastered ? '已攻克掌握 (点击撤回)' : '手动标记已攻克'}
                </button>
              </div>

              {/* Comparison: Flawed vs Correct */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-rose-950/20 border border-rose-900/40 p-3.5 rounded-xl space-y-1.5">
                  <span className="text-rose-400 font-bold flex items-center gap-1 font-sans">
                    ❌ 学生原先的错误实现 / 误区理解:
                  </span>
                  <div className="p-2.5 bg-slate-950 rounded-lg text-rose-200 overflow-x-auto">
                    {activeMistake.studentAnswer}
                  </div>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/40 p-3.5 rounded-xl space-y-1.5">
                  <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
                    ✅ 工业级正解 / 引擎安全实践:
                  </span>
                  <div className="p-2.5 bg-slate-950 rounded-lg text-emerald-200 overflow-x-auto">
                    {activeMistake.correctAnswer}
                  </div>
                </div>
              </div>

              {/* AI Diagnosis */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                <h4 className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI 助教红笔剖析与根因定位
                </h4>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {activeMistake.aiDiagnosis}
                </p>
                <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-500 font-mono">
                  认知盲区根因：{activeMistake.rootCause}
                </div>
              </div>

              {/* Variant Practice Section */}
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white">
                      智能举一反三：变式挑战 (消灭该错题)
                    </h4>
                  </div>
                  {!variantTesting && (
                    <button
                      onClick={handleStartVariant}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> 开始变式考核
                    </button>
                  )}
                </div>

                {variantTesting && (
                  <div className="space-y-3 pt-2 text-xs">
                    <p className="text-slate-200 font-medium">
                      【变式题】：若要防止第一人称相机在俯仰极限位置产生万向节死锁，除了 Mathf.Clamp 角度以外，以下哪种做法是正确的？
                    </p>

                    <div className="space-y-1.5">
                      {[
                        'A. 将摄像机旋转改为直接对 Transform 矩阵施加非等比缩放',
                        'B. 将相机的局部旋转维护为一个四元数 Quaternion，通过增量绕轴旋转并定期规范化 (Normalize)',
                        'C. 每帧随机重置一次相机坐标'
                      ].map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          disabled={variantAnswered}
                          onClick={() => {
                            setVariantOptionChosen(oIdx);
                            handleFinishVariant(oIdx === 1);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg border transition ${
                            variantAnswered
                              ? oIdx === 1
                                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold'
                                : variantOptionChosen === oIdx
                                ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                              : variantOptionChosen === oIdx
                              ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {variantAnswered && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                        <span>
                          {variantOptionChosen === 1
                            ? '🎉 变式测试通过！已自动将该错题归入「已攻克」档案。'
                            : '❌ 回答有误，请重新阅读上方 AI 诊断后再行尝试。'}
                        </span>
                        <button
                          onClick={handleStartVariant}
                          className="text-cyan-400 hover:text-white flex items-center gap-1 ml-2 font-mono"
                        >
                          <RotateCcw className="w-3 h-3" /> 重试
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              暂无匹配的错题记录
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
