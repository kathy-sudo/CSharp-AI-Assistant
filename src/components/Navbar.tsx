import React from 'react';
import {
  ActiveModule,
  UserRole,
  Chapter
} from '../types';
import {
  BookOpen,
  Radio,
  CheckSquare,
  BarChart3,
  Sparkles,
  FileCode,
  AlertTriangle,
  Bot,
  Activity,
  GraduationCap,
  Menu,
  X,
  Flame,
  Award
} from 'lucide-react';

interface NavbarProps {
  activeModule: ActiveModule;
  setActiveModule: (m: ActiveModule) => void;
  chapters: Chapter[];
  currentChapterId: number;
  setCurrentChapterId: (id: number) => void;
  role: UserRole;
  setRole: (r: UserRole) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const MODULE_ITEMS: { id: ActiveModule; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'preview', label: '1 课前线上预习', icon: BookOpen },
  { id: 'inclass', label: '2 课堂智能交互', icon: Radio, badge: 'LIVE' },
  { id: 'practice', label: '3 课后巩固练习', icon: CheckSquare },
  { id: 'report', label: '4 学习报告分析', icon: BarChart3 },
  { id: 'resources', label: '5 个性化资源推荐', icon: Sparkles },
  { id: 'grading', label: '6 智能批改作业', icon: FileCode, badge: 'AI' },
  { id: 'mistakes', label: '7 错题智能梳理', icon: AlertTriangle },
  { id: 'assistant', label: '8 AI助教答疑', icon: Bot, badge: 'Pro' },
  { id: 'engagement', label: '9 课堂参与度分析', icon: Activity, badge: '热度' }
];

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  setActiveModule,
  chapters,
  currentChapterId,
  setCurrentChapterId,
  role,
  setRole,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      {/* Top Banner & Control */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Course Info */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveModule('preview')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
                🎮
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                    GameCraft AI
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/80">
                      v2.6
                    </span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  《游戏程序设计》全流程智能学习平台
                </p>
              </div>
            </div>
          </div>

          {/* Center Chapter Select */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400 font-medium">当前教学单元:</span>
            <select
              value={currentChapterId}
              onChange={(e) => setCurrentChapterId(Number(e.target.value))}
              className="bg-transparent text-xs text-cyan-300 font-semibold focus:outline-none cursor-pointer pr-2"
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id} className="bg-slate-900 text-slate-200">
                  {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Right Stats & Role Switch */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Gamified Streak & Points */}
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="flex items-center text-amber-400 font-bold gap-1" title="连续学习打卡 12 天">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                12天
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center text-emerald-400 font-bold gap-1" title="游戏编程实践积分">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                1,840 XP
              </span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-medium">
              <button
                onClick={() => setRole('student')}
                className={`px-2.5 py-1 rounded-md transition ${
                  role === 'student'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                学生端
              </button>
              <button
                onClick={() => setRole('teacher')}
                className={`px-2.5 py-1 rounded-md transition ${
                  role === 'teacher'
                    ? 'bg-indigo-500 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                教师督导
              </button>
            </div>
          </div>
        </div>

        {/* Desktop 9-Module Horizontal Navigation Bar */}
        <nav className="hidden md:flex items-center space-x-1 py-1.5 overflow-x-auto scrollbar-none border-t border-slate-800/80">
          {MODULE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.badge === 'LIVE'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : item.badge === 'AI'
                        ? 'bg-purple-500 text-white'
                        : 'bg-indigo-500/30 text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <div className="py-2 border-b border-slate-800 mb-2">
            <label className="text-xs text-slate-400 block mb-1">选择当前章节：</label>
            <select
              value={currentChapterId}
              onChange={(e) => {
                setCurrentChapterId(Number(e.target.value));
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-cyan-300"
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {MODULE_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
