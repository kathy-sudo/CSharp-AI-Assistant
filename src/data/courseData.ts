import {
  Chapter,
  LiveQuizQuestion,
  LiveMessage,
  PracticeQuestion,
  CompetencyDimension,
  LearningResource,
  AssignmentPreset,
  MistakeItem,
  EngagementData
} from '../types';

export const TEXTBOOK_METADATA = {
  title: 'Unity 游戏程序设计基础',
  publishDate: '2025年2月27日',
  press: '东北大学出版社',
  coverImage: '/assets/aistudio/screenshot_2026-10-22_14-17-58_b7474d60.png',
  chaoxingPortalImage: '/assets/aistudio/screenshot_2026-10-22_14-15-48_74d6252b.png',
  courseName: '游戏程序设计2025-2026-2',
  targetClass: '数媒技术24214'
};

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: '1 游戏开发基础知识',
    subtitle: 'Unity Installation, Hub, Interface & Core Concepts',
    chaoxingCourseName: '游戏程序设计2025-2026-2',
    targetClass: '数媒技术24214',
    overallProgress: 100,
    subsections: [
      {
        id: '1.1',
        code: '1.1',
        title: '课程介绍、Unity介绍以及安装',
        missionPoints: 4,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 25
      },
      {
        id: '1.2',
        code: '1.2',
        title: 'Unity引擎基础概念',
        missionPoints: 3,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 30
      }
    ],
    textbookRef: {
      bookTitle: '《Unity 游戏程序设计基础》',
      press: '东北大学出版社 (2025.02.27)',
      publishDate: '2025年2月27日',
      coverImage: '/assets/aistudio/screenshot_2026-10-22_14-17-58_b7474d60.png',
      chapterIndex: '第1章',
      chapterTitle: 'Unity 引擎环境搭建与核心实体架构',
      pageRange: '第 1 ~ 32 页',
      excerptText: `本章重点确立以 Unity 引擎为载体的现代游戏开发思维。游戏本质是一个软实时驱动的循环系统。
学生需深入掌握：
1. GameObject（游戏对象）与 Component（组件）的“组合优于继承”思想；
2. Transform 空间坐标系的层级关联（Local Position vs World Position）；
3. 脚本生命周期核心序列：Awake -> OnEnable -> Start -> FixedUpdate -> Update -> LateUpdate -> OnDisable -> OnDestroy。`,
      keyTerminology: ['GameObject & Component', 'Transform Hierarchy', 'Script Lifecycle', 'Unity Hub & Package Manager'],
      lectureHighlights: [
        'Awake() 在脚本实例化时仅执行一次，用于对象自身依赖的就地初始化',
        'Start() 在所有对象的 Awake 执行完毕后的第一帧 Update 前执行，适合跨对象引用查找',
        '严禁在每帧 Update 中使用 GetComponent() 造成性能损耗'
      ]
    },
    nodes: [
      {
        id: 'node-1-1',
        title: 'Unity 脚本生命周期函数执行时序',
        difficulty: '入门',
        estimatedMinutes: 20,
        summary: '游戏引擎每帧的确定性调度序列。从 Awake、Start 到 FixedUpdate、Update 和 LateUpdate，理解它们的调用时序是消除空引用与逻辑混乱的基石。',
        keyFormulasOrRules: [
          'Awake: 自身组件就绪 (即使脚本未启用也会先执行)',
          'Update: 渲染帧驱动，处理输入与非物理运动',
          'LateUpdate: 相机跟随与骨骼后处理'
        ],
        completed: true,
        codeSnippet: `using UnityEngine;

public class PlayerController : MonoBehaviour {
    private Rigidbody2D rb;

    void Awake() {
        // 自编讲义第 18 页规范：在 Awake 中缓存组件引用
        rb = GetComponent<Rigidbody2D>();
    }

    void Start() {
        Debug.Log("玩家实体初始化完成，准备进入主循环");
    }
}`
      },
      {
        id: 'node-1-2',
        title: '父子坐标系与 Transform 空间变换',
        difficulty: '进阶',
        estimatedMinutes: 25,
        summary: 'Transform 组件记录了 Position、Rotation 与 Scale。子对象的 localPosition 永远相对于父对象的坐标原点，改变父对象的变换将级联影响所有子对象。',
        keyFormulasOrRules: [
          'worldPos = parent.transform.TransformPoint(localPos)',
          '旋转级联：子物体世界旋转 = 父物体世界旋转 * 子物体局部旋转'
        ],
        completed: true
      }
    ],
    previewQuizzes: [
      {
        id: 'pq-101',
        question: '根据自编讲义第1章规定，若要在脚本刚载入时安全获取同对象上的其他组件，应该在哪个生命周期函数中执行 GetComponent？',
        options: [
          'A. Update()',
          'B. Awake()',
          'C. FixedUpdate()',
          'D. OnApplicationQuit()'
        ],
        correctIndex: 1,
        explanation: '讲义规范明确指出：Awake 在对象激活时最先执行且仅执行一次，是最理想的依赖注入与组件缓存时机。如果在 Update 中反复调用 GetComponent 会造成极大的 CPU 性能损耗与垃圾回收压力。'
      }
    ]
  },
  {
    id: 2,
    title: '2 动画与角色控制',
    subtitle: 'Sprite, Animator Controller, State Machine & Tilemap',
    chaoxingCourseName: '游戏程序设计2025-2026-2',
    targetClass: '数媒技术24214',
    overallProgress: 100,
    subsections: [
      {
        id: '2.1',
        code: '2.1',
        title: '精灵（Sprite）与动画',
        missionPoints: 3,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 35
      },
      {
        id: '2.2',
        code: '2.2',
        title: '状态机与动画控制',
        missionPoints: 4,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 45
      },
      {
        id: '2.3',
        code: '2.3',
        title: '瓦片地图',
        missionPoints: 2,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 25
      }
    ],
    textbookRef: {
      bookTitle: '《Unity 游戏程序设计基础》',
      press: '东北大学出版社 (2025.02.27)',
      publishDate: '2025年2月27日',
      coverImage: '/assets/aistudio/screenshot_2026-10-22_14-17-58_b7474d60.png',
      chapterIndex: '第2章',
      chapterTitle: '2D 精灵切片、状态机驱动与瓦片地图架构',
      pageRange: '第 33 ~ 78 页',
      excerptText: `本章深入 2D 像素与矢量角色的生命周期：
1. Sprite Editor：多图集 (Atlas) 切片模式选择 (Multiple / Single)，轴心点 (Pivot Point) 与网格对齐规范；
2. Animator 状态机：利用 Blend Tree（混合树）消除状态冗余，通过 Animator.SetFloat("Speed", speed) 与 SetTrigger("Jump") 实现代码解耦；
3. Tilemap 系统：Grid 网格、Tilemap Renderer、Tile Palette 笔刷与 Composite Collider 2D（复合碰撞体），通过单次绘制调用 (Draw Call Batching) 渲染万级地表瓦片。`,
      keyTerminology: ['Sprite Editor & Atlas', 'Animator Blend Tree', 'Finite State Machine (FSM)', 'Tilemap & Rule Tile', 'Composite Collider 2D'],
      lectureHighlights: [
        '角色朝向翻转优先使用 SpriteRenderer.flipX 或 localScale.x = -1，避免直接旋转欧拉角引发物理抖动',
        '动画状态过渡务必检查 Has Exit Time（是否有退出时间），需要即时响应跳跃/受伤时应取消勾选',
        '瓦片地图碰撞器务必勾选 Used By Composite，由复合碰撞体自动合并相邻多边形边缘'
      ]
    },
    nodes: [
      {
        id: 'node-2-1',
        title: '精灵图集切片与 Pixels Per Unit (PPU)',
        difficulty: '入门',
        estimatedMinutes: 20,
        summary: 'PPU 决定了多少像素等于 Unity 世界坐标里的 1 个单位。如果素材是 16x16 像素，将 PPU 设为 16 即可使每个地砖精确占据 1 个世界单位。',
        keyFormulasOrRules: [
          'Unity世界坐标单位 = 纹理像素尺寸 / PPU',
          '像素游戏纹理过滤务必设为 Point (No Filter)，避免抗锯齿发糊'
        ],
        completed: true
      },
      {
        id: 'node-2-2',
        title: 'Animator 状态机与过渡条件参数',
        difficulty: '核心难点',
        estimatedMinutes: 35,
        summary: '状态机管理 Idle, Run, Jump, Fall, Hurt 姿态。掌握 Float (速度阈值), Bool (是否在地面), Trigger (跳跃触发) 的参数驱动机制。',
        keyFormulasOrRules: [
          'Has Exit Time: 设为 False 即可在玩家按下空格瞬间打断跑步动画',
          'Transition Duration: 2D 像素游戏建议设为 0，避免动作帧交叉溶解模糊'
        ],
        completed: true,
        codeSnippet: `// 自编讲义第 52 页角色动画驱动示例
void Update() {
    float move = Input.GetAxisRaw("Horizontal");
    animator.SetFloat("Speed", Mathf.Abs(move));
    
    // 角色转向
    if (move != 0) {
        transform.localScale = new Vector3(Mathf.Sign(move), 1, 1);
    }
    
    if (Input.GetButtonDown("Jump") && isGrounded) {
        animator.SetTrigger("Jump");
        rb.linearVelocity = new Vector2(rb.linearVelocity.x, jumpForce);
    }
}`
      },
      {
        id: 'node-2-3',
        title: 'Tilemap 瓦片地图与 Composite Collider 性能优化',
        difficulty: '进阶',
        estimatedMinutes: 30,
        summary: '在网格上绘制成百上千个瓦片时，单个瓦片 Collider 会导致上千个微型刚体检测。使用 Composite Collider 2D 可以将连续边缘融合为单一多边形。',
        keyFormulasOrRules: [
          'Tilemap Collider 2D 勾选 Used By Composite',
          '挂载 Composite Collider 2D 并设置 Geometry Type 为 Polygons'
        ],
        completed: true
      }
    ],
    previewQuizzes: [
      {
        id: 'pq-201',
        question: '在 Unity 2D 角色控制中，若希望玩家按下跳跃按键时能“零延迟”立即切入跳跃动作，Animator 的过渡连线必须作何配置？',
        options: [
          'A. 必须勾选 Has Exit Time 并将过渡时长增大',
          'B. 取消勾选 Has Exit Time，并将 Transition Duration (过渡持续时间) 设为 0',
          'C. 将动画帧率降低到 5 FPS',
          'D. 必须在 Update 中使用 DestroyComponent'
        ],
        correctIndex: 1,
        explanation: '自编讲义第 55 页重点提示：Has Exit Time 勾选表示当前动作必须播完指定百分比才允许切换，会导致按键反应迟钝。取消勾选并将持续时间设为 0，能在 Trigger 触发瞬间无缝切换。'
      }
    ]
  },
  {
    id: 3,
    title: '3 物理与高级地图逻辑',
    subtitle: '2D Physics, Parallax Scrolling & 2D Lights',
    chaoxingCourseName: '游戏程序设计2025-2026-2',
    targetClass: '数媒技术24214',
    overallProgress: 100,
    subsections: [
      {
        id: '3.1',
        code: '3.1',
        title: '地图物理，与角色控制',
        missionPoints: 3,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 40
      },
      {
        id: '3.2',
        code: '3.2',
        title: '视差分层逻辑实现',
        missionPoints: 3,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 30
      },
      {
        id: '3.3',
        code: '3.3',
        title: '2D灯光技术与多场景管理',
        missionPoints: 3,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 35
      }
    ],
    textbookRef: {
      bookTitle: '《Unity 游戏程序设计基础》',
      press: '东北大学出版社 (2025.02.27)',
      publishDate: '2025年2月27日',
      coverImage: '/assets/aistudio/screenshot_2026-10-22_14-17-58_b7474d60.png',
      chapterIndex: '第3章',
      chapterTitle: '刚体物理模拟、视差滚动背景与 URP 2D 光照渲染',
      pageRange: '第 79 ~ 134 页',
      excerptText: `本章重点解决横版动作与冒险游戏的物理手感与纵深立体感：
1. Rigidbody2D 物理与地面检测：利用 Physics2D.OverlapCircle 或 Raycast 进行高精度脚底地面判定，避免贴墙连跳；
2. 视差滚动算法 (Parallax Scrolling)：近大远小与远景移动比率系数 (Parallax Factor)，让云层、远山与近景随主摄像机产生真实深度；
3. URP 2D 渲染管线：Sprite-Lit 材质、Point Light 2D、Freeform Light 2D、Normal Map 法线贴图与阴影投射器 (Shadow Caster 2D)。`,
      keyTerminology: ['Rigidbody2D & Physics Material', 'Ground Check OverlapCircle', 'Parallax Scrolling Factor', 'URP 2D Light & Shadow Caster', 'SceneManager.LoadSceneAsync'],
      lectureHighlights: [
        '自编讲义第 92 页：角色跳跃下落手感优化——在下落时增大重力系数 (gravityScale)，实现“起跳轻盈，下落迅速”的极佳操作手感',
        '视差分层代码必须放在 LateUpdate() 中执行，确保摄像机完成当前帧跟随平移后才更新背景位移',
        '场景切换必须使用异步加载 (AsyncOperation) 并在前台展示进度条，防止主线程阻塞白屏'
      ]
    },
    nodes: [
      {
        id: 'node-3-1',
        title: '高精度地面检测与角色跳跃物理',
        difficulty: '进阶',
        estimatedMinutes: 30,
        summary: '用物理射线或重叠圆检测角色脚底是否接触地面。配合物理材质 (Physics Material 2D) 设置 Friction 为 0 防止贴墙粘连。',
        keyFormulasOrRules: [
          'isGrounded = Physics2D.OverlapCircle(feetPos.position, radius, groundLayer);',
          '重力增强：if (rb.linearVelocity.y < 0) rb.gravityScale = fallMultiplier;'
        ],
        completed: true,
        codeSnippet: `// 讲义第 94 页：更具打击感的手感优化物理跳跃
void FixedUpdate() {
    if (rb.linearVelocity.y < 0) {
        rb.gravityScale = fallMultiplier; // 下落更快
    } else if (rb.linearVelocity.y > 0 && !Input.GetButton("Jump")) {
        rb.gravityScale = lowJumpMultiplier; // 短按小跳
    } else {
        rb.gravityScale = 1f;
    }
}`
      },
      {
        id: 'node-3-2',
        title: '视差滚动背景分层 (Parallax Scrolling)',
        difficulty: '进阶',
        estimatedMinutes: 25,
        summary: '利用摄像机位移 delta * 视差系数控制多层背景移动。远景系数为 0.9（移动极慢），近景系数为 0.1，营造出令人惊叹的 2.5D 层次感。',
        keyFormulasOrRules: [
          'targetPos.x = background.position.x + deltaCamera.x * parallaxEffect;'
        ],
        completed: true
      },
      {
        id: 'node-3-3',
        title: '2D URP 光照系统与全局氛围光',
        difficulty: '进阶',
        estimatedMinutes: 25,
        summary: '配置 Universal Render Pipeline (URP 2D)，利用 Global Light 2D 控制昼夜，Spot Light 2D 制作手电筒和篝火动态阴影。',
        keyFormulasOrRules: [
          '阴影投射：物体添加 Shadow Caster 2D 组件',
          'Sprite-Lit 材质：使地表瓦片接收点光源与法线凹凸'
        ],
        completed: true
      }
    ],
    previewQuizzes: [
      {
        id: 'pq-301',
        question: '为了实现“按下跳跃键松开越快跳得越矮（短跳），按住越久跳得越高（长跳）”的工业级操作手感，自编讲义推荐的核心做法是：',
        options: [
          'A. 频繁改变主角的 Collider 尺寸',
          'B. 当检测到向上运动且玩家已提前松开跳跃键时，临时增大刚体的重力缩放倍率 (gravityScale)',
          'C. 在 Update 中将 Time.timeScale 调慢',
          'D. 每次跳跃时重新 Instantiate 一个新刚体'
        ],
        correctIndex: 1,
        explanation: '讲义第 94 页专门重点分析：根据玩家松开按键的时刻动态将 gravityScale 提升（如升到 2.5 倍），可以自然而优雅地截断上升冲量，实现极富技巧性的长短跳手感。'
      }
    ]
  },
  {
    id: 4,
    title: '4 角色与交互',
    subtitle: 'Attributes, Health, Tile Interaction & NPC/Monster AI',
    chaoxingCourseName: '游戏程序设计2025-2026-2',
    targetClass: '数媒技术24214',
    overallProgress: 100,
    subsections: [
      {
        id: '4.1',
        code: '4.1',
        title: '角色属性与状态管理',
        missionPoints: 3,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 30
      },
      {
        id: '4.2',
        code: '4.2',
        title: '角色与地图交互',
        missionPoints: 2,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 25
      },
      {
        id: '4.3',
        code: '4.3',
        title: 'NPC与怪物逻辑',
        missionPoints: 4,
        progressPercent: 100,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: true,
        textbookReadingMinutes: 45
      }
    ],
    textbookRef: {
      bookTitle: '《Unity 游戏程序设计基础》',
      press: '东北大学出版社 (2025.02.27)',
      publishDate: '2025年2月27日',
      coverImage: '/assets/aistudio/screenshot_2026-10-22_14-17-58_b7474d60.png',
      chapterIndex: '第4章',
      chapterTitle: '角色状态机驱动、地图交互触发器与 NPC 巡逻追逐 AI',
      pageRange: '第 135 ~ 188 页',
      excerptText: `本章进入核心玩法业务逻辑架构：
1. 角色属性封装：HP 生命值、MP 魔法值与无敌帧闪烁 (Invulnerability Flash) 协程；
2. 地图机关与触发器交互：利用 OnTriggerEnter2D 与 IInteractable 接口实现宝箱开启动画、尖刺陷阱伤害与单向跳跃平台 (Platform Effector 2D)；
3. 怪物有限状态机 (FSM)：Patrol（左右定点巡逻）、Chase（视线发现玩家追逐）、Attack（近战判定）与 Die（掉落道具）。`,
      keyTerminology: ['Interface IInteractable', 'Trigger vs Collision', 'Invulnerable Coroutine', 'Monster FSM', 'Platform Effector 2D'],
      lectureHighlights: [
        '自编讲义第 148 页：受伤无敌帧务必使用协程 (Coroutine) 控制，通过临时修改 Layer 碰撞矩阵避开二次判定',
        '接口交互解耦：设计 public interface IInteractable { void Interact(); }，玩家无需关心接触的是门、NPC还是宝箱',
        '怪物巡逻遇墙或边缘折返：使用两根下向下和向前的微型 Raycast 探测深渊与阻挡'
      ]
    },
    nodes: [
      {
        id: 'node-4-1',
        title: 'C# 接口解耦：IInteractable 地图互动抽象',
        difficulty: '进阶',
        estimatedMinutes: 25,
        summary: '用面向对象接口将玩家与地图物体彻底解耦。不管是路灯、NPC 还是机关开关，只要实现 IInteractable 接口即可被玩家单键触发。',
        keyFormulasOrRules: [
          'IInteractable target = collider.GetComponent<IInteractable>();',
          'if (target != null) target.Interact();'
        ],
        completed: true
      },
      {
        id: 'node-4-2',
        title: 'NPC 与小怪巡逻/追逐状态机 (FSM)',
        difficulty: '核心难点',
        estimatedMinutes: 35,
        summary: '小怪在 Patrol 和 Chase 状态间切换。利用 Vector2.Distance 计算警戒半径，利用脚前 Raycast 探地防掉崖。',
        keyFormulasOrRules: [
          '边缘检测：Physics2D.Raycast(groundCheckPoint, Vector2.down, dist, groundMask)',
          '若射线未命中地面，立刻转向 flipX'
        ],
        completed: true,
        codeSnippet: `// 讲义第 162 页小怪巡逻转向核心
void Patrol() {
    rb.linearVelocity = new Vector2(speed * direction, rb.linearVelocity.y);
    RaycastHit2D groundInfo = Physics2D.Raycast(groundDetector.position, Vector2.down, 1f, groundLayer);
    
    // 如果走到平台边缘（没有地面了）或者撞墙，立刻反向
    if (!groundInfo.collider) {
        direction *= -1;
        transform.localScale = new Vector3(direction, 1, 1);
    }
}`
      }
    ],
    previewQuizzes: [
      {
        id: 'pq-401',
        question: '为了使怪物在悬崖边缘自动折返而不掉落悬崖，自编讲义第4章推荐的最轻量且可靠的物理检测手段是：',
        options: [
          'A. 记录地图全部格子的坐标数组',
          'B. 在怪物脚步稍前方发射一根向下的 Physics2D.Raycast 射线，若未命中地面层则立即调转方向',
          'C. 每帧更新怪物的 Mesh',
          'D. 在每处悬崖人工放置一个看不见的巨大碰撞体'
        ],
        correctIndex: 1,
        explanation: '讲义第 162 页明确说明：在怪物前方边缘挂载探针向下打射线，成本近乎为 0。一旦地面断开射线落空，立刻乘 -1 改变移动方向，工业游戏极其经典的做法。'
      }
    ]
  },
  {
    id: 5,
    title: '5 用户界面',
    subtitle: 'UGUI, Canvas, Health Bar, HUD & Event System',
    chaoxingCourseName: '游戏程序设计2025-2026-2',
    targetClass: '数媒技术24214',
    overallProgress: 96,
    subsections: [
      {
        id: '5.1',
        code: '5.1',
        title: '用户界面',
        missionPoints: 3,
        progressPercent: 96,
        isOpen: true,
        videoWatched: true,
        preclassQuizPassed: false,
        textbookReadingMinutes: 30
      }
    ],
    textbookRef: {
      bookTitle: '《Unity 游戏程序设计基础》',
      press: '东北大学出版社 (2025.02.27)',
      publishDate: '2025年2月27日',
      coverImage: '/assets/aistudio/screenshot_2026-10-22_14-17-58_b7474d60.png',
      chapterIndex: '第5章',
      chapterTitle: 'UGUI 交互系统、自适应锚点与血条 HUD 渲染优化',
      pageRange: '第 189 ~ 224 页',
      excerptText: `本章构建完整的玩家 HUD 交互系统：
1. Canvas 渲染模式：Screen Space - Overlay、Screen Space - Camera 与 World Space（头顶血条）；
2. 锚点 (Anchors) 与屏幕多分辨率自适应：9点锚定、Canvas Scaler 缩放策略 (Scale With Screen Size)；
3. UGUI 动效与性能：Image 的 Filled 填充类型平滑血条动画，避免勾选无用 Raycast Target 带来的重绘 (Draw Call) 与 CPU 遍历消耗。`,
      keyTerminology: ['Canvas Render Mode', 'Canvas Scaler & Anchors', 'Image Fill Amount', 'Raycast Target Optimization', 'EventSystem & Button OnClick'],
      lectureHighlights: [
        '自编讲义第 205 页：除了需要接收点击事件的按钮外，所有纯装饰性 Text 与 Image 务必取消勾选 Raycast Target',
        '世界坐标头顶血条必须将 Canvas 设为 World Space 并设置正确的 Sorting Layer，避免被地图瓦片遮挡',
        '血条掉血缓动：通过 Mathf.Lerp 或协程平滑扣除白色预警底条，提升打击反馈'
      ]
    },
    nodes: [
      {
        id: 'node-5-1',
        title: 'Canvas 锚点体系与多屏幕自适应',
        difficulty: '入门',
        estimatedMinutes: 20,
        summary: '锚点 (Anchors) 决定 UI 元素相对父窗口边缘的停靠比例。通过正确设置 Min/Max Anchors，无论手机屏幕比例为 16:9 还是 21:9，右上角小地图都能精准吸附。',
        keyFormulasOrRules: [
          'Canvas Scaler: 选用 Scale With Screen Size，基准分辨率设为 1920x1080',
          'Match 权重设为 0.5 (平衡宽与高自适应)'
        ],
        completed: false
      },
      {
        id: 'node-5-2',
        title: '平滑扣血 HUD 与 Raycast Target 性能调优',
        difficulty: '进阶',
        estimatedMinutes: 25,
        summary: '血条采用 Image Type = Filled (Horizontal)。点击事件由 EventSystem 分发，剔除不需要交互的 UI Raycast Target 可大幅降低输入阶段开销。',
        keyFormulasOrRules: [
          'hpImage.fillAmount = currentHp / maxHp;',
          '背景装饰图取消 Raycast Target 勾选'
        ],
        completed: false
      }
    ],
    previewQuizzes: [
      {
        id: 'pq-501',
        question: '在 UGUI 开发中，为了防止多分辨率适配时 UI 界面在宽屏设备上变形挤压，自编讲义第5章推荐 Canvas Scaler 采用哪种配置？',
        options: [
          'A. Constant Pixel Size (固定像素尺寸)',
          'B. Scale With Screen Size，设定参考分辨率 (如 1920x1080) 并按宽高加权匹配',
          'C. 将全部 UI 转换为 3D 网格',
          'D. 每次分辨率改变时重启 Unity 游戏'
        ],
        correctIndex: 1,
        explanation: '讲义第 198 页明确指出：采用 Scale With Screen Size 并指定参考分辨率，引擎会自动计算当前屏幕与基准的缩放因子，保证不同设备上的相对比例与布局完美一致。'
      }
    ]
  }
];

export const INITIAL_LIVE_QUIZ: LiveQuizQuestion = {
  id: 'lq-201',
  title: '【随堂抢答·自编讲义第2章】在 Unity 2D 动画状态机中，若角色从 Run 切到 Jump 需要立即响应按键，应该如何配置 Transition？',
  options: [
    '勾选 Has Exit Time，过渡时间设为 1 秒',
    '取消勾选 Has Exit Time，并将 Transition Duration 设为 0',
    '将动画组件从 GameObject 上卸载',
    '必须通过代码手动暂停整个游戏循环'
  ],
  correctIndex: 1,
  timeLimitSeconds: 20,
  explanation: '《Unity 游戏程序设计基础》（东北大学出版社）第 55 页重点强调：Has Exit Time 必须取消勾选，过渡时间归零，才能使 Trigger 触发时立刻无缝播放跳跃首帧！',
  stats: { 0: 7, 1: 76, 2: 3, 3: 14 }
};

export const INITIAL_LIVE_MESSAGES: LiveMessage[] = [
  {
    id: 'm-1',
    sender: '王晨 (数媒技术24214)',
    avatar: '👨‍🎓',
    role: 'student',
    content: '老师，自编讲义第94页的长短跳手感优化，下落时的 fallMultiplier 建议取值在多少范围最合适？',
    timestamp: '14:15',
    upvotes: 18,
    isQuestion: true,
    resolved: true
  },
  {
    id: 'm-2',
    sender: 'GameDev-AI助教',
    avatar: '🤖',
    role: 'ta',
    content: '根据教材第94页实战推荐，fallMultiplier 一般取 2.5 ~ 3.5 之间，小跳 lowJumpMultiplier 取 2.0，能呈现出如同《蔚蓝(Celeste)》般紧凑利落的跳跃手感。',
    timestamp: '14:16',
    upvotes: 24,
    isQuestion: false
  },
  {
    id: 'm-3',
    sender: '赵宇 (数媒技术24214)',
    avatar: '🎮',
    role: 'student',
    content: '超星平台上第3.2节视差滚动分层的代码，如果摄像机移动过快，背景会不会出现接缝撕裂？',
    timestamp: '14:22',
    upvotes: 11,
    isQuestion: true,
    resolved: false
  }
];

export const INITIAL_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'pq-csharp-01',
    category: '动画与瓦片地图',
    difficulty: '基础',
    title: '瓦片地图 Tilemap 复合碰撞体优化',
    description: '在制作包含 5000 块草地地砖的 2D 横版关卡时，若直接使用默认的 Tilemap Collider 2D 会产生数千个独立小碰撞体。自编讲义第2.3节推荐的工业级优化方案是：',
    codeSnippet: `// 目标：合并所有相邻瓦片为连续多边形
[RequireComponent(typeof(TilemapCollider2D))]
[RequireComponent(typeof(CompositeCollider2D))]
public class GroundSetup : MonoBehaviour {}`,
    options: [
      { id: 'A', text: '在瓦片上挂载 Composite Collider 2D，并勾选 Tilemap Collider 上的 Used By Composite' },
      { id: 'B', text: '把所有瓦片全部删除，换成纯代码画线' },
      { id: 'C', text: '每一帧把瓦片的位置重新归零' },
      { id: 'D', text: '将每个瓦片转为 3D 刚体' }
    ],
    correctAnswer: 'A',
    explanation: '根据《Unity 游戏程序设计基础》第 72 页，Composite Collider 2D 能够将所有标记为 Used By Composite 的相邻小碰撞体在物理底层自动融合成整体复合边缘，消除内部无用接缝，物理检测性能提升 90% 以上。',
    solved: true,
    userAnswer: 'A'
  },
  {
    id: 'pq-csharp-02',
    category: '角色状态与UI',
    difficulty: '中等',
    title: 'UGUI Raycast Target 性能减负规范',
    description: '以下是游戏界面中关于 UGUI 组件点击检测的说法，哪一个是完全符合东北大学出版社自编教材第5章规范的？',
    options: [
      { id: 'A', text: '所有静态图片 (Image)、血条背景、装饰性文字 (Text) 均应取消勾选 Raycast Target，仅对 Button 等交互元件开启' },
      { id: 'B', text: '每个 Text 必须开启 Raycast Target 才能正常显示字体' },
      { id: 'C', text: 'Raycast Target 会把图像发送到显卡做光线追踪' },
      { id: 'D', text: '关闭 Raycast Target 会导致画面变黑' }
    ],
    correctAnswer: 'A',
    explanation: '自编教材第 205 页专门提出：EventSystem 每次点击都会对勾选了 Raycast Target 的所有 Graphic 进行屏幕坐标命中遍历。非交互的装饰图如果不关闭该选项，会在 UI 复杂时造成严重的 CPU 峰值卡顿。',
    solved: false
  }
];

export const INITIAL_COMPETENCIES: CompetencyDimension[] = [
  {
    name: 'Unity引擎架构与生命周期',
    score: 95,
    maxScore: 100,
    level: '卓越 (S)',
    description: '对教材第1章 GameObject/Component 组合模式与生命周期调用序列理解透彻。'
  },
  {
    name: '2D动画与状态机控制',
    score: 92,
    maxScore: 100,
    level: '卓越 (S)',
    description: '精通 Animator 状态机参数传递、Blend Tree 混合与 Has Exit Time 触发控制。'
  },
  {
    name: '瓦片地图与物理碰撞',
    score: 88,
    maxScore: 100,
    level: '优良 (A)',
    description: '熟练掌握 Tilemap 复合碰撞体与 OverlapCircle 地面检测跳跃算法。'
  },
  {
    name: '高级地图逻辑与URP光照',
    score: 84,
    maxScore: 100,
    level: '优良 (A)',
    description: '掌握视差分层背景与 2D Light 光照管线，但在多场景异步过渡上可进一步深挖。'
  },
  {
    name: '角色状态与NPC AI',
    score: 86,
    maxScore: 100,
    level: '优良 (A)',
    description: 'IInteractable 接口解耦规范，小怪巡逻与防掉崖 Raycast 编写熟练。'
  },
  {
    name: 'UGUI多分辨率与性能调优',
    score: 76,
    maxScore: 100,
    level: '良好 (B+)',
    description: '掌握 Canvas 9点锚定，但对 Raycast Target 减负和血条平滑缓动稍有遗漏。'
  }
];

export const INITIAL_RESOURCES: LearningResource[] = [
  {
    id: 'res-textbook',
    title: '《Unity 游戏程序设计基础》（东北大学出版社 2025.02.27版）自编讲义精解',
    type: '书籍精读',
    tag: '课程指定核心讲义',
    matchScore: 100,
    recommendReason: '本课程唯一指定教师自编教材，涵盖 2D 角色控制、状态机、Tilemap、视差分层与 UGUI 全套知识体系。',
    authorOrSource: '主讲教研团队 (东北大学出版社)',
    url: '/assets/aistudio/screenshot_2026-10-22_14-17-58_b7474d60.png',
    difficulty: '初学者'
  },
  {
    id: 'res-chaoxing',
    title: '超星泛雅智慧课程平台：《游戏程序设计2025-2026-2》线上微课与闯关任务',
    type: '交互试验站',
    tag: '超星线上课程',
    matchScore: 99,
    recommendReason: '包含 1.1 至 5.1 全部 13 个小节的任务点微视频、随堂测验与章节闯关考核。',
    authorOrSource: '数媒技术24214班级专属平台',
    url: '/assets/aistudio/screenshot_2026-10-22_14-15-48_74d6252b.png',
    difficulty: '初学者'
  },
  {
    id: 'res-tilemap-demo',
    title: 'Unity 官方 2D Tilemap 与复合碰撞体示例工程',
    type: '开源项目',
    tag: '瓦片地图',
    matchScore: 94,
    recommendReason: '深入拆解 Rule Tile 自动铺路、Animated Tile 瀑布水流与 Composite Collider 2D。',
    authorOrSource: 'Unity Technologies',
    url: 'https://github.com/Unity-Technologies/2d-extras',
    difficulty: '中级开发者'
  }
];

export const INITIAL_ASSIGNMENT_PRESETS: AssignmentPreset[] = [
  {
    id: 'hw-jump-physics',
    title: '自编教材第3章作业：基于 Rigidbody2D 的工业级长短跳跃与悬崖折返 (C#)',
    description: '严格按照自编讲义第 94 页规范，编写玩家长短跳手感控制器，并在怪物脚本中实现脚底 Raycast 防掉崖巡逻。',
    language: 'csharp',
    defaultCode: `using UnityEngine;

public class PlayerJumpAndPatrol : MonoBehaviour
{
    [Header("跳跃参数 (自编讲义第94页规范)")]
    public float jumpForce = 12f;
    public float fallMultiplier = 2.5f;
    public float lowJumpMultiplier = 2f;
    
    [Header("地面检测")]
    public Transform groundCheck;
    public float checkRadius = 0.2f;
    public LayerMask groundLayer;
    
    private Rigidbody2D rb;
    private bool isGrounded;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        isGrounded = Physics2D.OverlapCircle(groundCheck.position, checkRadius, groundLayer);

        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.linearVelocity = new Vector2(rb.linearVelocity.x, jumpForce);
        }
    }

    void FixedUpdate()
    {
        // 改善跳跃手感：起跳轻盈，下落迅速，短按小跳
        if (rb.linearVelocity.y < 0)
        {
            rb.gravityScale = fallMultiplier;
        }
        else if (rb.linearVelocity.y > 0 && !Input.GetButton("Jump"))
        {
            rb.gravityScale = lowJumpMultiplier;
        }
        else
        {
            rb.gravityScale = 1f;
        }
    }
}`
  }
];

export const INITIAL_MISTAKES: MistakeItem[] = [
  {
    id: 'err-exit-time',
    topic: '动画与状态机',
    category: 'Animator 连线配置',
    title: '跳跃动作产生严重迟钝延迟，未能即时切入 Jump 姿态',
    errorDate: '2026-10-20',
    errorFrequency: 3,
    studentAnswer: '保留默认勾选 Has Exit Time，并且 Transition Duration 设为 0.25s',
    correctAnswer: '取消勾选 Has Exit Time，并将 Transition Duration 设为 0',
    aiDiagnosis: '自编教材第 55 页重点强调：Has Exit Time 强制要求当前 Run 或 Idle 动画播放完一定比例才允许跳出，导致按键有极强的输入黏滞感。动作游戏跳跃必须取消勾选并归零过渡时间。',
    rootCause: '未理解 Unity 状态机中 Exit Time 与即时 Trigger 的优先级机制',
    mastered: false
  },
  {
    id: 'err-raycast-ugui',
    topic: '用户界面',
    category: 'UGUI 性能重绘',
    title: '关卡地图中存在上百个纯展示性图标导致点击卡顿',
    errorDate: '2026-10-18',
    errorFrequency: 2,
    studentAnswer: '所有 Image 保持默认开启 Raycast Target',
    correctAnswer: '除接收点击的 Button 以外，所有静态图片和文字一律关闭 Raycast Target',
    aiDiagnosis: '自编教材第 205 页指出：EventSystem 每次鼠标或触摸事件都会对勾选了 Raycast Target 的所有 UI 元素进行屏幕遍历计算。关闭不必要的勾选可消除每帧的大量无效判定。',
    rootCause: '缺乏 UI 渲染层级与事件穿透分发的性能意识',
    mastered: true
  }
];

export const INITIAL_ENGAGEMENT_DATA: EngagementData = {
  overallScore: 92,
  attendanceRate: 98,
  interactionCount: 388,
  averageResponseTime: 4.2,
  timelineData: [
    { minute: 5, activity: '超星课前闯关数据汇报与 1.1~1.2 预习复盘', attentionScore: 94, confusionIndex: 10 },
    { minute: 12, activity: '讲义第2章：Sprite 精灵切片与 Animator 状态机', attentionScore: 91, confusionIndex: 20 },
    { minute: 20, activity: '【随堂实操】Tilemap 瓦片地图与 Composite Collider 拼装', attentionScore: 98, confusionIndex: 15 },
    { minute: 28, activity: '讲义第3章：视差分层 (Parallax) 算法数学推导', attentionScore: 82, confusionIndex: 42 },
    { minute: 35, activity: '手感优化：长短跳与重力系数动态衰减实测', attentionScore: 96, confusionIndex: 18 },
    { minute: 42, activity: '【随堂抢答竞赛】自编讲义第2-3章核心要点考核', attentionScore: 97, confusionIndex: 12 }
  ],
  hotQuestions: [
    { topic: '自编讲义第94页的 fallMultiplier 与 lowJumpMultiplier 如何微调到最佳手感？', count: 42, confusionRate: 65 },
    { topic: 'Tilemap 复合碰撞体使用时，刚体类型应该选 Static 还是 Dynamic？', count: 31, confusionRate: 48 },
    { topic: '视差分层算法中摄像机向左移动，远景层应该以多大的速率跟随？', count: 26, confusionRate: 35 }
  ],
  aiAdvice: [
    '全班在超星智慧平台的 1.1 至 4.3 章节闯关通过率达到 100%，课前预习基础非常扎实。',
    '第28分钟视差分层位移比率推导时出现小幅困惑波动，建议在下节课结合实机 LateUpdate 摄像机跟踪动画加深印象。',
    '数媒技术24214班在自编讲义代码实操环节表现极佳，建议在第5章结课时组织小型 2D 横版闯关游戏作品展评。'
  ]
};
