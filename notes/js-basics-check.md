# JS Basics Check（wk0 day2 / wk1 day1）

> 用法：每个点补 3 样东西：
>
> 1. ✅🟡🔴 2) 面试一句话 3) 最小例子/关键词  
>    ✅ 讲得清 + 写得出；🟡 讲得清但写不顺/容易错；🔴 不清楚或没做过。

---

## 0. 现状标记

- 今日日期：2026-01-14
- 当前自评：🔴（整体）
- 本次目标：把每项都补上“一句话 + 例子”，先从 🔴→🟡

---

## 1) 变量 / 作用域 / 提升（Hoisting）

- var / let / const 区别：🔴

  - 一句话：var 是函数作用域且会提升；let/const 是块级作用域，有 TDZ；const 不能重新赋值（但对象属性可改）。
  - 关键词/例子：TDZ、重复声明、块级作用域

  ```js
  console.log(a); // undefined
  var a = 1;

  // console.log(b) // ReferenceError（TDZ）
  let b = 2;
  ```

- 作用域链（Scope Chain）：🔴

  - 一句话：变量查找从当前作用域往外层作用域逐层查找，直到全局或报错。
  - 关键词：lexical scope（词法作用域）

  ```js
  let x = 1;
  function f() {
    let x = 2;
    function g() {
      console.log(x);
    }
    g();
  }
  f(); // 2
  ```

- Hoisting（变量提升/函数提升）：🔴

  - 一句话：函数声明整体提升；var 只提升声明不提升赋值；let/const 提升但在 TDZ 不能用。
  - 关键词：function declaration vs function expression

  ```js
  foo(); // ok
  function foo() {}

  // bar() // TypeError: bar is not a function
  var bar = function () {};
  ```

---

## 2) 闭包（Closure）

- 闭包是什么：🔴

  - 一句话：函数“记住并访问”它创建时的外部作用域变量，即使外层函数已经执行完。
  - 关键词：函数 + 外部变量 + 持久引用

  ```js
  function makeCounter() {
    let c = 0;
    return function () {
      c++;
      return c;
    };
  }
  const counter = makeCounter();
  counter(); // 1
  counter(); // 2
  ```

- 闭包常见坑：🔴

  - 一句话：for + var 会共享同一个 i（函数作用域），导致异步回调拿到最终值。
  - 关键词：用 let 或 IIFE 修复

  ```js
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
  }
  // 输出：3 3 3

  for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log(j), 0);
  }
  // 输出：0 1 2
  ```

- 闭包应用场景：🔴

  - 一句话：封装私有状态、缓存、函数工厂（如 debounce/throttle）、模块化。
  - 关键词：私有变量、记忆化 memoize

---

## 3) this 绑定规则

- 默认绑定：🔴

  - 一句话：普通函数直接调用，非严格模式 this 指向 window；严格模式为 undefined。

  ```js
  function f() {
    console.log(this);
  }
  f();
  ```

- 隐式绑定：🔴

  - 一句话：作为对象方法调用时，this 指向调用它的对象（点号左边）。

  ```js
  const obj = {
    x: 1,
    f() {
      console.log(this.x);
    },
  };
  obj.f(); // 1
  ```

- 显式绑定（call/apply/bind）：🔴

  - 一句话：call/apply 立刻执行并指定 this；bind 返回新函数，this 被永久绑定。

  ```js
  function f() {
    return this.x;
  }
  const o = { x: 10 };
  f.call(o); // 10
  const g = f.bind(o);
  g(); // 10
  ```

- new 绑定：🔴

  - 一句话：new 调用会创建新对象并把 this 绑定到它，函数 prototype 会成为新对象原型。

  ```js
  function A() {
    this.x = 1;
  }
  const a = new A();
  a.x; // 1
  ```

- 箭头函数 this：🔴

  - 一句话：箭头函数没有自己的 this，this 取决于定义时外层作用域（词法 this），call/bind 改不了。

  ```js
  const obj = {
    x: 1,
    f: () => console.log(this.x),
  };
  obj.f(); // 可能是 undefined（取决于外层 this）
  ```

> this 优先级：new > bind > call/apply > 隐式 > 默认（箭头函数：看外层）

---

## 4) 原型与原型链

- prototype vs **proto**：🔴

  - 一句话：函数有 prototype（给实例用的）；对象有 **proto** 指向它的原型（内部 [[Prototype]]）。

  ```js
  function A() {}
  const a = new A();
  a.__proto__ === A.prototype; // true
  ```

- 原型链查找：🔴

  - 一句话：访问属性时，先找对象自身，再沿着 **proto** 向上找，直到 null。

  ```js
  const arr = [];
  arr.toString; // 来自 Array.prototype -> Object.prototype
  ```

- new 做了什么：🔴

  - 一句话：1 创建空对象 2 绑定 this 3 设置原型 4 执行构造函数 5 返回对象（除非构造函数显式返回对象）。
  - 关键词：`Object.create(Fn.prototype)`

- 继承方式（知道即可）：🔴

  - 一句话：class extends 本质还是原型链；子类原型指向父类原型链。
  - 关键词：extends、super

---

## 5) 类型与比较

- 基本类型 vs 引用类型：🔴

  - 一句话：基本类型按值存储/比较；引用类型变量存的是引用地址，比较比的是地址。

  ```js
  let a = { x: 1 };
  let b = { x: 1 };
  a === b; // false
  ```

- == vs ===：🔴

  - 一句话：=== 不做类型转换；== 会做隐式转换，坑多，面试一般建议用 ===。

  ```js
  "1" == 1; // true
  "1" === 1; // false
  ```

- 常见隐式转换坑：🔴

  ```js
  [] == ![]; // true（经典坑）
  "1" + 1; // "11"
  "1" - 1; // 0
  null == undefined; // true
  ```

---

## 6) Promise / async / await

- Promise 三态：🔴

  - 一句话：pending -> fulfilled/rejected，一旦变化不可逆。

- then/catch/finally：🔴

  - 一句话：then/catch 会返回新 Promise；throw 或 return Promise 会影响链式结果。

  ```js
  Promise.resolve(1)
    .then((x) => x + 1)
    .then((x) => {
      throw new Error("err");
    })
    .catch((e) => 0);
  ```

- async/await 错误处理：🔴

  - 一句话：await 等待 Promise；用 try/catch 捕获 await 的 reject。

  ```js
  async function f() {
    try {
      await Promise.reject("x");
    } catch (e) {
      return "handled";
    }
  }
  ```

- 并发：all / allSettled / race / any：🔴

  - 一句话：

    - all：全成功才成功（有一个失败就失败）
    - allSettled：都结束返回结果数组
    - race：最快的那个先出结果
    - any：第一个成功（都失败才失败）

---

## 7) 事件循环（Event Loop）

- macro task vs micro task：🔴

  - 一句话：每一轮事件循环先执行一个宏任务，再清空所有微任务。
  - 关键词：setTimeout 是宏任务；Promise.then / queueMicrotask 是微任务

- 能手推执行顺序：🔴

  ```js
  console.log(1);
  setTimeout(() => console.log(2), 0);
  Promise.resolve().then(() => console.log(3));
  console.log(4);

  // 输出顺序：1 4 3 2
  ```

---

## 8) 模块化与包管理（知道即可）

- CommonJS vs ESModule：🔴

  - 一句话：CJS 是运行时加载（require），ESM 是静态结构（import/export，支持 tree-shaking）。
  - 关键词：require/module.exports vs import/export

- 运行时 vs 编译时差异（了解）：🔴

  - 一句话：ESM 的依赖关系可在编译阶段分析；CJS 需要运行时执行才能知道导出。

---

## 9) DOM / 事件（前端必备）

- 事件冒泡/捕获/委托：🔴

  - 一句话：事件先捕获再到目标再冒泡；委托是把监听挂在父元素，用冒泡处理子元素事件。

  ```js
  ul.addEventListener("click", (e) => {
    if (e.target.matches("li")) console.log("li clicked");
  });
  ```

- 阻止默认/阻止冒泡：🔴

  - 一句话：preventDefault 阻止默认行为；stopPropagation 阻止继续冒泡/捕获传播。
  - 关键词：表单提交/链接跳转、冒泡链

---

## 10) 高频手写（至少做 2 个）

- debounce：🔴

  - 一句话：频繁触发时只执行最后一次（或停止一段时间后执行）。
  - 关键词：timer / clearTimeout

- throttle：🔴

  - 一句话：规定时间内最多执行一次（控制频率）。
  - 关键词：时间戳 / timer

- 深拷贝（JSON/递归/循环引用）：🔴

  - 一句话：递归复制对象/数组；处理 Date/RegExp；用 WeakMap 解决循环引用。

- call/apply/bind：🔴

  - 一句话：手写核心是“改变 this + 传参 + 返回值”；bind 要返回函数并处理 new。

---

## 11) 今日红黄清单（用于明天计划）

- 🔴 TOP3：
  1.
  2.
  3.
- 🟡 TOP3：
  1.
  2.
  3.

---

## 12) 备注（自己的坑/易错点）
