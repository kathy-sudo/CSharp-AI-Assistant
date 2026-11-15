import React, { useState } from 'react';
import { PracticeQuestion } from '../types';
import { getClientFallbackPracticeQuestion } from '../utils/aiFallback';
import {
  CheckSquare,
  Sparkles,
  Filter,
  CheckCircle2,
  XCircle,
  Code,
  Award,
  Layers,
  ChevronRight,
  RefreshCw,
  PlusCircle
} from 'lucide-react';

interface PostclassPracticeProps {
  questions: PracticeQuestion[];
  onAnswerQuestion: (questionId: string, answer: string) => void;
  onAddQuestion: (newQ: PracticeQuestion) => void;
}

const CATEGORIES = ['全部', '游戏数学', '引擎架构', '物理与碰撞', '图形与着色器', '游戏AI', '内存与性能'];
const DIFFICULTIES = ['全部', '基础', '中等', '挑战', 'GDC级'];

export const PostclassPractice: React.FC<PostclassPracticeProps> = ({
  questions,
  onAnswerQuestion,
  onAddQuestion
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('全部');
  const [activeQuestionId, setActiveQuestionId] = useState<string>(questions[0]?.id || '');
  const [isGeneratingAiQuestion, setIsGeneratingAiQuestion] = useState<boolean>(false);
  const [aiGenerateTopic, setAiGenerateTopic] = useState<string>('游戏数学');
  const [aiGenerateDifficulty, setAiGenerateDifficulty] = useState<string>('中等');

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchCat = selectedCategory === '全部' || q.category === selectedCategory;
    const matchDiff = selectedDifficulty === '全部' || q.difficulty === selectedDifficulty;
    return matchCat && matchDiff;
  });

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) || filteredQuestions[0];
  const solvedCount = questions.filter((q) => q.solved).length;
  const accuracy = Math.round(
    (questions.filter((q) => q.solved && q.userAnswer === q.correctAnswer).length /
      Math.max(1, solvedCount)) *
      100
  );

  const handleAiGenerate = async () => {
    setIsGeneratingAiQuestion(true);
    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiGenerateTopic,
          difficulty: aiGenerateDifficulty
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data && data.title) {
        const newQ: PracticeQuestion = {
          id: data.id || `ai-${Date.now()}`,
          category: (aiGenerateTopic as any) || '游戏数学',
          difficulty: (aiGenerateDifficulty as any) || '中等',
          title: data.title,
          description: data.title,
          codeSnippet: data.codeSnippet,
          options: data.options || [
            { id: 'A', text: '选项 A' },
            { id: 'B', text: '选项 B' }
          ],
          correctAnswer: data.correctAnswer || 'A',
          explanation: data.detailedExplanation || 'AI 生成解析',
          solved: false
        };
        onAddQuestion(newQ);
        setActiveQuestionId(newQ.id);
      }
    } catch {
      const fallbackQ = getClientFallbackPracticeQuestion(aiGenerateTopic, aiGenerateDifficulty);
      onAddQuestion(fallbackQ);
      setActiveQuestionId(fallbackQ.id);
    } finally {
      setIsGeneratingAiQuestion(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            板块 3 · 课后巩固进阶练习题库
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            游戏研发工程实战专项题库
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            覆盖 C++/C# 内存管理、游戏数学、碰撞检测、HLSL 着色器与 ECS 架构实战题
          </p>
        </div>

        {/* Stats card */}
        <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-xs">
          <div>
            <div className="text-slate-400">已做题数</div>
            <div className="text-sm font-bold text-white font-mono">{solvedCount} / {questions.length}</div>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div>
            <div className="text-slate-400">答题正确率</div>
            <div className="text-sm font-bold text-cyan-400 font-mono">{accuracy}%</div>
          </div>
        </div>
      </div>

      {/* Filter and AI Question Generator Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        {/* Category & Difficulty pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> 领域:
          </span>
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* AI Question Button Trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={aiGenerateTopic}
            onChange={(e) => setAiGenerateTopic(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2 py-1"
          >
            <option value="游戏数学">游戏数学</option>
            <option value="物理与碰撞">物理与碰撞</option>
            <option value="图形与着色器">图形与着色器</option>
            <option value="内存与性能">内存与性能</option>
            <option value="引擎架构">引擎架构</option>
          </select>

          <button
            onClick={handleAiGenerate}
            disabled={isGeneratingAiQuestion}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGeneratingAiQuestion ? 'AI 正在编写考题...' : '✨ AI 薄弱点定制出题'}
          </button>
        </div>
      </div>

      {/* Main Split: Left Question List, Right Active Question Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Question Cards List */}
        <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
              该分类下暂无习题，欢迎点击右上角「AI 定制出题」生成！
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const isSelected = activeQuestion?.id === q.id;
              const isSolved = q.solved;
              const isCorrect = q.userAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition select-none text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/60 to-slate-900 border-cyan-500/80 shadow-md'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-slate-400">#{idx + 1}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 font-medium">
                        {q.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          q.difficulty === '基础'
                            ? 'bg-emerald-950 text-emerald-400'
                            : q.difficulty === '中等'
                            ? 'bg-blue-950 text-blue-400'
                            : 'bg-purple-950 text-purple-400'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      {isSolved && (
                        <span>
                          {isCorrect ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="font-semibold text-slate-200 line-clamp-1">
                    {q.title}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right 2 Cols: Question Detail & Interactive Answer Panel */}
        <div className="lg:col-span-2">
          {activeQuestion ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold">
                    {activeQuestion.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    难度：{activeQuestion.difficulty}
                  </span>
                </div>

                {activeQuestion.solved && (
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      activeQuestion.userAnswer === activeQuestion.correctAnswer
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {activeQuestion.userAnswer === activeQuestion.correctAnswer
                      ? '已解答正确'
                      : '解答错误，需强化复习'}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {activeQuestion.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {activeQuestion.description}
                </p>
              </div>

              {/* Code Snippet if present */}
              {activeQuestion.codeSnippet && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs overflow-x-auto text-cyan-300">
                  <pre>{activeQuestion.codeSnippet}</pre>
                </div>
              )}

              {/* Interactive Options */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  请选择你的解答：
                </label>
                {activeQuestion.options.map((opt) => {
                  const isChosen = activeQuestion.userAnswer === opt.id;
                  const isCorrect = opt.id === activeQuestion.correctAnswer;
                  const isSolved = activeQuestion.solved;

                  let optClass = 'border-slate-800 bg-slate-950/70 text-slate-200 hover:border-slate-700';

                  if (isSolved) {
                    if (isCorrect) {
                      optClass = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-bold';
                    } else if (isChosen) {
                      optClass = 'border-rose-500/80 bg-rose-950/40 text-rose-200';
                    }
                  } else if (isChosen) {
                    optClass = 'border-cyan-500 bg-cyan-950/50 text-cyan-200 font-bold';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => onAnswerQuestion(activeQuestion.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-start gap-3 ${optClass}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {opt.id}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation section if answered */}
              {activeQuestion.solved && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> 工业级标准解析与考点分析
                    </span>
                    <span className="text-slate-400 font-mono">
                      正确答案: {activeQuestion.correctAnswer}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    {activeQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              请在左侧列表选择一道题目开始练习
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
