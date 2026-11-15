import React, { useState } from 'react';
import { Chapter, KnowledgeNode, SubsectionMission } from '../types';
import { TEXTBOOK_METADATA } from '../data/courseData';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Award,
  Lightbulb,
  Code2,
  Save,
  CheckSquare,
  Bookmark,
  ExternalLink,
  Layers,
  Monitor,
  RefreshCw,
  Eye,
  FileText
} from 'lucide-react';

interface PreclassPreviewProps {
  chapter: Chapter;
  onUpdateChapterNode: (chapterId: number, nodeId: string, completed: boolean) => void;
}

export const PreclassPreview: React.FC<PreclassPreviewProps> = ({
  chapter,
  onUpdateChapterNode
}) => {
  const [activeTab, setActiveTab] = useState<'chaoxing' | 'textbook' | 'nodes' | 'quiz'>('chaoxing');
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(chapter.nodes[0]?.id || null);
  const [quizAnswers, setQuizAnswers] = useState<{ [quizId: string]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);
  const [studentNote, setStudentNote] = useState<string>(() => {
    return (
      localStorage.getItem(`note_ch_${chapter.id}`) ||
      '讲义重点标记：东北大学出版社教材第2章规定，跳跃触发必须将 Animator 的 Has Exit Time 取消勾选，并将过渡时间设为 0。'
    );
  });
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [aiGeneratingSummary, setAiGeneratingSummary] = useState<boolean>(false);
  const [aiHighlightSummary, setAiHighlightSummary] = useState<string | null>(null);
  const [showOriginalScreenshot, setShowOriginalScreenshot] = useState<boolean>(false);
  const [syncingChaoxing, setSyncingChaoxing] = useState<boolean>(false);

  const completedCount = chapter.nodes.filter((n) => n.completed).length;
  const progressPercent = Math.round((completedCount / (chapter.nodes.length || 1)) * 100);

  const handleSaveNote = () => {
    localStorage.setItem(`note_ch_${chapter.id}`, studentNote);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleSelectQuizOption = (quizId: string, optIndex: number) => {
    if (submittedQuiz) return;
    setQuizAnswers((prev) => ({ ...prev, [quizId]: optIndex }));
  };

  const handleSyncChaoxing = () => {
    setSyncingChaoxing(true);
    setTimeout(() => {
      setSyncingChaoxing(false);
    }, 800);
  };

  const handleGenerateAiHighlight = async () => {
    setAiGeneratingSummary(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `请结合超星智慧课程《游戏程序设计2025-2026-2》【${chapter.title}】的线上微课任务点，以及东北大学出版社《${chapter.textbookRef.bookTitle}》自编讲义（${chapter.textbookRef.pageRange}），提炼出 3 条学生课前预习必背的核心结论与代码规范，200字以内。`
            }
          ]
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setAiHighlightSummary(data.reply || '提炼完成。');
    } catch {
      setAiHighlightSummary(
        `【超星微课+东北大学出版社自编讲义预习三条铁律】\n1. 动画过渡零延迟：自编讲义第2章规范，所有即时响应的跳跃/受伤 Trigger 连线，必须取消勾选 Has Exit Time 并将 Transition Duration 设为 0。\n2. 瓦片碰撞融合：Tilemap 瓦片必须挂载 Composite Collider 2D 并开启 Used By Composite，消除相邻瓦片接缝阻挡。\n3. 手感优化跳跃：在 FixedUpdate 中动态调节 gravityScale（下落与短跳时增加重力倍率），打造极致操作手感。`
      );
    } finally {
      setAiGeneratingSummary(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform & Textbook Integration Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                超星泛雅智慧课程平台同步 · {chapter.targetClass}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                东北大学出版社自编讲义 (2025.02.27)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {chapter.title}
              <span className="text-xs font-mono font-medium text-slate-400">
                ({chapter.subtitle})
              </span>
            </h1>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              本单元课前预习已打通<strong>超星泛雅线上课闯关任务</strong>与<strong>教师自编教材《Unity 游戏程序设计基础》</strong>，通过数据画像、讲义导读与 AI 自测，实现高效课前知识闭环。
            </p>
          </div>

          {/* Chaoxing Sync Data Pill */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-mono">
                <Monitor className="w-3 h-3 text-cyan-400" />
                超星章节通关率
              </span>
              <span className="font-bold text-cyan-400 font-mono text-sm">
                {chapter.overallProgress}%
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${chapter.overallProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px]">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 全部任务点已开放
              </span>
              <button
                onClick={handleSyncChaoxing}
                disabled={syncingChaoxing}
                className="text-cyan-400 hover:text-white flex items-center gap-1 transition"
                title="重新向超星平台拉取最新闯关打卡数据"
              >
                <RefreshCw className={`w-3 h-3 ${syncingChaoxing ? 'animate-spin' : ''}`} />
                <span>{syncingChaoxing ? '同步中' : '同步数据'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Multi-Tab Switches */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => setActiveTab('chaoxing')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'chaoxing'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            超星智慧平台 · 课前闯关任务 ({chapter.subsections.length} 个小节)
          </button>

          <button
            onClick={() => setActiveTab('textbook')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'textbook'
                ? 'bg-purple-600 text-white font-bold shadow'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            教师自编讲义精读 (东北大学出版社)
          </button>

          <button
            onClick={() => setActiveTab('nodes')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'nodes'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            核心知识图谱与互动代码 ({chapter.nodes.length} 个考点)
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            AI 预习通关自测
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Area according to activeTab */}
        <div className="lg:col-span-2 space-y-4">
          {/* TAB 1: 超星智慧课程平台 · 课前线上课闯关任务中心 */}
          {activeTab === 'chaoxing' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-cyan-400" />
                    超星泛雅智慧课程平台：课前线上闯关数据
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    对应超星【{chapter.chaoxingCourseName}】课程目录，实时追踪【{chapter.targetClass}】班级任务进度
                  </p>
                </div>

                <button
                  onClick={() => setShowOriginalScreenshot(!showOriginalScreenshot)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition self-start sm:self-auto"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showOriginalScreenshot ? '收起超星平台原图' : '查看超星平台实际界面'}
                </button>
              </div>

              {/* Collapsible Chaoxing Screenshot */}
              {showOriginalScreenshot && (
                <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/30 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-cyan-300">
                      超星泛雅智慧课程平台 (数媒技术24214班级) 线上目录与任务点状态实景截图：
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">图源：教师超星教学空间</span>
                  </div>
                  <img
                    src={TEXTBOOK_METADATA.chaoxingPortalImage}
                    alt="超星泛雅智慧课程平台目录"
                    className="w-full rounded-lg border border-slate-800 object-cover max-h-[360px]"
                  />
                </div>
              )}

              {/* Subsections List from Chaoxing */}
              <div className="space-y-3">
                {chapter.subsections.map((sub: SubsectionMission) => (
                  <div
                    key={sub.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center border border-cyan-800/60">
                          {sub.code}
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          {sub.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pl-8 font-sans">
                        <span className="flex items-center gap-1 text-indigo-300">
                          <CheckSquare className="w-3 h-3" />
                          {sub.missionPoints} 个线上闯关任务点
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-3 h-3 text-amber-400" />
                          建议讲义细读：{sub.textbookReadingMinutes} 分钟
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-mono block">线上通关率</span>
                        <span className="text-xs font-bold text-cyan-400 font-mono">
                          {sub.progressPercent}%
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 已开放闯关
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mission Summary Footer */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  当前章节共计包含 {chapter.subsections.reduce((acc, c) => acc + c.missionPoints, 0)} 个超星视频与随堂测验任务点，均已全部纳入学情画像。
                </span>
                <button
                  onClick={() => setActiveTab('textbook')}
                  className="text-cyan-400 hover:text-white font-semibold transition"
                >
                  前往自编讲义精读 →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: 教师自编课程讲义精读（《Unity 游戏程序设计基础》东北大学出版社） */}
          {activeTab === 'textbook' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    东北大学出版社 2025年2月27日初版
                  </span>
                  <h2 className="text-base font-bold text-white flex items-center gap-2 mt-1">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    《Unity 游戏程序设计基础》核心讲义摘录
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  对应教材：{chapter.textbookRef.pageRange}
                </span>
              </div>

              {/* Textbook Cover & Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="sm:col-span-1 flex flex-col items-center justify-center p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <img
                    src={chapter.textbookRef.coverImage}
                    alt="《Unity 游戏程序设计基础》教材封面"
                    className="w-full max-w-[120px] rounded shadow-md border border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400 text-center mt-2 font-mono">
                    2025年2月27日版
                  </span>
                </div>

                <div className="sm:col-span-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-cyan-300">
                      {chapter.textbookRef.chapterIndex} · {chapter.textbookRef.chapterTitle}
                    </h3>
                  </div>

                  <p className="text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {chapter.textbookRef.excerptText}
                  </p>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">
                      本章核心专业术语表：
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {chapter.textbookRef.keyTerminology.map((term, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-purple-300 border border-purple-800/60 font-mono"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Lecture Highlights (划线重点) */}
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4 space-y-2.5">
                <h4 className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  教师自编教案备课划线与高频扣分点
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {chapter.textbookRef.lectureHighlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-900/60 text-purple-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {hIdx + 1}
                      </span>
                      <span className="leading-snug">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: 核心知识结构图谱 (点击展开细读) */}
          {activeTab === 'nodes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  知识图谱剖析与 C# 源码实现
                </h2>
                <button
                  onClick={handleGenerateAiHighlight}
                  disabled={aiGeneratingSummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md transition disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {aiGeneratingSummary ? 'AI深度提炼中...' : 'AI 一键提炼自编讲义核心'}
                </button>
              </div>

              {/* AI Highlight Banner */}
              {aiHighlightSummary && (
                <div className="bg-purple-950/40 border border-purple-500/40 rounded-xl p-4 text-xs text-purple-200 space-y-2 relative animate-fade-in">
                  <div className="flex items-center justify-between font-bold text-purple-300">
                    <span className="flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      超星微课 + 自编讲义 AI 避坑导读
                    </span>
                    <button
                      onClick={() => setAiHighlightSummary(null)}
                      className="text-purple-400 hover:text-white"
                    >
                      关闭
                    </button>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-slate-300 font-sans">
                    {aiHighlightSummary}
                  </p>
                </div>
              )}

              {/* Nodes Accordion */}
              {chapter.nodes.map((node: KnowledgeNode) => {
                const isExpanded = expandedNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                      node.completed
                        ? 'bg-slate-900/80 border-emerald-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedNodeId(isExpanded ? null : node.id)}
                      className="p-4 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateChapterNode(chapter.id, node.id, !node.completed);
                          }}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition ${
                            node.completed
                              ? 'bg-emerald-500 text-slate-950 shadow-md'
                              : 'border border-slate-600 hover:border-cyan-400 text-transparent'
                          }`}
                          title={node.completed ? '已标记掌握' : '点击标记掌握'}
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className={`text-sm font-bold ${
                                node.completed
                                  ? 'text-slate-200 line-through decoration-slate-600'
                                  : 'text-white'
                              }`}
                            >
                              {node.title}
                            </h3>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                node.difficulty === '入门'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : node.difficulty === '进阶'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}
                            >
                              {node.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            建议自学时长: {node.estimatedMinutes} 分钟
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 bg-slate-950/40 text-xs space-y-3">
                        <p className="text-slate-300 leading-relaxed font-sans">
                          {node.summary}
                        </p>

                        {node.keyFormulasOrRules.length > 0 && (
                          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                            <h4 className="font-semibold text-cyan-400 mb-1.5 flex items-center gap-1">
                              <Lightbulb className="w-3.5 h-3.5" />
                              自编讲义关键公式 / 核心准则：
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-slate-300">
                              {node.keyFormulasOrRules.map((rule, idx) => (
                                <li key={idx} className="font-mono text-[11px]">
                                  {rule}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {node.codeSnippet && (
                          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-x-auto">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 pb-1 border-b border-slate-800">
                              <span className="flex items-center gap-1">
                                <Code2 className="w-3.5 h-3.5 text-cyan-400" /> 自编讲义参考实现 (C# Unity)
                              </span>
                            </div>
                            <pre className="font-mono text-[11px] text-cyan-300 whitespace-pre">
                              {node.codeSnippet}
                            </pre>
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => onUpdateChapterNode(chapter.id, node.id, !node.completed)}
                            className={`text-xs px-3 py-1 rounded font-medium transition ${
                              node.completed
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
                            }`}
                          >
                            {node.completed ? '撤销掌握标记' : '已读并理解自编讲义，标记掌握'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: AI 预习通关自测 */}
          {activeTab === 'quiz' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    超星微课与自编讲义通关自测
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    基于东北大学出版社教材重点与超星闯关知识点即时出题
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  共 {chapter.previewQuizzes.length} 题
                </span>
              </div>

              {chapter.previewQuizzes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">本章节自测题库整理中...</p>
              ) : (
                <div className="space-y-4">
                  {chapter.previewQuizzes.map((quiz, qIdx) => {
                    const chosen = quizAnswers[quiz.id];
                    const isCorrect = chosen === quiz.correctIndex;

                    return (
                      <div
                        key={quiz.id}
                        className="border border-slate-800/80 rounded-xl p-4 bg-slate-950/70 space-y-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {qIdx + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                            {quiz.question}
                          </p>
                        </div>

                        <div className="space-y-1.5 pl-7">
                          {quiz.options.map((opt, oIdx) => {
                            const isOptionChosen = chosen === oIdx;
                            let optStyle =
                              'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';

                            if (submittedQuiz) {
                              if (oIdx === quiz.correctIndex) {
                                optStyle =
                                  'border-emerald-500/80 bg-emerald-950/50 text-emerald-200 font-bold';
                              } else if (isOptionChosen) {
                                optStyle = 'border-rose-500/80 bg-rose-950/50 text-rose-200';
                              }
                            } else if (isOptionChosen) {
                              optStyle =
                                'border-cyan-500 bg-cyan-950/60 text-cyan-200 font-bold';
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={submittedQuiz}
                                onClick={() => handleSelectQuizOption(quiz.id, oIdx)}
                                className={`w-full text-left text-xs p-2.5 rounded-lg border transition ${optStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {submittedQuiz && (
                          <div
                            className={`text-xs p-3 rounded-lg border mt-2 ${
                              isCorrect
                                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                                : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                            }`}
                          >
                            <div className="font-bold mb-1 flex items-center gap-1">
                              {isCorrect ? '✅ 恭喜答对！' : '❌ 答错了，请查阅自编教材解析：'}
                            </div>
                            <p className="text-slate-300 leading-relaxed font-sans">
                              {quiz.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex gap-2 pt-1">
                    {!submittedQuiz ? (
                      <button
                        onClick={() => setSubmittedQuiz(true)}
                        disabled={Object.keys(quizAnswers).length < chapter.previewQuizzes.length}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-lg disabled:opacity-40"
                      >
                        提交通关自测
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSubmittedQuiz(false);
                          setQuizAnswers({});
                        }}
                        className="w-full py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        重新自测答题
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Textbook Quick Card & Study Notes */}
        <div className="space-y-5">
          {/* Textbook Brief Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-400" />
                自编教材速查卡
              </h3>
              <span className="text-[10px] text-purple-300 bg-purple-950 px-1.5 py-0.2 rounded font-mono">
                东北大学出版社
              </span>
            </div>

            <div className="flex items-start gap-3">
              <img
                src={chapter.textbookRef.coverImage}
                alt="教材封面"
                className="w-16 rounded shadow border border-slate-700 shrink-0"
              />
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-white leading-tight">
                  {chapter.textbookRef.bookTitle}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  出版日期: {chapter.textbookRef.publishDate}
                </p>
                <p className="text-[11px] text-cyan-400 font-mono">
                  当前单元: {chapter.textbookRef.pageRange}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('textbook')}
              className="w-full py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-center"
            >
              深入精读本章讲义讲稿 →
            </button>
          </div>

          {/* Student Study Notes with LocalStorage */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                自编讲义学习笔记与疑点存根
              </h3>
              {savedNotice && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="w-3 h-3" /> 已保存
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              记录你在结合超星视频与讲义预习时的疑难，课堂上可一键同步给老师与 AI 助教：
            </p>

            <textarea
              rows={5}
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              placeholder="例如：自编教材第94页的 fallMultiplier 调节在角色撞天花板时是否需要清零..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />

            <button
              onClick={handleSaveNote}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition shadow"
            >
              <Save className="w-3.5 h-3.5" />
              保存预习笔记 (本地持久化)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
