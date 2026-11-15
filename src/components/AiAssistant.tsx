import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getClientFallbackAnswer } from '../utils/aiFallback';
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  Check,
  User,
  Trash2,
  Code2,
  Terminal,
  HelpCircle
} from 'lucide-react';

interface AiAssistantProps {
  currentContext?: string;
}

const PRESET_QUESTIONS = [
  '请解释万向节死锁(Gimbal Lock)以及四元数(Quaternion)如何解决它？',
  '在Unity中Update和FixedUpdate有什么本质区别？为什么物理计算不能写在Update？',
  '请手写一个高性能泛型对象池(Object Pool)并解释它如何彻底消除GC微顿挫？',
  '2D AABB碰撞检测与分离轴定理(SAT)的适用场景与性能差异是什么？',
  '为什么ECS(实体组件系统)比传统OOP面向对象继承树快数十倍？底层Cache Line如何工作的？'
];

export const AiAssistant: React.FC<AiAssistantProps> = ({ currentContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `你好！我是你的《游戏程序设计》AI 专属助教。
无论是**游戏循环与时间步长**、**游戏数学 (向量/矩阵/四元数)**、**物理引擎碰撞 (AABB/SAT/冲量恢复)**、**图形着色器 (HLSL/GLSL)** 还是 **现代 C++/C# 内存管理与对象池**，我都可以为你提供工业级实战解答与代码示范。

请点击下方的高频问题，或直接在输入框中向我提问！`,
      timestamp: '刚刚'
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assistantTone, setAssistantTone] = useState<'architect' | 'professor' | 'ta'>('architect');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputVal).trim();
    if (!prompt || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsLoading(true);

    try {
      const tonePrefix =
        assistantTone === 'architect'
          ? '【身份设定：3A游戏引擎主程兼架构师，注重工业标准、内存开销与执行性能】'
          : assistantTone === 'professor'
          ? '【身份设定：高校游戏程序设计教授，注重学术规范、数学证明与由浅入深】'
          : '【身份设定：贴心带教学长助教，注重实操Debug、避坑与手把手示例】';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: `${tonePrefix} ${currentContext || ''}`
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.reply || getClientFallbackAnswer(prompt),
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackReply = getClientFallbackAnswer(prompt);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'init-reset',
        role: 'assistant',
        content: '对话记录已清空。请随时提出新的《游戏程序设计》疑难！',
        timestamp: '刚刚'
      }
    ]);
  };

  // Simple Markdown renderer for headings, code, and bold
  const renderMessageContent = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, pIdx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].trim();
        const code = lines.slice(1).join('\n');

        return (
          <div key={pIdx} className="my-2.5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Terminal className="w-3.5 h-3.5" /> {lang || 'code'}
              </span>
              <button
                onClick={() => handleCopy(`${msgId}-${pIdx}`, code)}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedId === `${msgId}-${pIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === `${msgId}-${pIdx}` ? '已复制代码' : '复制'}</span>
              </button>
            </div>
            <pre className="p-3 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed">
              {code}
            </pre>
          </div>
        );
      }

      // Regular text formatting
      return (
        <div key={pIdx} className="whitespace-pre-line leading-relaxed text-xs sm:text-sm font-sans space-y-1">
          {part}
        </div>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-1">
            <Bot className="w-3.5 h-3.5" />
            板块 8 · 游戏程序设计 AI 专属助教答疑系统
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            双核专家：图形引擎、底层数学与架构答疑
          </h1>
        </div>

        {/* Persona tone selector & Clear button */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setAssistantTone('architect')}
              className={`px-2.5 py-1 rounded-lg transition ${
                assistantTone === 'architect' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              引擎主程视角
            </button>
            <button
              onClick={() => setAssistantTone('professor')}
              className={`px-2.5 py-1 rounded-lg transition ${
                assistantTone === 'professor' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              学术主讲视角
            </button>
            <button
              onClick={() => setAssistantTone('ta')}
              className={`px-2.5 py-1 rounded-lg transition ${
                assistantTone === 'ta' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              实战带教视角
            </button>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="清空对话记录"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Fast Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 高频考点直问:
        </span>
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition whitespace-nowrap shrink-0"
          >
            {q.length > 20 ? q.slice(0, 20) + '...' : q}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[560px] shadow-xl overflow-hidden">
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold shadow ${
                    isUser
                      ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm shadow-md space-y-1.5 ${
                    isUser
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800/80 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 font-mono mb-1">
                    <span className="font-bold">{isUser ? '我' : '游戏程序设计 AI 导师'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div>{renderMessageContent(msg.content, msg.id)}</div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-purple-600/40 border border-purple-500/50 flex items-center justify-center text-purple-300">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-150" />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-300" />
                <span className="ml-2">正在检索游戏引擎知识库并组织严密解答...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="向 AI 助教提问游戏循环、四元数、AABB碰撞、着色器或内存管理..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-lg disabled:opacity-40 text-xs sm:text-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">发送</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
