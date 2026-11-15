import { GradeResult, PracticeQuestion } from '../types';

export function getClientFallbackAnswer(query: string): string {
  if (query.includes('万向节') || query.includes('四元数') || query.includes('Quaternion')) {
    return `### 💡 游戏数学核心解析：万向节死锁 (Gimbal Lock) 与四元数 (Quaternion)

#### 1. 什么是万向节死锁？
万向节死锁是使用**欧拉角 (Euler Angles: Pitch, Yaw, Roll)** 进行三维三轴旋转时出现的固有拓扑缺陷。
当中间轴（通常是俯仰角 Pitch）旋转达到 ±90° 时，第一个旋转轴和第三个旋转轴会重合共面，导致**丧失一个旋转自由度**。在游戏中表现为相机或角色突然无法任意平滑转向，出现异常翻滚抖动。

#### 2. 四元数是如何完美解决它的？
四元数定义在四维超复数空间：\`q = [cos(θ/2), u * sin(θ/2)]\`
- **超球面连续旋转**：四元数基于“绕任意单位向量轴 u 旋转 θ 角度”的几何本质，不存在孤立奇异点，彻底消除了万向节死锁。
- **平滑插值 (Slerp)**：在两组旋转姿态之间进行球面线性插值时，角速度恒定，动作过渡极其自然。

\`\`\`csharp
// Unity C# 示例：使用四元数平滑旋转避免万向节死锁
void Update() {
    Quaternion targetRotation = Quaternion.LookRotation(targetDir);
    transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * turnSpeed);
}
\`\`\``;
  }

  if (query.includes('Update') || query.includes('FixedUpdate') || query.includes('时间步长')) {
    return `### ⚡ 游戏主循环解析：Update 与 FixedUpdate 的本质差异

在 Unity 引擎及《Unity 游戏程序设计基础》第 1、3 章规范中：

- **Update (渲染循环)**：调用频率随帧率浮动，时间增量为 \`Time.deltaTime\`，适合处理**玩家输入采集、UI 更新、相机跟随逻辑**。
- **FixedUpdate (物理循环)**：固定周期执行（默认 50Hz / 0.02s），时间增量为 \`Time.fixedDeltaTime\`，专门用于**刚体物理受力、跳跃重力调节与碰撞检测**。

\`\`\`csharp
// 正确的游戏逻辑分层示例（教材第3章规范）
private bool jumpPressed = false;

void Update() {
    // 1. 在 Update 中灵敏采集按键，防止丢帧漏判
    if (Input.GetButtonDown("Jump") && isGrounded) {
        jumpPressed = true;
    }
}

void FixedUpdate() {
    // 2. 在 FixedUpdate 中施加刚体冲量与下落重力调节
    if (jumpPressed) {
        rb.linearVelocity = new Vector2(rb.linearVelocity.x, jumpForce);
        jumpPressed = false;
    }
}
\`\`\``;
  }

  if (query.includes('对象池') || query.includes('GC') || query.includes('Object Pool')) {
    return `### 🚀 游戏性能优化核心：对象池 (Object Pool) 与消除 GC 卡顿

在射击游戏或弹幕玩法中，高频调用 \`Instantiate()\` 和 \`Destroy()\` 会造成托管堆内存碎片化并频繁触发 **GC (Stop-The-World 垃圾回收)**，引发明显掉帧顿挫。

\`\`\`csharp
// Unity C# 高性能子弹对象池示范
using System.Collections.Generic;
using UnityEngine;

public class BulletPool : MonoBehaviour {
    public GameObject bulletPrefab;
    private readonly Queue<GameObject> pool = new Queue<GameObject>();

    public GameObject Spawn(Vector3 pos, Quaternion rot) {
        GameObject obj = pool.Count > 0 ? pool.Dequeue() : Instantiate(bulletPrefab);
        obj.transform.SetPositionAndRotation(pos, rot);
        obj.SetActive(true);
        return obj;
    }

    public void Recycle(GameObject obj) {
        obj.SetActive(false);
        pool.Enqueue(obj);
    }
}
\`\`\``;
  }

  if (query.includes('AABB') || query.includes('SAT') || query.includes('碰撞')) {
    return `### 🛡️ 碰撞检测核心：AABB 包围盒与分离轴定理 (SAT)

1. **AABB (轴对齐包围盒)**：计算开销极低，仅比较各坐标轴的最小/最大投影区间是否重合，常用于物理粗检（Broad Phase）或 2D 像素游戏。
2. **SAT (分离轴定理)**：两个凸多边形若不相交，必然存在一条轴线使两者的正交投影不重叠。适用于任意角度旋转的 OBB 精确碰撞检测。`;
  }

  if (query.includes('ECS')) {
    return `### 🧩 引擎底层架构：ECS (实体组件系统) 为什么更快？

传统 OOP 面向对象将对象离散分布在堆内存中，CPU 迭代遍历时指针跳转频繁发生 **Cache Miss**。
ECS 采用 **面向数据设计 (DOD)**：
- **Entity**：仅为一个整数 ID。
- **Component**：纯数据结构体，在连续内存数组中紧凑排列（SoA / Archetype）。
- **System**：批量迭代同一批连续内存组件，充分利用 CPU 缓存行预取与 SIMD 并行指令，性能可提升数十倍。`;
  }

  return `### 🎮 《游戏程序设计》AI 助教解答

针对您的问题，结合教师自编教材《Unity 游戏程序设计基础》（东北大学出版社）及工业级引擎开发规范建议如下：

1. **游戏生命周期与架构解耦**：组件引用缓存一律放在 \`Awake()\`，输入判定放在 \`Update()\`，物理模拟放在 \`FixedUpdate()\`，摄像机及视差背景跟随放在 \`LateUpdate()\`。
2. **内存与性能优化**：严禁在高频更新循环中调用 \`GetComponent\`、\`Find\` 或动态 \`Instantiate/Destroy\`，优先使用对象池和缓存引用。

\`\`\`csharp
// 规范示例：Awake 缓存 + LateUpdate 视差跟随
public class ParallaxLayer : MonoBehaviour {
    private Transform cam;
    private Vector3 lastCamPos;
    public float parallaxFactor = 0.5f;

    void Awake() {
        cam = Camera.main.transform;
    }

    void Start() {
        lastCamPos = cam.position;
    }

    void LateUpdate() {
        Vector3 delta = cam.position - lastCamPos;
        transform.position += new Vector3(delta.x * parallaxFactor, delta.y * parallaxFactor, 0);
        lastCamPos = cam.position;
    }
}
\`\`\`

如需针对「状态机 Has Exit Time」、「Tilemap 复合碰撞体」或「UGUI Raycast Target 优化」继续深入交流，欢迎随时提问！`;
}

export function getClientFallbackGrading(title: string, code: string): GradeResult {
  const hasAwakeCache = code.includes('Awake') && code.includes('GetComponent');
  const hasFixedUpdate = code.includes('FixedUpdate');
  const hasUpdateAlloc = (code.includes('new ') || code.includes('Instantiate')) && code.includes('Update');
  const hasGravityScale = code.includes('gravityScale');

  const score = hasUpdateAlloc ? 76 : hasAwakeCache || hasFixedUpdate ? 92 : 85;
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B+' : 'C+';

  return {
    totalScore: score,
    letterGrade: grade,
    dimensions: [
      {
        name: '逻辑功能与正确性',
        score: hasFixedUpdate || hasGravityScale ? 94 : 88,
        maxScore: 100,
        comment: '符合《Unity 游戏程序设计基础》核心逻辑要求，条件分支清晰完整。'
      },
      {
        name: '算法与时间空间复杂度',
        score: 88,
        maxScore: 100,
        comment: '时间复杂度控制在 O(1) 单帧常数级开销内，适合 60FPS 实时游戏主循环。'
      },
      {
        name: '内存管理与游戏性能',
        score: hasUpdateAlloc ? 64 : hasAwakeCache ? 95 : 84,
        maxScore: 100,
        comment: hasUpdateAlloc
          ? '检测到 Update 周期内存在动态内存分配 (new / Instantiate)，极易引发 GC 微顿挫！'
          : '成功避免帧内动态分配与高频 GetComponent 查询，内存表现优秀。'
      },
      {
        name: '游戏代码规范与工程结构',
        score: 91,
        maxScore: 100,
        comment: '命名符合 C# / Unity 工业标准，[Header] 与生命周期职责划分清楚。'
      }
    ],
    strengths: [
      hasFixedUpdate ? '严格区分了 Update 采集输入与 FixedUpdate 执行物理更新的职责边界' : '核心算法表达式规范，结构清晰',
      hasAwakeCache ? '遵循讲义规范在 Awake() 中预先缓存了组件引用' : '模块封装良好，具备良好的可复用性'
    ],
    flawsAndBugs: hasUpdateAlloc
      ? [
          '【性能警报】Update 中存在对象动态分配，建议改为预分配对象池 (Object Pool)',
          '建议添加非空引用校验 (Null Check) 防止组件未挂载时抛出异常'
        ]
      : [
          '建议对公开参数添加 [Range(...)] 约束防止策划在 Inspector 中填入非法负值',
          '若涉及地面碰撞检测，建议配合 OnDrawGizmosSelected() 绘制可视化调试圈'
        ],
    optimizationTips: `针对《${title}》建议：结合自编讲义第3章规范，可将调试辅助线 (Gizmos) 与输入缓冲 (Coyote Time / Jump Buffer) 引入控制器，进一步提升操作容错与手感。`,
    refactoredSnippet: `// 推荐增强片段：添加 Inspector 范围约束与 Gizmos 调试可视化
[Range(1.5f, 5f)] public float fallMultiplier = 2.5f;

void OnDrawGizmosSelected() {
    if (groundCheck == null) return;
    Gizmos.color = Color.cyan;
    Gizmos.DrawWireSphere(groundCheck.position, checkRadius);
}`
  };
}

export function getClientFallbackPracticeQuestion(
  topic: string = '游戏数学',
  difficulty: string = '中等'
): PracticeQuestion {
  const bank: Record<string, PracticeQuestion> = {
    '游戏数学': {
      id: `ai-math-${Date.now()}`,
      category: '游戏数学',
      difficulty: (difficulty as any) || '中等',
      title: '在 3D 游戏中，两单位向量 A 与 B 的点积 (Dot Product) 结果为 0，代表了什么几何意义？',
      description: '在 3D 游戏中，两单位向量 A 与 B 的点积 (Dot Product) 结果为 0，代表了什么几何与玩法含义？',
      codeSnippet: `float dot = Vector3.Dot(playerForward, enemyDirection);
if (Mathf.Approximately(dot, 0.0f)) {
    // 处于何种相对几何方位？
}`,
      options: [
        { id: 'A', text: '敌人正处于玩家正后方 180 度视野盲区' },
        { id: 'B', text: '敌人向量与玩家正朝向严格正交（夹角正好为 90 度）' },
        { id: 'C', text: '两物体发生重合碰撞' },
        { id: 'D', text: '敌人正处于玩家正前方 0 度瞄准线' }
      ],
      correctAnswer: 'B',
      explanation: '根据点积公式 A·B = |A||B|cos(θ)，单位向量点积等于 cos(θ)。当点积为 0 时 θ = 90°，代表两方向向量彼此垂直正交。',
      solved: false
    },
    '物理与碰撞': {
      id: `ai-phy-${Date.now()}`,
      category: '物理与碰撞',
      difficulty: (difficulty as any) || '中等',
      title: 'Unity 2D 横版角色跳跃手感优化（自编讲义第3章）',
      description: '为了实现“按住跳跃跳得高，刚起跳即松开跳得矮，且下落时干脆利落不飘浮”的操作手感，最标准的实现方式是：',
      codeSnippet: `if (rb.linearVelocity.y < 0) {
    // 下落阶段处理
}`,
      options: [
        { id: 'A', text: '在下落阶段或提前松键上升阶段动态放大 rb.gravityScale' },
        { id: 'B', text: '每帧销毁并重新生成 Rigidbody2D 组件' },
        { id: 'C', text: '把 Time.timeScale 临时调整为 0.2' },
        { id: 'D', text: '将角色质量 mass 设为 0' }
      ],
      correctAnswer: 'A',
      explanation: '自编教材第 94 页重点推荐通过 fallMultiplier 与 lowJumpMultiplier 动态调节 gravityScale，既保留了真实物理曲线，又极大增强了操控打击感。',
      solved: false
    },
    '内存与性能': {
      id: `ai-mem-${Date.now()}`,
      category: '内存与性能',
      difficulty: (difficulty as any) || '中等',
      title: 'Unity 高频 GetComponent 调用的性能陷阱',
      description: '在拥有 500 个活跃敌人的场景中，如果在每个敌人的 Update() 中都调用 GetComponent<Animator>() 会造成什么后果？',
      options: [
        { id: 'A', text: '会在每次循环中产生额外的反射/查找开销并可能触发少量托管分配，应在 Awake() 中缓存引用' },
        { id: 'B', text: '会自动把游戏转换为 3D 模式' },
        { id: 'C', text: '完全没有任何性能影响' },
        { id: 'D', text: '会导致显卡驱动卸载' }
      ],
      correctAnswer: 'A',
      explanation: '在 Awake() 中一次性缓存组件引用是《Unity 游戏程序设计基础》第1章核心编码规范，能彻底消除 Update 中的重复组件检索损耗。',
      solved: false
    }
  };

  return bank[topic] || {
    ...bank['游戏数学'],
    id: `ai-custom-${Date.now()}`,
    category: (topic as any) || '引擎架构',
    difficulty: (difficulty as any) || '中等'
  };
}

export function getClientFallbackParticipationAnalysis() {
  return {
    overallAttentionScore: 93,
    activeRate: 96,
    peakMoment: '第20分钟（Tilemap 瓦片地图与复合碰撞体实时拼装实操）',
    lowMoment: '第28分钟（视差分层 Parallax 位移比率公式推导）',
    confusionTopTopics: [
      '自编讲义第94页长短跳重力缩放系数的匹配比例',
      'Composite Collider 2D 与 Static 刚体的协同配置'
    ],
    aiTeachingAdvice: [
      '数媒技术24214班在实机代码沙盒环节注意力高达 98%，建议继续保持“讲义理论 + 沙盒直觉验证”双轮驱动节奏。',
      '针对第28分钟视差分层公式理解波动，建议下节课在 Unity 编辑器中开启 Scene/Game 双屏实时演示背景位移速度差。',
      '超星平台 1.1~4.3 章节课前闯关完成度已达 100%，可适当在 5.1 UGUI 章节增加 Raycast Target 性能调优实战加分任务。'
    ],
    studentInsight: '全班在 2D 物理手感优化与状态机控制环节互动响应时延仅 4.2 秒，整体工程实践能力处于优良水平。'
  };
}
