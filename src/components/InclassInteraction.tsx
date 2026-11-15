import React, { useState, useEffect, useRef } from 'react';
import { LiveQuizQuestion, LiveMessage } from '../types';
import {
  Radio,
  Timer,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  HelpCircle,
  Hand,
  Send,
  Sparkles,
  Sliders,
  Play,
  RotateCcw
} from 'lucide-react';

interface InclassInteractionProps {
  quiz: LiveQuizQuestion;
  messages: LiveMessage[];
  onAddMessage: (msg: LiveMessage) => void;
  onUpvoteMessage: (id: string) => void;
}

export const InclassInteraction: React.FC<InclassInteractionProps> = ({
  quiz,
  messages,
  onAddMessage,
  onUpvoteMessage
}) => {
  // Live Quiz State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(quiz.timeLimitSeconds);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  // Classroom Live Reaction Counters
  const [handsRaised, setHandsRaised] = useState<number>(8);
  const [confusedCount, setConfusedCount] = useState<number>(14);
  const [understoodCount, setUnderstoodCount] = useState<number>(45);
  const [hasInteractedReaction, setHasInteractedReaction] = useState<string | null>(null);

  // New Question Input
  const [newQuestionText, setNewQuestionText] = useState<string>('');

  // Interactive Visualizer Tabs: 'vector' | 'gameloop'
  const [activeVisualizer, setActiveVisualizer] = useState<'vector' | 'gameloop'>('vector');

  // Vector Visualizer State
  // Player forward angle (degrees) and Enemy direction angle (degrees)
  const [playerAngle, setPlayerAngle] = useState<number>(0); // 0 = pointing right (1, 0)
  const [targetAngle, setTargetAngle] = useState<number>(45);

  // Game Loop Simulator State
  const [simFps, setSimFps] = useState<number>(60);
  const [fixedHz, setFixedHz] = useState<number>(50); // 50Hz = 20ms
  const [isLoopRunning, setIsLoopRunning] = useState<boolean>(true);
  const [accumulatedTicks, setAccumulatedTicks] = useState<number>(128);

  // Quiz countdown
  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  // Vector Math calculations
  const radP = (playerAngle * Math.PI) / 180;
  const radT = (targetAngle * Math.PI) / 180;
  const pVec = { x: Math.cos(radP), y: -Math.sin(radP) }; // inverted Y for canvas
  const tVec = { x: Math.cos(radT), y: -Math.sin(radT) };
  // Dot product
  const dotProduct = pVec.x * tVec.x + (-pVec.y) * (-tVec.y); // using standard math y
  // Angle difference between them
  let diffDeg = Math.abs(playerAngle - targetAngle) % 360;
  if (diffDeg > 180) diffDeg = 360 - diffDeg;

  let combatStatus = '侧向受击';
  let combatColor = 'text-amber-400';
  if (dotProduct > 0.866) { // cos(30)
    combatStatus = '🎯 正前方 60° 视锥锁定内 (主视野/受击瞄准)';
    combatColor = 'text-emerald-400';
  } else if (dotProduct > 0) {
    combatStatus = '👀 前半球外围视野';
    combatColor = 'text-cyan-400';
  } else if (dotProduct < -0.707) {
    combatStatus = '🗡️ 背后 90° 盲区 (触发刺客背刺 200% 暴击)';
    combatColor = 'text-rose-400';
  } else {
    combatStatus = '🛡️ 后半球侧翼';
    combatColor = 'text-purple-400';
  }

  // Handle Live Reaction
  const handleReaction = (type: 'hand' | 'confused' | 'understood') => {
    if (hasInteractedReaction === type) return;
    if (type === 'hand') setHandsRaised((prev) => prev + 1);
    if (type === 'confused') setConfusedCount((prev) => prev + 1);
    if (type === 'understood') setUnderstoodCount((prev) => prev + 1);
    setHasInteractedReaction(type);
  };

  // Submit new student live question
  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newMsg: LiveMessage = {
      id: `msg-${Date.now()}`,
      sender: '我 (同学)',
      avatar: '👨‍🎓',
      role: 'student',
      content: newQuestionText.trim(),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      upvotes: 1,
      isQuestion: true,
      resolved: false
    };
    onAddMessage(newMsg);
    setNewQuestionText('');
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            板块 2 · 课堂智能交互实时互动系统
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            双向同频：随堂抢答测验与游戏底层代码沙盒
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            实时汇总全班答题分布，提供 2D/3D 游戏数学向量与游戏主循环可视化交互器
          </p>
        </div>

        {/* Live Interaction Reactions Bar */}
        <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
          <button
            onClick={() => handleReaction('understood')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              hasInteractedReaction === 'understood'
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="听懂了，节奏很棒"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>听懂了 ({understoodCount})</span>
          </button>

          <button
            onClick={() => handleReaction('confused')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              hasInteractedReaction === 'confused'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="有点懵，希望再讲一遍"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>有点懵 ({confusedCount})</span>
          </button>

          <button
            onClick={() => handleReaction('hand')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              hasInteractedReaction === 'hand'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="举手向老师发问"
          >
            <Hand className="w-3.5 h-3.5 text-cyan-400" />
            <span>举手 ({handsRaised})</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Quiz & Sandbox, Right Question Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Quiz + Interactive Visualizer Sandbox */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Live Pop Quiz */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500 text-white animate-pulse">
                  课堂抢答中
                </span>
                <h2 className="text-base font-bold text-white">
                  随堂智能即时测验
                </h2>
              </div>

              {/* Countdown clock */}
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                <Timer className={`w-4 h-4 ${timeLeft < 10 ? 'text-rose-400 animate-spin' : 'text-cyan-400'}`} />
                <span className={timeLeft < 10 ? 'text-rose-400' : 'text-cyan-300'}>
                  {timeLeft > 0 ? `倒计时 ${timeLeft}s` : '作答结束'}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-200 font-semibold leading-relaxed">
              {quiz.title}
            </p>

            {/* Options List */}
            <div className="space-y-2">
              {quiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === quiz.correctIndex;
                const statPercent = quiz.stats[idx] || 0;

                let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';

                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-cyan-500 bg-cyan-950/50 text-cyan-200 font-bold shadow-md';
                }

                return (
                  <div key={idx} className="relative">
                    <button
                      disabled={quizSubmitted || timeLeft === 0}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center space-x-2.5 z-10">
                        <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-mono text-xs flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {quizSubmitted && (
                        <div className="flex items-center space-x-2 z-10 font-mono text-xs font-bold">
                          <span>{statPercent}% 全班选择</span>
                          {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        </div>
                      )}
                    </button>

                    {/* Class Stats Bar overlay */}
                    {quizSubmitted && (
                      <div
                        className={`absolute left-0 top-0 bottom-0 rounded-xl opacity-20 pointer-events-none transition-all duration-700 ${
                          isCorrect ? 'bg-emerald-500' : 'bg-slate-500'
                        }`}
                        style={{ width: `${statPercent}%` }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit button */}
            {!quizSubmitted ? (
              <div className="flex justify-end pt-1">
                <button
                  disabled={selectedOption === null || timeLeft === 0}
                  onClick={() => setQuizSubmitted(true)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 transition shadow-lg disabled:opacity-40"
                >
                  确认提交我的选项
                </button>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2 animate-fade-in">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> 正确答案：{String.fromCharCode(65 + quiz.correctIndex)}
                  </span>
                  <span className="text-slate-400 font-mono">
                    全班正确率: {quiz.stats[quiz.correctIndex]}%
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {quiz.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Interactive Game Dev Code Sandbox & Math Visualizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  课堂交互实验沙盒 (Live Code & Math Sandbox)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  通过实时参数操控，直观验证游戏核心几何数学与时间步长
                </p>
              </div>

              {/* Visualizer Toggle Tabs */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
                <button
                  onClick={() => setActiveVisualizer('vector')}
                  className={`px-3 py-1 rounded-md transition ${
                    activeVisualizer === 'vector'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  向量点积与视锥
                </button>
                <button
                  onClick={() => setActiveVisualizer('gameloop')}
                  className={`px-3 py-1 rounded-md transition ${
                    activeVisualizer === 'gameloop'
                      ? 'bg-indigo-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  游戏主循环时钟
                </button>
              </div>
            </div>

            {/* TAB 1: Vector Dot Product Visualizer */}
            {activeVisualizer === 'vector' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Interactive SVG Canvas */}
                  <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-4">
                    <svg viewBox="-120 -120 240 240" className="w-full h-full">
                      {/* Grid Circle */}
                      <circle cx="0" cy="0" r="90" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="-100" y1="0" x2="100" y2="0" stroke="#1e293b" strokeWidth="1" />
                      <line x1="0" y1="-100" x2="0" y2="100" stroke="#1e293b" strokeWidth="1" />

                      {/* Vision Cone Arc for Player (±30 deg = 60 deg cone) */}
                      <path
                        d={`M 0 0 L ${90 * Math.cos(radP - Math.PI / 6)} ${-90 * Math.sin(radP - Math.PI / 6)} A 90 90 0 0 0 ${90 * Math.cos(radP + Math.PI / 6)} ${-90 * Math.sin(radP + Math.PI / 6)} Z`}
                        fill="rgba(6, 182, 212, 0.12)"
                        stroke="rgba(6, 182, 212, 0.4)"
                        strokeWidth="1"
                      />

                      {/* Player Vector A (Cyan) */}
                      <line
                        x1="0"
                        y1="0"
                        x2={pVec.x * 90}
                        y2={pVec.y * 90}
                        stroke="#06b6d4"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <circle cx={pVec.x * 90} cy={pVec.y * 90} r="4" fill="#06b6d4" />

                      {/* Enemy Direction Vector B (Rose) */}
                      <line
                        x1="0"
                        y1="0"
                        x2={tVec.x * 90}
                        y2={tVec.y * 90}
                        stroke="#f43f5e"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <circle cx={tVec.x * 90} cy={tVec.y * 90} r="4" fill="#f43f5e" />

                      {/* Center Origin Node */}
                      <circle cx="0" cy="0" r="5" fill="#f8fafc" />
                    </svg>

                    <div className="absolute bottom-2 left-2 text-[10px] text-slate-400 font-mono">
                      <span className="text-cyan-400">■ 玩家前向 Vector A</span> | <span className="text-rose-400">■ 目标朝向 Vector B</span>
                    </div>
                  </div>

                  {/* Sliders and Math Output */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 font-medium mb-1">
                        <span>玩家朝向角 (Player Angle):</span>
                        <span className="font-mono text-cyan-400">{playerAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={playerAngle}
                        onChange={(e) => setPlayerAngle(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 font-medium mb-1">
                        <span>目标相对角 (Target Angle):</span>
                        <span className="font-mono text-rose-400">{targetAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={targetAngle}
                        onChange={(e) => setTargetAngle(Number(e.target.value))}
                        className="w-full accent-rose-400 cursor-pointer"
                      />
                    </div>

                    {/* Calculated Output Box */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">两向量夹角 θ:</span>
                        <span className="text-slate-200 font-bold">{diffDeg.toFixed(1)}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">点积 Dot Product (cos θ):</span>
                        <span className="text-cyan-300 font-bold">{dotProduct.toFixed(3)}</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800 text-[11px] font-sans">
                        <span className="text-slate-400">玩法逻辑判定: </span>
                        <span className={`font-bold ${combatColor}`}>{combatStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Game Loop Simulator */}
            {activeVisualizer === 'gameloop' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-300">渲染帧率 (Update / FPS):</span>
                      <span className="font-mono text-cyan-400 font-bold">{simFps} FPS ({Math.round(1000 / simFps)}ms)</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="144"
                      value={simFps}
                      onChange={(e) => setSimFps(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">模拟掉帧时（如从 60FPS 骤降至 15FPS），可观察物理积分行为</p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-300">物理周期 (FixedUpdate Hz):</span>
                      <span className="font-mono text-indigo-400 font-bold">{fixedHz} Hz ({(1000 / fixedHz).toFixed(1)}ms)</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={fixedHz}
                      onChange={(e) => setFixedHz(Number(e.target.value))}
                      className="w-full accent-indigo-400 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">工业标准通常固定在 50Hz (20ms) 或 60Hz，保证物理重现性</p>
                  </div>
                </div>

                {/* Timeline visual representation */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                    <span>一帧内的物理积分步数 (Physics Sub-steps):</span>
                    <span className="text-emerald-400 font-bold">
                      单帧执行 {Math.max(1, Math.round(fixedHz / simFps))} 次 FixedUpdate 循环
                    </span>
                  </div>

                  {/* Visual blocks */}
                  <div className="flex items-center gap-1.5 h-7 overflow-hidden py-1">
                    {Array.from({ length: Math.min(8, Math.max(1, Math.round(fixedHz / simFps))) }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-600/80 border border-indigo-400/50 rounded flex items-center justify-center text-[10px] font-mono text-white font-bold"
                      >
                        Tick #{i + 1}
                      </div>
                    ))}
                    <div className="w-16 bg-cyan-600/80 border border-cyan-400/50 rounded flex items-center justify-center text-[10px] font-mono text-white font-bold">
                      Render
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    💡 架构箴言：如果 FPS 极低而物理未设最大追赶步长 (Max Physics Steps)，就会陷入著名的「死亡螺旋 (Spiral of Death)」。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Classroom Question Wall & Live Danmaku */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col h-full shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              课堂互动提问墙
            </h3>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              {messages.length} 条发言
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl border text-xs space-y-1.5 transition ${
                  msg.role === 'ta'
                    ? 'bg-purple-950/30 border-purple-800/40'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span>{msg.avatar}</span>
                    <span className={`font-semibold ${msg.role === 'ta' ? 'text-purple-300' : 'text-slate-300'}`}>
                      {msg.sender}
                    </span>
                    {msg.role === 'ta' && (
                      <span className="text-[9px] px-1 rounded bg-purple-900 text-purple-200">AI助教</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                </div>

                <p className="text-slate-200 leading-relaxed font-sans">
                  {msg.content}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    {msg.resolved ? '✅ 教师已解答' : msg.isQuestion ? '❓ 待深入解答' : '💬 课堂互动'}
                  </span>
                  <button
                    onClick={() => onUpvoteMessage(msg.id)}
                    className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-cyan-400 transition"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{msg.upvotes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendQuestion} className="pt-3 border-t border-slate-800 mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="发送随堂疑问或探讨..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition text-xs flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
