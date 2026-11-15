import React, { useState } from 'react';
import { LearningResource } from '../types';
import {
  Sparkles,
  BookOpen,
  Video,
  Code2,
  ExternalLink,
  Filter,
  CheckCircle,
  Compass,
  Star
} from 'lucide-react';

interface ResourceRecommendationProps {
  resources: LearningResource[];
}

export const ResourceRecommendation: React.FC<ResourceRecommendationProps> = ({
  resources
}) => {
  const [selectedType, setSelectedType] = useState<string>('全部');
  const [learningPathGenerated, setLearningPathGenerated] = useState<boolean>(false);

  const types = ['全部', '书籍精读', '开源项目', 'GDC演讲视频', '交互试验站'];

  const filtered = resources.filter(
    (r) => selectedType === '全部' || r.type === selectedType
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            板块 5 · 个性化游戏开发研习资源智能推荐
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            依据短板诊断定制的工业级高阶资源库
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            聚合 GDC 工业实录、暴雪/索尼架构著作、GitHub 引擎源码与 LearnOpenGL 交互式站点
          </p>
        </div>

        {/* Generate Learning Path CTA */}
        <button
          onClick={() => setLearningPathGenerated(!learningPathGenerated)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-lg transition shrink-0"
        >
          <Compass className="w-4 h-4" />
          {learningPathGenerated ? '收起专属学习路线' : '✨ AI 智能定制本月攻坚路线图'}
        </button>
      </div>

      {/* AI Generated Personalized Learning Path Banner */}
      {learningPathGenerated && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                AI 专为同学规划的 4 周突围成长路径 (针对图形与着色器短板)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded">
              预计提分 +16 分
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-cyan-400 font-mono font-bold">STAGE 01 · 阶段一</span>
              <h4 className="font-bold text-white">透视变换与MVP矩阵</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                重温齐次坐标 w 分量与视锥体剪裁推导，完成《LearnOpenGL 变换》练习。
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-indigo-400 font-mono font-bold">STAGE 02 · 阶段二</span>
              <h4 className="font-bold text-white">手写顶点/片元Shader</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                在 Unity/Godot 中实现 Blinn-Phong 光照模型与法线贴图采样。
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-purple-400 font-mono font-bold">STAGE 03 · 阶段三</span>
              <h4 className="font-bold text-white">对象池与GC消除实战</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                精读《Game Programming Patterns》，重构高频子弹管理器消除每帧分配。
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-emerald-400 font-mono font-bold">STAGE 04 · 阶段四</span>
              <h4 className="font-bold text-white">微型物理弹球Demo交付</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                将 SAT 碰撞检测与冲量解析结合，输出可独立运行的游戏工程成品。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
              selectedType === t
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((res) => {
          return (
            <div
              key={res.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between shadow-lg space-y-3 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        res.type === '书籍精读'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : res.type === 'GDC演讲视频'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                      }`}
                    >
                      {res.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {res.tag}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-mono font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{res.matchScore}% 契合</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {res.recommendReason}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">{res.authorOrSource}</span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  前往学习研读 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
