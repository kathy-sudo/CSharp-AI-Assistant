export type ActiveModule =
  | 'preview'        // 1 课前线上课程预习 (超星智慧平台闯关数据 + 教师自编讲义)
  | 'inclass'        // 2 课堂智能交互
  | 'practice'       // 3 课后巩固练习
  | 'report'         // 4 学习报告分析
  | 'resources'      // 5 个性化学习资源推荐
  | 'grading'        // 6 智能批改作业
  | 'mistakes'       // 7 错题智能梳理
  | 'assistant'      // 8 AI助教答疑系统
  | 'engagement';    // 9 智能分析课堂参与度

export type UserRole = 'student' | 'teacher';

// Module 1: Pre-class Preview & Chaoxing Smart Platform Integration
export interface SubsectionMission {
  id: string;
  code: string; // e.g., '2.2'
  title: string;
  missionPoints: number; // e.g., 4个任务点
  progressPercent: number; // e.g., 100%
  isOpen: boolean;
  videoWatched: boolean;
  preclassQuizPassed: boolean;
  textbookReadingMinutes: number;
}

export interface TextbookChapterReference {
  bookTitle: string;
  press: string;
  publishDate: string;
  coverImage: string;
  chapterIndex: string;
  chapterTitle: string;
  pageRange: string;
  excerptText: string;
  keyTerminology: string[];
  lectureHighlights: string[];
}

export interface KnowledgeNode {
  id: string;
  title: string;
  difficulty: '入门' | '进阶' | '核心难点';
  estimatedMinutes: number;
  summary: string;
  keyFormulasOrRules: string[];
  completed: boolean;
  codeSnippet?: string;
  textbookNote?: string;
}

export interface PreclassQuiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  userAnswer?: number;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  chaoxingCourseName: string; // 游戏程序设计2025-2026-2
  targetClass: string; // 数媒技术24214
  overallProgress: number; // 100%
  subsections: SubsectionMission[];
  textbookRef: TextbookChapterReference;
  nodes: KnowledgeNode[];
  previewQuizzes: PreclassQuiz[];
}

// Module 2: In-class Interaction
export interface LiveQuizQuestion {
  id: string;
  title: string;
  options: string[];
  correctIndex: number;
  timeLimitSeconds: number;
  explanation: string;
  stats: { [key: number]: number };
}

export interface LiveMessage {
  id: string;
  sender: string;
  avatar: string;
  role: 'student' | 'ta' | 'teacher';
  content: string;
  timestamp: string;
  upvotes: number;
  isQuestion: boolean;
  resolved?: boolean;
}

// Module 3: Post-class Practice
export interface PracticeQuestion {
  id: string;
  category: '游戏数学' | '引擎架构' | '物理与碰撞' | '图形与着色器' | '游戏AI' | '内存与性能' | '动画与瓦片地图' | '角色状态与UI';
  difficulty: '基础' | '中等' | '挑战' | 'GDC级';
  title: string;
  description: string;
  codeSnippet?: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  solved?: boolean;
  userAnswer?: string;
}

// Module 4: Learning Report
export interface CompetencyDimension {
  name: string;
  score: number;
  maxScore: number;
  level: string;
  description: string;
}

// Module 5: Personalized Resources
export interface LearningResource {
  id: string;
  title: string;
  type: '书籍精读' | '开源项目' | 'GDC演讲视频' | '官方文档' | '交互试验站';
  tag: string;
  recommendReason: string;
  matchScore: number;
  authorOrSource: string;
  url: string;
  difficulty: '初学者' | '中级开发者' | '资深引擎岗';
}

// Module 6: Assignment Grading
export interface AssignmentPreset {
  id: string;
  title: string;
  description: string;
  language: 'cpp' | 'csharp';
  defaultCode: string;
}

export interface GradeResult {
  totalScore: number;
  letterGrade: string;
  dimensions: {
    name: string;
    score: number;
    maxScore: number;
    comment: string;
  }[];
  strengths: string[];
  flawsAndBugs: string[];
  optimizationTips: string;
  refactoredSnippet: string;
}

// Module 7: Mistake Notebook
export interface MistakeItem {
  id: string;
  topic: string;
  category: string;
  title: string;
  errorDate: string;
  errorFrequency: number;
  studentAnswer: string;
  correctAnswer: string;
  aiDiagnosis: string;
  rootCause: string;
  mastered: boolean;
  variantGenerated?: boolean;
}

// Module 8: AI Assistant
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippet?: string;
}

// Module 9: Engagement Analytics
export interface EngagementData {
  overallScore: number;
  attendanceRate: number;
  interactionCount: number;
  averageResponseTime: number;
  timelineData: {
    minute: number;
    activity: string;
    attentionScore: number;
    confusionIndex: number;
  }[];
  hotQuestions: {
    topic: string;
    count: number;
    confusionRate: number;
  }[];
  aiAdvice: string[];
}
