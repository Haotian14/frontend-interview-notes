export type Level = '基础' | '高频' | '进阶';

export type Topic = {
  id: string;
  category: string;
  title: string;
  label: string;
  level: Level;
  minutes: number;
  summary: string;
  keywords: string[];
  points: string[];
  answer: string;
  pitfall: string;
  code?: string;
};

export const categories = [
  { id: 'html-css', index: '01', name: 'HTML & CSS', short: '结构与表现', description: '语义化、布局系统、响应式与可访问性' },
  { id: 'javascript', index: '02', name: 'JavaScript', short: '语言核心', description: '执行机制、对象模型、异步与模块化' },
  { id: 'typescript', index: '03', name: 'TypeScript', short: '类型系统', description: '类型建模、泛型、工具类型与工程配置' },
  { id: 'react', index: '04', name: 'React', short: '框架原理', description: '渲染、状态、Hooks、组件设计与性能' },
  { id: 'browser', index: '05', name: '浏览器 & 网络', short: '运行环境', description: '渲染链路、HTTP、缓存、安全与性能' },
  { id: 'engineering', index: '06', name: '前端工程化', short: '研发体系', description: '构建、测试、Git、设计与交付质量' },
  { id: 'handwrite', index: '07', name: '手写 & 算法', short: '编码能力', description: '高频实现题、复杂度与边界条件' },
  { id: 'project', index: '08', name: '项目 & 面试', short: '表达能力', description: '项目亮点、排障、性能案例与沟通框架' },
] as const;

export const topics: Topic[] = [
  {
    id: 'semantic-a11y', category: 'html-css', title: '语义化与可访问性', label: 'HTML 基础', level: '基础', minutes: 12,
    summary: '用正确的元素表达内容结构，让键盘、屏幕阅读器和不同输入方式都能完成任务。', keywords: ['语义化', 'ARIA', '键盘', '表单'],
    points: ['优先使用原生语义元素，ARIA 只补充原生能力的缺口。', '交互元素必须可聚焦，并提供清晰的焦点样式和可访问名称。', '图片根据用途提供有效 alt；纯装饰图片使用空 alt。', '表单错误需要与字段建立程序化关联，不能只依赖颜色。'],
    answer: '语义化让浏览器、辅助技术和开发者共享同一套内容结构。我会优先使用原生元素，再补充必要的 ARIA，并完整验证键盘操作路径。',
    pitfall: '给 div 加 role="button" 并不会自动获得按钮的键盘行为、禁用语义和表单能力。',
    code: `<button type="button" aria-describedby="save-tip">\n  保存草稿\n</button>\n<p id="save-tip">内容仅保存在当前设备</p>`,
  },
  {
    id: 'layout-system', category: 'html-css', title: '布局、定位与层叠', label: 'CSS 布局', level: '高频', minutes: 20,
    summary: '用正常流、包含块、BFC、Flex、Grid 和层叠上下文解释元素为什么出现在这里。', keywords: ['Flex', 'Grid', 'BFC', 'z-index'],
    points: ['Flex 适合一维分配和对齐，Grid 适合二维轨道布局。', '绝对定位元素相对最近的非 static 定位祖先所形成的包含块定位。', 'BFC 会隔离内部浮动与外部布局，并阻止特定的外边距合并。', 'z-index 只在当前层叠上下文内比较，父级上下文决定整体层级。'],
    answer: '我先判断内容是一维还是二维关系，再选 Flex 或 Grid；定位问题沿包含块和正常流排查，遮挡问题则先确认元素所在的层叠上下文。',
    pitfall: '把 z-index 调得再大也可能无效，因为元素处在层级更低的父级层叠上下文中。',
    code: `.layout {\n  display: grid;\n  grid-template-columns: minmax(16rem, 24rem) 1fr;\n  gap: clamp(1rem, 3vw, 3rem);\n}`,
  },
  {
    id: 'responsive-design', category: 'html-css', title: '响应式设计', label: 'CSS 实战', level: '进阶', minutes: 15,
    summary: '让布局根据内容和可用空间自然变化，而不是只适配几个固定设备尺寸。', keywords: ['移动优先', '容器查询', 'clamp', '逻辑属性'],
    points: ['从窄屏基础样式开始，用 min-width 逐步增强。', '组件级变化优先考虑容器查询，页面级结构使用媒体查询。', 'minmax、auto-fit 和 clamp 能减少脆弱断点。', '同时验证触控尺寸、页面缩放、横屏与长文本。'],
    answer: '响应式不是缩小桌面稿，而是让内容优先级随可用空间重排。我倾向移动优先，用流式尺寸和容器查询减少脆弱断点。',
    pitfall: '只按常见手机型号设置断点，会在分屏、字体放大和中间宽度下失效。',
  },
  {
    id: 'css-engineering', category: 'html-css', title: 'CSS 工程化', label: '样式架构', level: '进阶', minutes: 16,
    summary: '通过设计令牌、低特异性策略和组件边界，让样式可预测、可复用、可演进。', keywords: ['设计令牌', '级联层', 'CSS Modules', '特异性'],
    points: ['把颜色、间距、字号和动效抽象为语义化令牌。', '控制选择器深度与特异性，避免 !important 军备竞赛。', '组件样式保持局部，主题和重置承担全局职责。', '通过 prefers-reduced-motion 尊重减少动态效果的系统偏好。'],
    answer: 'CSS 工程化的核心是控制变化传播：令牌管理决策，组件管理边界，级联层管理优先级，让修改的影响范围可预测。',
    pitfall: 'CSS Modules、原子类或 CSS-in-JS 都不是银弹，关键仍然是令牌、边界和团队约束。',
  },
  {
    id: 'scope-closure', category: 'javascript', title: '作用域、提升与闭包', label: 'JS 语言机制', level: '高频', minutes: 18,
    summary: '从词法环境理解变量查找、TDZ 和闭包，而不是背零散规则。', keywords: ['词法作用域', 'TDZ', '闭包', '内存'],
    points: ['变量查找由函数定义位置决定，而不是调用位置。', 'let/const 存在暂时性死区，var 只有函数作用域。', '只要返回函数仍可达，它引用的外部环境就不会被回收。', '闭包适合状态封装，也可能因长期引用大对象增加内存占用。'],
    answer: '闭包是函数记住并访问其定义时词法作用域的能力，即使外层函数已经执行结束；常用于封装状态、缓存和函数工厂。',
    pitfall: '闭包不等于内存泄漏，只有不再需要但仍然可达的引用才构成泄漏。',
    code: `function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nnext(); // 1`,
  },
  {
    id: 'this-prototype', category: 'javascript', title: 'this、new 与原型链', label: 'JS 对象模型', level: '高频', minutes: 20,
    summary: '把调用方式、对象委托和构造过程串成一套统一的对象模型。', keywords: ['this', 'prototype', 'new', 'class'],
    points: ['普通函数的 this 取决于调用方式，箭头函数捕获外层 this。', 'new 会创建对象、连接原型、绑定 this、执行函数并处理返回值。', '属性查找从对象自身沿 [[Prototype]] 链向上进行。', 'class 是原型机制的语法抽象，不是新的继承模型。'],
    answer: 'this 看调用点，箭头函数看定义处；new 把新对象与构造函数 prototype 连接起来，因此实例能沿原型链共享方法。',
    pitfall: '把对象方法单独赋给变量后再调用，会丢失原来的隐式 this 绑定。',
  },
  {
    id: 'coercion-equality', category: 'javascript', title: '类型转换与相等比较', label: 'JS 基础', level: '基础', minutes: 14,
    summary: '掌握 ToPrimitive、真假值和严格相等，避免靠背诵怪题理解类型转换。', keywords: ['ToPrimitive', '===', 'truthy', 'NaN'],
    points: ['=== 不进行类型转换，但 NaN 与自身不等、+0 与 -0 相等。', '对象参与运算时先经 valueOf/toString 转为基本值。', '空数组和空对象是真值，空字符串是假值。', 'Object.is 可区分 +0/-0，并认为 NaN 与自身相等。'],
    answer: '隐式转换应从目标类型和 ToPrimitive 过程解释。业务代码优先严格相等，特殊数值比较使用 Number.isNaN 或 Object.is。',
    pitfall: '不能用 if (value) 判断所有“有值”场景，0、空字符串和 false 都可能是合法输入。',
  },
  {
    id: 'event-loop', category: 'javascript', title: '事件循环与任务队列', label: 'JS 异步', level: '高频', minutes: 20,
    summary: '从调用栈、任务、微任务和渲染时机解释异步代码的执行顺序。', keywords: ['调用栈', '微任务', '宏任务', '渲染'],
    points: ['同步代码在当前任务的调用栈中执行。', '每个任务结束后，浏览器会清空微任务队列，再判断是否渲染。', 'Promise 回调和 queueMicrotask 属于微任务，setTimeout 回调属于任务。', '持续产生微任务会饿死渲染与后续任务。'],
    answer: '一轮循环执行一个任务，清空全部微任务，再进入可能的渲染阶段。所以 Promise.then 通常先于 setTimeout，但仍需结合任务创建的上下文。',
    pitfall: '“微任务永远先于宏任务”并不准确，当前同步代码本身就在一个任务中。',
    code: `console.log('A');\nsetTimeout(() => console.log('B'));\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');\n// A D C B`,
  },
  {
    id: 'promise-async', category: 'javascript', title: 'Promise 与 async/await', label: 'JS 异步', level: '高频', minutes: 22,
    summary: '理解状态吸收、链式返回和并发组合，而不只是会写 await。', keywords: ['Promise', 'async/await', '并发', '错误传播'],
    points: ['then、catch、finally 都会返回新的 Promise。', 'async 函数始终返回 Promise，throw 会变成拒绝状态。', '互不依赖的请求应先创建再 Promise.all，避免意外串行。', 'all 快速失败，allSettled 收集全部结果，any 等待第一个成功。'],
    answer: 'Promise 把未来结果建模为不可逆状态，并通过链式返回组合异步步骤；async/await 改善控制流表达，但并发仍要显式使用 Promise 组合。',
    pitfall: '循环里逐个 await 会意外串行，使用前要确认任务是否存在依赖和并发上限。',
  },
  {
    id: 'esm', category: 'javascript', title: 'ES Module 与模块边界', label: 'JS 模块化', level: '进阶', minutes: 16,
    summary: '理解静态依赖、实时绑定、循环引用和 Tree Shaking 的成立条件。', keywords: ['ESM', 'CommonJS', 'Tree Shaking', '动态导入'],
    points: ['ESM 的 import/export 结构可静态分析，导入值是实时只读绑定。', 'CommonJS 在运行时执行 require，并导出对象。', 'Tree Shaking 依赖静态结构与可判断的副作用。', 'import() 是按需加载和路由分包的基础。'],
    answer: 'ESM 的静态依赖图和实时绑定让构建器能提前分析、分包并消除未使用导出，但副作用与循环依赖仍需谨慎设计。',
    pitfall: '使用 ESM 语法不代表一定能 Tree Shake，包的副作用声明和具体写法同样重要。',
  },
  {
    id: 'ts-basics', category: 'typescript', title: '类型系统与类型收窄', label: 'TS 核心', level: '基础', minutes: 20,
    summary: '用 unknown、联合类型和类型守卫，把不确定数据逐步变成可信数据。', keywords: ['unknown', 'never', '联合类型', '类型守卫'],
    points: ['any 关闭检查，unknown 要求使用前收窄。', '可辨识联合用稳定 tag 表达互斥状态。', 'never 可做穷尽检查，让新增分支在编译期暴露。', '类型断言不会做运行时校验，外部数据仍需验证。'],
    answer: 'TypeScript 是结构化静态类型系统。我会让边界数据先进入 unknown，再用守卫收窄，并用可辨识联合和 never 排除非法状态。',
    pitfall: 'as 只是覆盖编译器判断，不会把接口返回值真正转换成目标类型。',
    code: `type Result =\n  | { status: 'ok'; data: string }\n  | { status: 'error'; message: string };`,
  },
  {
    id: 'ts-generics', category: 'typescript', title: '泛型与类型关系', label: 'TS 核心', level: '高频', minutes: 20,
    summary: '泛型的价值是保留输入与输出之间的类型关系，而不是简单把 any 换成 T。', keywords: ['泛型', '约束', 'keyof', '类型推断'],
    points: ['类型参数应表达至少两个位置之间的关系。', 'extends 约束能力边界，默认泛型降低调用成本。', 'K extends keyof T 可安全关联对象与属性键。', '优先让调用点推断类型，只有必要时显式传参。'],
    answer: '泛型用类型参数描述值之间的关系，让一套实现适配多种类型且保留精确信息；约束负责说明实现真正依赖的能力。',
    pitfall: '只出现一次且不参与约束的 T 通常没有意义，直接写具体类型或 unknown 更清晰。',
    code: `function get<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}`,
  },
  {
    id: 'ts-advanced', category: 'typescript', title: '条件类型与映射类型', label: 'TS 进阶', level: '进阶', minutes: 24,
    summary: '通过类型层面的分支、遍历和推断构造可复用工具类型。', keywords: ['条件类型', 'infer', '映射类型', '模板字面量'],
    points: ['条件类型形如 T extends U ? X : Y。', '裸类型参数作用于联合时会产生分布式行为。', 'infer 可在匹配结构中声明待推断部分。', '映射类型遍历 keyof，并能增删 readonly 与可选修饰符。'],
    answer: '条件类型负责类型层面的分支，映射类型负责遍历键，infer 负责从结构中提取信息；组合后可以实现 ReturnType、Partial 等工具。',
    pitfall: '高级类型要服务业务建模，过度类型体操会让错误信息和维护成本失控。',
  },
  {
    id: 'ts-engineering', category: 'typescript', title: 'TS 工程配置与边界', label: 'TS 工程', level: '进阶', minutes: 18,
    summary: '理解 strict、模块解析、声明文件和类型边界如何影响真实项目质量。', keywords: ['tsconfig', 'strict', 'd.ts', 'satisfies'],
    points: ['strictNullChecks 能阻止大量空值错误，是 strict 的核心部分。', 'moduleResolution 要与构建器和运行环境匹配。', 'd.ts 只提供类型，不产生运行时代码。', 'satisfies 检查结构又保留具体推断，适合配置对象。'],
    answer: 'TS 配置不是越严格越好看，而是让编译期假设与运行环境一致。重点是开启 strict、明确模块解析，并在外部数据边界做运行时校验。',
    pitfall: '类型检查通过不代表运行时安全，接口、存储和用户输入都在类型系统之外。',
  },
  {
    id: 'react-render', category: 'react', title: '渲染模型与组件身份', label: 'React 核心', level: '高频', minutes: 22,
    summary: '把 render 理解为纯计算快照，状态与组件在树中的位置关联。', keywords: ['render', 'reconcile', 'key', 'state snapshot'],
    points: ['每次渲染拿到当次 state 与 props 的快照。', '组件函数执行不等于 DOM 一定更新，提交阶段才产生宿主变更。', '类型与 key 共同决定组件身份，身份变化会重置状态。', 'render 必须纯净，副作用放在事件或 Effect 中。'],
    answer: 'React 渲染根据当前输入计算 UI 快照，再通过协调找到最小提交；state 绑定在组件树位置上，type 或 key 改变会创建新身份并重置状态。',
    pitfall: '把 key 写成数组索引，在插入、删除或排序时可能让状态跟错数据。',
  },
  {
    id: 'react-state', category: 'react', title: '状态、批处理与更新队列', label: 'React 状态', level: '高频', minutes: 18,
    summary: '状态更新是排队下一次渲染，不会修改当前事件处理器里的快照。', keywords: ['batching', '函数式更新', '不可变', '派生状态'],
    points: ['同一批次中的更新会合并处理，以减少无效渲染。', '下一状态依赖前一状态时使用函数式更新。', '对象和数组应创建新引用，不能原地修改后复用。', '能从 props/state 计算得到的数据通常不应重复存进 state。'],
    answer: 'setState 把更新加入队列，当前闭包里的 state 仍是旧快照；连续依赖更新要用函数形式，并通过不可变数据让引用变化准确表达更新。',
    pitfall: '用 Effect 同步两个可计算状态，会多一次渲染并增加失步风险。',
    code: `setCount(current => current + 1);\nsetCount(current => current + 1);\n// 下一次渲染增加 2`,
  },
  {
    id: 'react-effect', category: 'react', title: 'Effect 与副作用同步', label: 'React Hooks', level: '高频', minutes: 22,
    summary: 'Effect 用来把 React 状态同步到外部系统，而不是通用生命周期回调。', keywords: ['useEffect', '依赖', '清理', '竞态'],
    points: ['没有外部系统时，通常不需要 Effect。', '依赖数组必须包含 Effect 读取的响应式值。', '清理函数撤销订阅、计时器或进行中的请求。', '开发环境 Strict Mode 重复执行用于暴露不对称清理。'],
    answer: 'Effect 的职责是同步外部系统；依赖描述同步所用输入，清理负责撤销上一次同步。数据派生和用户事件通常不该绕进 Effect。',
    pitfall: '通过漏写依赖“控制执行次数”会制造陈旧闭包，应调整代码结构而不是欺骗规则。',
  },
  {
    id: 'react-architecture', category: 'react', title: '组件设计与状态管理', label: 'React 工程', level: '进阶', minutes: 20,
    summary: '通过组合、单向数据流和清晰状态归属，降低组件耦合。', keywords: ['组合', '受控组件', 'Context', '状态归属'],
    points: ['状态放在需要它的组件的最近共同祖先。', '组合优于堆叠布尔配置，children 与 slots 保持开放性。', 'Context 适合低频跨层共享，不是服务端数据的默认容器。', '服务端缓存、客户端全局状态和表单状态应分开建模。'],
    answer: '组件设计先确定职责和状态归属，再用 props 保持单向数据流；跨层稳定依赖可用 Context，高频或复杂状态按领域选择专门方案。',
    pitfall: '不断膨胀的全局 store 会模糊数据来源、缓存责任和更新边界。',
  },
  {
    id: 'react-performance', category: 'react', title: 'React 性能优化', label: 'React 进阶', level: '进阶', minutes: 22,
    summary: '先定位真实瓶颈，再从状态范围、渲染成本和资源加载三层优化。', keywords: ['Profiler', 'memo', 'useMemo', '虚拟列表'],
    points: ['先用 Profiler 确认慢在哪里，不凭感觉加 memo。', '把状态下沉到最小共享范围，避免高层更新扩散。', 'memo 只有在 props 稳定且渲染昂贵时才可能获益。', '大列表使用虚拟化，重任务可切片或下放 Web Worker。'],
    answer: '我先测量提交耗时与更新来源，再优先缩小状态影响范围；确定重复计算或渲染昂贵后才使用缓存，并验证优化前后指标。',
    pitfall: '不稳定的对象和函数 props 会让 React.memo 失效，盲目缓存还会增加比较和理解成本。',
  },
  {
    id: 'render-pipeline', category: 'browser', title: '从 URL 到页面渲染', label: '浏览器原理', level: '高频', minutes: 26,
    summary: '串联网络请求、解析、样式计算、布局、绘制和合成的完整链路。', keywords: ['DNS', 'DOM/CSSOM', 'layout', 'composite'],
    points: ['网络阶段包含 URL 解析、缓存、DNS、连接、TLS 和 HTTP。', 'HTML/CSS 解析形成 DOM/CSSOM，再构建渲染树。', '布局计算几何信息，绘制生成指令，合成线程组合图层。', 'JS、CSS、字体和图片会以不同方式影响关键渲染路径。'],
    answer: '输入 URL 后先完成寻址与连接并获取资源，主线程解析 DOM/CSSOM，之后经历样式、布局、绘制和合成；优化就是减少关键资源、主线程阻塞和昂贵渲染。',
    pitfall: 'transform 通常只影响合成不等于“零成本”，大量图层也会消耗显存和管理开销。',
  },
  {
    id: 'http-cache', category: 'browser', title: 'HTTP、缓存与协商', label: '网络基础', level: '高频', minutes: 22,
    summary: '用新鲜度与验证器解释强缓存、协商缓存和工程中的版本策略。', keywords: ['Cache-Control', 'ETag', '304', 'CDN'],
    points: ['Cache-Control 决定缓存位置、新鲜度和复用约束。', '过期后可携带 ETag/Last-Modified 验证，未变化返回 304。', '带内容哈希的静态资源适合长期 immutable 缓存。', 'HTML 通常短缓存或需要验证，以便及时引用新版本资源。'],
    answer: '浏览器先根据 Cache-Control 判断资源是否新鲜，过期后用验证器向服务器确认。工程上 HTML 保持可更新，哈希静态资源长期缓存。',
    pitfall: '304 仍会发生网络往返，并不等于直接读取本地强缓存。',
  },
  {
    id: 'web-security', category: 'browser', title: 'Web 安全基础', label: '浏览器安全', level: '高频', minutes: 26,
    summary: '围绕信任边界理解 XSS、CSRF、CORS、Cookie 和安全响应头。', keywords: ['XSS', 'CSRF', 'CORS', 'CSP'],
    points: ['XSS 的核心是不可信输入被当作可执行内容，应按输出上下文编码。', 'CSRF 利用浏览器自动携带凭证，可用 SameSite、Token 与来源校验防护。', 'CORS 是浏览器读取响应的许可机制，不是服务端访问控制。', '敏感 Cookie 使用 HttpOnly、Secure 与合理的 SameSite。'],
    answer: '防 XSS 要避免不可信内容进入执行上下文，防 CSRF 要验证请求意图；CORS 只约束浏览器跨源读取，真正的授权仍然在服务端。',
    pitfall: '对字符串做一次统一转义并不够，HTML、属性、URL 和 JS 上下文需要不同策略。',
  },
  {
    id: 'web-performance', category: 'browser', title: 'Web 性能与核心指标', label: '性能优化', level: '进阶', minutes: 26,
    summary: '用 LCP、INP、CLS 和用户分位数据建立可测量的性能优化闭环。', keywords: ['LCP', 'INP', 'CLS', 'RUM'],
    points: ['LCP 关注最大内容出现速度，INP 关注交互响应，CLS 关注视觉稳定。', '实验室数据便于复现，真实用户数据反映设备和网络长尾。', '资源优先级、图片尺寸、字体策略和长任务是常见抓手。', '以 p75 和关键业务路径设预算，持续监控回归。'],
    answer: '性能优化先确定用户路径和指标，再用现场数据定位长尾、实验室工具复现；针对网络、主线程和渲染瓶颈改动，并用同一指标验证。',
    pitfall: '只盯 Lighthouse 单次分数会忽略真实用户、缓存状态和交互阶段的问题。',
  },
  {
    id: 'build-tools', category: 'engineering', title: '构建工具与产物优化', label: '工程化', level: '进阶', minutes: 22,
    summary: '理解依赖图、分包、压缩和浏览器缓存之间如何协作。', keywords: ['Vite', 'bundle', 'code splitting', 'source map'],
    points: ['开发阶段追求启动与热更新速度，生产构建追求稳定优化产物。', '路由与重型功能可动态导入，公共块要避免过度拆分。', '分析包体时同时看传输体积、解析执行成本和缓存命中。', 'Source Map 需平衡线上排障能力与源码暴露风险。'],
    answer: '构建工具把模块依赖图转成浏览器可部署资源；优化不仅是压缩，还包括合理分包、缓存边界、按需加载和降低 JS 解析执行成本。',
    pitfall: 'chunk 越小不一定越快，过度拆包会增加请求调度和运行时管理成本。',
  },
  {
    id: 'testing', category: 'engineering', title: '前端测试策略', label: '质量保障', level: '进阶', minutes: 20,
    summary: '按风险分配单元、集成和端到端测试，并尽量从用户行为验证。', keywords: ['单元测试', '集成测试', 'E2E', 'Mock'],
    points: ['纯函数和边界逻辑适合单元测试，组件流程优先集成测试。', 'E2E 覆盖少量关键业务路径，不承担全部排列组合。', '查询可访问角色和文本比依赖 DOM 结构更稳定。', 'Mock 外部边界，不要把被测实现本身完全替换掉。'],
    answer: '测试策略按失败风险和反馈速度分层：大量快速单元与集成测试覆盖逻辑，少量 E2E 守护核心路径，并从用户可观察行为断言。',
    pitfall: '追求覆盖率数字可能产生大量低价值断言，关键是覆盖真实风险与回归历史。',
  },
  {
    id: 'git-cicd', category: 'engineering', title: 'Git 协作与 CI/CD', label: '团队协作', level: '基础', minutes: 18,
    summary: '用小提交、清晰分支和自动门禁，让代码变更可审查、可追踪、可回滚。', keywords: ['rebase', 'merge', 'CI', '灰度发布'],
    points: ['提交围绕单一意图，信息重点解释为什么。', 'merge 保留分叉历史，rebase 重放提交形成线性历史。', 'CI 自动执行类型检查、测试、构建与必要的质量门禁。', '发布策略包含监控、灰度和明确回滚路径。'],
    answer: 'Git 把变更组织成可审查历史，CI 把团队共识变成自动门禁，CD 再把通过验证的产物以可观测、可回滚的方式交付。',
    pitfall: '不要 rebase 已经被多人基于其继续工作的公共分支，否则会重写共享历史。',
  },
  {
    id: 'frontend-design', category: 'engineering', title: '前端架构与设计原则', label: '架构设计', level: '进阶', minutes: 24,
    summary: '从变化、依赖和边界出发设计模块，而不是简单追求目录层级。', keywords: ['关注点分离', '依赖倒置', '领域边界', '可演进'],
    points: ['按变化原因划分模块，让一起变化的代码放在一起。', '业务层依赖抽象接口，外部服务通过适配器接入。', '共享组件应沉淀稳定模式，而不是过早抽象相似外观。', '架构决策要记录背景、选项、取舍和后续影响。'],
    answer: '前端架构的目标是控制变化成本。我会围绕领域和依赖方向划边界，对真正稳定的模式做抽象，并通过决策记录保留取舍上下文。',
    pitfall: '目录拆得很细不等于低耦合，如果依赖方向混乱，修改仍会跨越整个系统。',
  },
  {
    id: 'debounce-throttle', category: 'handwrite', title: '防抖与节流', label: '高频手写', level: '高频', minutes: 20,
    summary: '围绕执行时机、上下文、参数和取消能力实现可靠的频率控制。', keywords: ['debounce', 'throttle', 'timer', 'cancel'],
    points: ['防抖等待停止触发后执行，节流限制单位时间执行频率。', '保留最新参数和 this，并根据需要支持 leading/trailing。', '组件卸载或业务取消时清理定时器。', '输入联想还要处理请求竞态，防抖不能替代取消旧请求。'],
    answer: '防抖适合只关心一串触发的最终结果，节流适合持续过程中按固定频率反馈；实现时要明确首尾触发、上下文和取消语义。',
    pitfall: '只做防抖不能保证接口响应顺序，旧请求仍可能晚于新请求返回并覆盖结果。',
    code: `function debounce<T extends (...args: never[]) => void>(fn: T, wait: number) {\n  let timer: ReturnType<typeof setTimeout>;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), wait);\n  };\n}`,
  },
  {
    id: 'deep-clone', category: 'handwrite', title: '深拷贝与数据边界', label: '高频手写', level: '进阶', minutes: 22,
    summary: '从类型覆盖、循环引用和属性语义解释深拷贝的真实复杂度。', keywords: ['structuredClone', 'WeakMap', '循环引用', '原型'],
    points: ['JSON 方法会丢失 undefined、函数、Symbol 和特殊对象语义。', '递归实现需用 WeakMap 记录已访问对象，处理循环引用。', 'Date、RegExp、Map、Set 与属性描述符需要分别定义策略。', '业务中优先确认是否真的需要深拷贝，结构共享通常更高效。'],
    answer: '深拷贝不是简单递归，必须先约定支持的类型和语义；现代环境优先 structuredClone，自实现则用 WeakMap 处理循环引用并分别复制特殊对象。',
    pitfall: '函数闭包中的环境无法通过通用深拷贝安全复制。',
  },
  {
    id: 'promise-all', category: 'handwrite', title: '手写 Promise.all', label: '高频手写', level: '高频', minutes: 18,
    summary: '维护输入顺序、完成计数和快速失败语义，并兼容普通值。', keywords: ['Promise.resolve', '顺序', '快速失败', 'Iterable'],
    points: ['用 Promise.resolve 吸收普通值和 thenable。', '结果必须按输入顺序存放，而不是完成顺序。', '任一任务拒绝时外层立即拒绝。', '空输入应该立即兑现为空数组。'],
    answer: '遍历输入并记录索引，每项用 Promise.resolve 统一处理；成功就按原索引写入并计数，全部完成后 resolve，任一失败直接 reject。',
    pitfall: '直接 push 结果会得到完成顺序，违反 Promise.all 保持输入顺序的约定。',
    code: `function all<T>(items: Iterable<T | PromiseLike<T>>) {\n  const list = [...items];\n  return new Promise<T[]>((resolve, reject) => {\n    if (!list.length) return resolve([]);\n    const result: T[] = [];\n    let done = 0;\n    list.forEach((item, index) =>\n      Promise.resolve(item).then(value => {\n        result[index] = value;\n        if (++done === list.length) resolve(result);\n      }, reject),\n    );\n  });\n}`,
  },
  {
    id: 'async-pool', category: 'handwrite', title: '并发控制器', label: '工程手写', level: '进阶', minutes: 24,
    summary: '在吞吐、资源上限、顺序和错误策略之间做明确选择。', keywords: ['并发池', '队列', '背压', '错误策略'],
    points: ['同时运行数量不能超过 limit，完成一个再补一个。', '结果通常保持输入顺序，执行顺序可以独立。', '明确快速失败或收集全部错误的契约。', '真实工程还要考虑取消、重试、超时和动态背压。'],
    answer: '维护共享索引和固定数量 worker，每个 worker 循环领取下一个任务，结果写回原位置；再按业务定义快速失败、取消和重试策略。',
    pitfall: '用 Promise.all 分批执行会在每批最慢任务处产生空闲，worker 池的吞吐通常更好。',
  },
  {
    id: 'complexity', category: 'handwrite', title: '复杂度与常用数据结构', label: '算法基础', level: '基础', minutes: 22,
    summary: '用规模增长趋势评估实现，并熟悉 Map、Set、栈、队列和堆的使用场景。', keywords: ['Big O', 'Map', 'Set', '栈与队列'],
    points: ['复杂度描述输入规模增长时资源消耗的数量级。', '哈希表平均 O(1) 查找，代价是额外空间和无序语义。', '栈适合嵌套与回溯，队列适合广度处理与任务调度。', '先明确输入规模和操作分布，再选择数据结构。'],
    answer: '复杂度不是精确耗时，而是规模增长趋势。我会先识别主导操作和输入上限，再用合适数据结构降低最频繁或最昂贵的操作。',
    pitfall: 'O(1) 不代表一定比 O(n) 快，常数、数据规模和缓存局部性同样影响实际性能。',
  },
  {
    id: 'project-story', category: 'project', title: '项目亮点怎么讲', label: '面试表达', level: '高频', minutes: 16,
    summary: '用背景—决策—行动—结果讲清个人贡献，而不是复述产品功能。', keywords: ['STAR', '取舍', '个人贡献', '量化'],
    points: ['一句话交代用户、场景和问题规模。', '重点讲你的技术决策、替代方案与选择依据。', '行动描述关键难点与协作，不流水账罗列功能。', '结果用性能、质量、效率或业务指标验证，并说明局限。'],
    answer: '我会先界定问题和约束，再解释我负责的决策、为什么没选其他方案、如何落地，最后用前后对比数据和复盘收束。',
    pitfall: '只说“我们做了什么”会模糊个人贡献，也无法体现判断和成长。',
  },
  {
    id: 'performance-case', category: 'project', title: '性能优化案例', label: '项目深挖', level: '进阶', minutes: 20,
    summary: '从基线、定位、改动、验证到防回归，形成可信的性能故事。', keywords: ['基线', '火焰图', 'RUM', '性能预算'],
    points: ['固定设备、网络、页面和样本，记录可比较基线。', '用瀑布图、Performance 和 Profiler 定位瓶颈归属。', '每次改动对应明确假设，避免一次混入多个变量。', '上线后看真实用户分位数，并建立预算或告警防回归。'],
    answer: '我会用“指标异常—证据定位—针对性改动—同条件复测—线上监控”展开，强调数据链路和取舍，而不只罗列优化名词。',
    pitfall: '把本地一次最佳成绩当成果，会被追问测试条件、样本和线上表现。',
  },
  {
    id: 'troubleshooting', category: 'project', title: '线上问题排查', label: '项目深挖', level: '高频', minutes: 20,
    summary: '先止损再定位，用时间线、范围和证据不断缩小问题空间。', keywords: ['止损', '可观测性', '二分定位', '复盘'],
    points: ['确认影响范围、开始时间、版本和用户特征，优先止损。', '围绕最近变更、日志、监控和复现路径建立假设。', '一次只验证一个变量，用二分和对照缩小范围。', '修复后补监控、测试、预案与责任明确的复盘行动。'],
    answer: '线上故障先看影响并回滚或降级止损，再用时间线和证据验证假设；修复后还要补上能更早发现并阻止同类问题的机制。',
    pitfall: '没有证据时频繁改动生产环境会污染现场，让根因更难确认。',
  },
  {
    id: 'behavioral', category: 'project', title: '行为面试与反问', label: '综合面试', level: '基础', minutes: 16,
    summary: '用具体事件证明协作、学习和责任感，并通过反问判断团队环境。', keywords: ['冲突', '成长', 'Ownership', '反问'],
    points: ['选择真实且有行动细节的事件，避免抽象品质描述。', '冲突题强调共同目标、证据沟通与最终机制改进。', '失败题说明判断偏差、补救行动和后续行为变化。', '反问可聚焦成功标准、协作方式、技术挑战和反馈机制。'],
    answer: '行为题同样需要证据：明确情境和目标，重点讲我采取的行动与判断，再说明结果以及这件事如何改变我后续的工作方式。',
    pitfall: '把“没有冲突、没有失败”当优点，通常只会显得缺少复盘或真实项目经验。',
  },
];

export const quickReferences = [
  { title: 'HTTP 状态码', items: ['200 成功', '204 无响应体', '301/308 永久重定向', '302/307 临时重定向', '304 缓存仍有效', '400 请求错误', '401 未认证', '403 无权限', '404 不存在', '429 请求过多', '500 服务端错误', '502/504 网关异常'] },
  { title: '复杂度速查', items: ['数组按索引 O(1)', '数组查找 O(n)', 'Map/Set 平均 O(1)', '排序通常 O(n log n)', '二分查找 O(log n)', 'DFS/BFS O(V + E)'] },
  { title: '浏览器存储', items: ['Cookie：随请求携带', 'localStorage：同步、持久', 'sessionStorage：标签页会话', 'IndexedDB：异步结构化数据', 'Cache API：请求响应缓存'] },
  { title: 'React 选择', items: ['派生数据：直接计算', '用户触发：事件处理器', '外部同步：Effect', '跨层稳定值：Context', '服务端数据：缓存方案', '复杂状态转换：Reducer'] },
];
