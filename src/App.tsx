/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ActiveModule,
  UserRole,
  Chapter,
  LiveQuizQuestion,
  LiveMessage,
  PracticeQuestion,
  CompetencyDimension,
  LearningResource,
  AssignmentPreset,
  MistakeItem,
  EngagementData
} from './types';
import {
  INITIAL_CHAPTERS,
  INITIAL_LIVE_QUIZ,
  INITIAL_LIVE_MESSAGES,
  INITIAL_PRACTICE_QUESTIONS,
  INITIAL_COMPETENCIES,
  INITIAL_RESOURCES,
  INITIAL_ASSIGNMENT_PRESETS,
  INITIAL_MISTAKES,
  INITIAL_ENGAGEMENT_DATA
} from './data/courseData';
import { Navbar, MODULE_ITEMS } from './components/Navbar';
import { PreclassPreview } from './components/PreclassPreview';
import { InclassInteraction } from './components/InclassInteraction';
import { PostclassPractice } from './components/PostclassPractice';
import { LearningReport } from './components/LearningReport';
import { ResourceRecommendation } from './components/ResourceRecommendation';
import { AssignmentGrading } from './components/AssignmentGrading';
import { ErrorNotebook } from './components/ErrorNotebook';
import { AiAssistant } from './components/AiAssistant';
import { ClassroomEngagement } from './components/ClassroomEngagement';
import { Bot, Sparkles, Terminal, Cpu } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('preview');
  const [role, setRole] = useState<UserRole>('student');
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  const [currentChapterId, setCurrentChapterId] = useState<number>(1);
  const [liveQuiz, setLiveQuiz] = useState<LiveQuizQuestion>(INITIAL_LIVE_QUIZ);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>(INITIAL_LIVE_MESSAGES);
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>(INITIAL_PRACTICE_QUESTIONS);
  const [competencies, setCompetencies] = useState<CompetencyDimension[]>(INITIAL_COMPETENCIES);
  const [resources, setResources] = useState<LearningResource[]>(INITIAL_RESOURCES);
  const [assignmentPresets, setAssignmentPresets] = useState<AssignmentPreset[]>(INITIAL_ASSIGNMENT_PRESETS);
  const [mistakes, setMistakes] = useState<MistakeItem[]>(INITIAL_MISTAKES);
  const [engagementData, setEngagementData] = useState<EngagementData>(INITIAL_ENGAGEMENT_DATA);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Active Chapter Object
  const currentChapter = chapters.find((c) => c.id === currentChapterId) || chapters[0];

  // Handler: Toggle Pre-class node completed
  const handleUpdateChapterNode = (chapterId: number, nodeId: string, completed: boolean) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            nodes: ch.nodes.map((n) => (n.id === nodeId ? { ...n, completed } : n))
          };
        }
        return ch;
      })
    );
  };

  // Handler: Add live message
  const handleAddLiveMessage = (msg: LiveMessage) => {
    setLiveMessages((prev) => [msg, ...prev]);
  };

  // Handler: Upvote live message
  const handleUpvoteMessage = (id: string) => {
    setLiveMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, upvotes: m.upvotes + 1 } : m))
    );
  };

  // Handler: Answer practice question
  const handleAnswerPracticeQuestion = (questionId: string, answer: string) => {
    setPracticeQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const isCorrect = answer === q.correctAnswer;
          // If incorrect, add to mistake notebook if not exists
          if (!isCorrect) {
            const alreadyInMistakes = mistakes.some((m) => m.title === q.title);
            if (!alreadyInMistakes) {
              const newMistake: MistakeItem = {
                id: `mistake-${Date.now()}`,
                topic: q.category,
                category: '答题失误',
                title: q.title,
                errorDate: new Date().toISOString().split('T')[0],
                errorFrequency: 1,
                studentAnswer: `选择了选项 ${answer}`,
                correctAnswer: `正确选项为 ${q.correctAnswer} (${q.options.find(o => o.id === q.correctAnswer)?.text})`,
                aiDiagnosis: q.explanation,
                rootCause: '概念细节记忆混淆',
                mastered: false
              };
              setMistakes((old) => [newMistake, ...old]);
            }
          }
          return {
            ...q,
            solved: true,
            userAnswer: answer
          };
        }
        return q;
      })
    );
  };

  // Handler: Add AI generated question
  const handleAddPracticeQuestion = (newQ: PracticeQuestion) => {
    setPracticeQuestions((prev) => [newQ, ...prev]);
  };

  // Handler: Toggle mistake mastered
  const handleToggleMistakeMastered = (id: string) => {
    setMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, mastered: !m.mastered } : m))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Sticky Navigation */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        chapters={chapters}
        currentChapterId={currentChapterId}
        setCurrentChapterId={setCurrentChapterId}
        role={role}
        setRole={setRole}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {/* Module 1: 课前线上课程预习 */}
        {activeModule === 'preview' && (
          <PreclassPreview
            chapter={currentChapter}
            onUpdateChapterNode={handleUpdateChapterNode}
          />
        )}

        {/* Module 2: 课堂智能交互 */}
        {activeModule === 'inclass' && (
          <InclassInteraction
            quiz={liveQuiz}
            messages={liveMessages}
            onAddMessage={handleAddLiveMessage}
            onUpvoteMessage={handleUpvoteMessage}
          />
        )}

        {/* Module 3: 课后巩固练习 */}
        {activeModule === 'practice' && (
          <PostclassPractice
            questions={practiceQuestions}
            onAnswerQuestion={handleAnswerPracticeQuestion}
            onAddQuestion={handleAddPracticeQuestion}
          />
        )}

        {/* Module 4: 学习报告分析 */}
        {activeModule === 'report' && (
          <LearningReport
            competencies={competencies}
            onNavigateToResources={() => setActiveModule('resources')}
          />
        )}

        {/* Module 5: 个性化学习资源推荐 */}
        {activeModule === 'resources' && (
          <ResourceRecommendation resources={resources} />
        )}

        {/* Module 6: 智能批改作业 */}
        {activeModule === 'grading' && (
          <AssignmentGrading presets={assignmentPresets} />
        )}

        {/* Module 7: 错题智能梳理 */}
        {activeModule === 'mistakes' && (
          <ErrorNotebook
            mistakes={mistakes}
            onToggleMastered={handleToggleMistakeMastered}
          />
        )}

        {/* Module 8: AI 助教答疑系统 */}
        {activeModule === 'assistant' && (
          <AiAssistant
            currentContext={`当前学习单元: ${currentChapter.title} - ${currentChapter.subtitle}`}
          />
        )}

        {/* Module 9: 智能分析课堂参与度 */}
        {activeModule === 'engagement' && (
          <ClassroomEngagement
            data={engagementData}
            role={role}
          />
        )}
      </main>

      {/* Floating Fast AI Assistant Bubble (visible when not on assistant module) */}
      {activeModule !== 'assistant' && (
        <button
          onClick={() => setActiveModule('assistant')}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold shadow-2xl transition hover:scale-105 group border border-cyan-300/30"
          title="召唤游戏程序设计 AI 助教"
        >
          <Bot className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span className="text-xs">AI 助教答疑</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">《游戏程序设计》高校精品课 AI 教学工作台</span>
            <span>·</span>
            <span>Game Programming AI Workstation</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
            <span>C++20</span>
            <span>C# Unity</span>
            <span>Unreal Engine 5</span>
            <span>GLSL/HLSL</span>
            <span>PhysX / SAT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
