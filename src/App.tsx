import { useEffect, useMemo, useRef, useState } from 'react';
import { categories, quickReferences, topics, type Topic } from './data';
import './App.css';

type View = 'home' | 'catalog' | 'questions' | 'snippets' | 'reference' | 'topic';

const levelClass = (level: Topic['level']) => `tag tag-${level}`;

function App() {
  const hashTopic = window.location.hash.startsWith('#topic/') ? window.location.hash.slice(7) : '';
  const [view, setView] = useState<View>(topics.some((item) => item.id === hashTopic) ? 'topic' : 'home');
  const [topicId, setTopicId] = useState(hashTopic || topics[0].id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState('');
  const [questionCategory, setQuestionCategory] = useState('all');
  const searchInput = useRef<HTMLInputElement>(null);

  const topic = topics.find((item) => item.id === topicId) ?? topics[0];
  const codeTopics = topics.filter((item) => item.code);
  const totalMinutes = topics.reduce((sum, item) => sum + item.minutes, 0);
  const searchResults = useMemo(() => {
    const value = search.trim().toLocaleLowerCase();
    if (!value) return topics.filter((item) => item.level === '高频').slice(0, 7);
    return topics.filter((item) =>
      [item.title, item.label, item.summary, item.answer, ...item.keywords]
        .join(' ')
        .toLocaleLowerCase()
        .includes(value),
    );
  }, [search]);

  const questionTopics = questionCategory === 'all'
    ? topics
    : topics.filter((item) => item.category === questionCategory);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault();
        setSearchOpen(true);
        window.setTimeout(() => searchInput.current?.focus(), 0);
      }
      if (event.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navigate = (nextView: View) => {
    setView(nextView);
    setMenuOpen(false);
    if (nextView !== 'topic') window.history.replaceState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTopic = (id: string) => {
    setTopicId(id);
    setView('topic');
    setSearchOpen(false);
    setSearch('');
    setMenuOpen(false);
    window.history.replaceState(null, '', `#topic/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToCategory = (id: string) => {
    navigate('catalog');
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 30);
  };

  const copyCode = async (current: Topic) => {
    if (!current.code) return;
    await navigator.clipboard?.writeText(current.code);
    setCopied(current.id);
    window.setTimeout(() => setCopied(''), 1200);
  };

  return (
    <div className="app">
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`} aria-label="手册主导航">
        <button className="brand" type="button" onClick={() => navigate('home')}>
          <span className="brand-mark">F/</span>
          <span><strong>前端复习手册</strong><small>FRONTEND REVIEW</small></span>
        </button>

        <nav className="primary-nav">
          <button className={view === 'home' ? 'active' : ''} onClick={() => navigate('home')}><span>⌂</span>手册首页</button>
          <button className={view === 'catalog' ? 'active' : ''} onClick={() => navigate('catalog')}><span>⌗</span>完整目录</button>
          <button className={view === 'questions' ? 'active' : ''} onClick={() => navigate('questions')}><span>?</span>面试题库</button>
          <button className={view === 'snippets' ? 'active' : ''} onClick={() => navigate('snippets')}><span>&lt;/&gt;</span>代码手册</button>
          <button className={view === 'reference' ? 'active' : ''} onClick={() => navigate('reference')}><span>≡</span>速查表</button>
        </nav>

        <div className="side-label"><span>章节</span><span>{categories.length}</span></div>
        <nav className="chapter-nav" aria-label="章节导航">
          {categories.map((category) => (
            <button key={category.id} onClick={() => jumpToCategory(category.id)}>
              <span>{category.index}</span>
              <span><strong>{category.name}</strong><small>{category.short}</small></span>
              <i>→</i>
            </button>
          ))}
        </nav>

        <footer className="sidebar-footer">
          <span>HANDBOOK / EDITION 2026</span>
          <p>建立知识体系，<br />也练习如何把它讲清楚。</p>
        </footer>
      </aside>

      {menuOpen && <button className="scrim" type="button" aria-label="关闭菜单" onClick={() => setMenuOpen(false)} />}

      <main className="main">
        <header className="topbar">
          <button className="menu-button" type="button" aria-label="打开菜单" onClick={() => setMenuOpen(true)}>☰</button>
          <button className="search-button" type="button" onClick={() => { setSearchOpen(true); window.setTimeout(() => searchInput.current?.focus(), 0); }}>
            <span>⌕</span><span>搜索知识点、关键词、面试题…</span><kbd>/</kbd>
          </button>
          <div className="top-meta"><span>共 {topics.length} 个核心专题</span><i /> <span>约 {Math.round(totalMinutes / 60)} 小时</span><button type="button" aria-label="切换明暗主题" onClick={() => setDark(!dark)}>{dark ? '◑' : '◐'}</button></div>
        </header>

        {view === 'home' && (
          <div className="page home-page">
            <section className="hero">
              <div className="hero-main">
                <div className="eyebrow"><span>THE FRONTEND REVIEW</span><span>EDITION / 2026</span></div>
                <p className="hero-kicker">SYSTEMATIC · PRACTICAL · INTERVIEW-READY</p>
                <h1>前端工程师<br /><span>系统复习手册</span></h1>
                <p className="hero-intro">从语言基础到框架原理，从浏览器底层到工程实践。不是知识点堆砌，而是一套能理解、能复述、能落地的前端知识体系。</p>
                <div className="hero-actions"><button className="button-primary" onClick={() => navigate('catalog')}>打开完整目录 <span>→</span></button><button className="button-link" onClick={() => navigate('questions')}>浏览高频面试题 <span>↗</span></button></div>
                <div className="hero-index"><span>INDEX</span>{categories.slice(0, 4).map((category) => <button key={category.id} onClick={() => jumpToCategory(category.id)}>{category.index} / {category.name}</button>)}</div>
              </div>
              <aside className="hero-aside">
                <div className="window-dots"><i /><i /><i /><span>HANDBOOK.INDEX</span></div>
                <div className="hero-code-mark"><span>&lt;</span><b>/</b><span>&gt;</span></div>
                <div className="hero-stats"><div><strong>{categories.length}</strong><span>知识模块</span></div><div><strong>{topics.length}</strong><span>核心专题</span></div><div><strong>{codeTopics.length}</strong><span>代码示例</span></div><div><strong>{Math.round(totalMinutes / 60)}h</strong><span>完整阅读</span></div></div>
                <p>从结论出发<br />穿过机制与边界<br />最后落到工程判断</p>
              </aside>
            </section>

            <section className="home-section">
              <header className="section-header"><div><span className="number-box">01</span><div><p>KNOWLEDGE SYSTEM</p><h2>完整知识版图</h2></div></div><button onClick={() => navigate('catalog')}>查看全部专题 →</button></header>
              <div className="category-grid">
                {categories.map((category) => {
                  const categoryTopics = topics.filter((item) => item.category === category.id);
                  return (
                    <button key={category.id} onClick={() => jumpToCategory(category.id)}>
                      <span className="category-number">{category.index}</span>
                      <div><p>{category.short}</p><h3>{category.name}</h3><span>{category.description}</span></div>
                      <footer><span>{categoryTopics.length} TOPICS</span><i>↗</i></footer>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="method-section">
              <div className="method-heading"><span className="number-box">02</span><p>HOW TO USE</p><h2>一个知识点，<br />要复习到什么程度？</h2><p>不追求背下整篇文章。能够完成这四步，才算真正进入你的知识体系。</p></div>
              <ol><li><span>01</span><div><strong>给出结论</strong><p>用一句话说明它是什么、解决什么问题。</p></div></li><li><span>02</span><div><strong>解释机制</strong><p>讲清关键链路，不停留在 API 表面。</p></div></li><li><span>03</span><div><strong>写出示例</strong><p>用最小代码验证理解和边界条件。</p></div></li><li><span>04</span><div><strong>讨论取舍</strong><p>说出适用场景、常见坑与替代方案。</p></div></li></ol>
            </section>

            <section className="popular-section">
              <header className="section-header"><div><span className="number-box">03</span><div><p>MUST KNOW</p><h2>高频核心专题</h2></div></div></header>
              <div className="popular-list">{topics.filter((item) => item.level === '高频').slice(0, 8).map((item, index) => <button key={item.id} onClick={() => openTopic(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.title}</strong><small>{item.summary}</small></div><span>{item.label}</span><b>→</b></button>)}</div>
            </section>
          </div>
        )}

        {view === 'catalog' && (
          <div className="page catalog-page">
            <PageHeading index="INDEX / 01—08" title="完整目录" description="八个模块构成一套从基础到工程实践的前端知识体系。按顺序阅读，或直接从薄弱项开始。" />
            <div className="catalog-summary"><div><strong>{categories.length}</strong><span>模块</span></div><div><strong>{topics.length}</strong><span>专题</span></div><div><strong>{codeTopics.length}</strong><span>代码示例</span></div><div><strong>{Math.round(totalMinutes / 60)}h</strong><span>阅读时长</span></div></div>
            <div className="catalog-list">
              {categories.map((category) => {
                const categoryTopics = topics.filter((item) => item.category === category.id);
                return (
                  <section id={category.id} key={category.id} className="catalog-section">
                    <header><span>{category.index}</span><div><p>{category.short}</p><h2>{category.name}</h2><small>{category.description}</small></div><b>{categoryTopics.length} TOPICS</b></header>
                    <div>{categoryTopics.map((item, index) => <button key={item.id} onClick={() => openTopic(item.id)}><span>{category.index}.{String(index + 1).padStart(2, '0')}</span><div><strong>{item.title}</strong><small>{item.summary}</small></div><i className={levelClass(item.level)}>{item.level}</i><em>{item.minutes} min</em><b>→</b></button>)}</div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {view === 'questions' && (
          <div className="page questions-page">
            <PageHeading index="INTERVIEW / QUESTION BANK" title="面试题库" description="先合上答案独立组织 90 秒表达，再展开对照。题目按模块筛选，不记录分数。" />
            <div className="filter-row"><button className={questionCategory === 'all' ? 'active' : ''} onClick={() => setQuestionCategory('all')}>全部 <span>{topics.length}</span></button>{categories.map((category) => <button key={category.id} className={questionCategory === category.id ? 'active' : ''} onClick={() => setQuestionCategory(category.id)}>{category.name}</button>)}</div>
            <div className="question-list">
              {questionTopics.map((item, index) => (
                <details key={item.id}>
                  <summary><span>{String(index + 1).padStart(2, '0')}</span><div><small>{item.label}</small><strong>请解释：{item.title}</strong></div><i className={levelClass(item.level)}>{item.level}</i><b>+</b></summary>
                  <div className="question-answer"><p className="answer-label">90 SECOND ANSWER</p><p>{item.answer}</p><div><strong>回答结构</strong>{item.points.slice(0, 3).map((point) => <span key={point}>{point}</span>)}</div><aside><b>常见误区</b><span>{item.pitfall}</span></aside><button onClick={() => openTopic(item.id)}>打开完整笔记 →</button></div>
                </details>
              ))}
            </div>
          </div>
        )}

        {view === 'snippets' && (
          <div className="page snippets-page">
            <PageHeading index="CODE / MINIMAL EXAMPLES" title="代码手册" description="只保留能解释核心机制的最小实现。阅读后建议关掉答案，重新手写并补齐边界。" />
            <div className="snippet-grid">{codeTopics.map((item) => <article key={item.id}><header><div><span>{item.label}</span><h2>{item.title}</h2></div><button onClick={() => copyCode(item)}>{copied === item.id ? '已复制 ✓' : '复制'}</button></header><pre><code>{item.code}</code></pre><footer><span>{item.keywords.join(' · ')}</span><button onClick={() => openTopic(item.id)}>查看讲解 →</button></footer></article>)}</div>
          </div>
        )}

        {view === 'reference' && (
          <div className="page reference-page">
            <PageHeading index="QUICK REFERENCE" title="前端速查表" description="用于面试前的快速唤醒，不替代对机制和场景的理解。" />
            <div className="reference-grid">{quickReferences.map((reference, index) => <section key={reference.title}><header><span>{String(index + 1).padStart(2, '0')}</span><h2>{reference.title}</h2></header><ul>{reference.items.map((item) => { const [name, detail] = item.split('：'); return <li key={item}><strong>{name}</strong>{detail && <span>{detail}</span>}</li>; })}</ul></section>)}</div>
            <section className="answer-template"><div><span>INTERVIEW TEMPLATE</span><h2>90 秒回答模板</h2><p>这不是固定话术，而是避免答案失去结构的检查清单。</p></div><ol><li><b>01</b><span><strong>结论</strong>“它是……，主要解决……”</span></li><li><b>02</b><span><strong>机制</strong>“关键过程有三步……”</span></li><li><b>03</b><span><strong>应用</strong>“在项目中，我会……”</span></li><li><b>04</b><span><strong>边界</strong>“需要注意……，如果……则选择……”</span></li></ol></section>
          </div>
        )}

        {view === 'topic' && (
          <div className="page topic-page">
            <button className="back-button" onClick={() => navigate('catalog')}>← 返回完整目录</button>
            <article className="article">
              <header className="article-header"><div><span>{categories.find((category) => category.id === topic.category)?.name}</span><i /><span>{topic.label}</span></div><h1>{topic.title}</h1><p>{topic.summary}</p><footer><i className={levelClass(topic.level)}>{topic.level}</i><span>◷ {topic.minutes} 分钟</span><span>{topic.keywords.join(' · ')}</span></footer></header>
              <section id="conclusion" className="conclusion"><span>TL;DR / 一句话结论</span><p>{topic.answer}</p></section>
              <ArticleTitle number="01" title="核心机制" subtitle="先建立稳定的心智模型" />
              <section id="mechanism" className="point-list">{topic.points.map((point, index) => <div key={point}><span>{String(index + 1).padStart(2, '0')}</span><p>{point}</p></div>)}</section>
              {topic.code && <><ArticleTitle number="02" title="最小示例" subtitle="用代码验证理解，而不是记住结论" /><section id="example" className="code-block"><header><span>EXAMPLE.{topic.category === 'react' || topic.category === 'typescript' ? 'TSX' : 'JS'}</span><button onClick={() => copyCode(topic)}>{copied === topic.id ? '已复制 ✓' : '复制代码'}</button></header><pre><code>{topic.code}</code></pre></section></>}
              <ArticleTitle number={topic.code ? '03' : '02'} title="面试怎么答" subtitle="先结论，再机制，最后说边界" />
              <section id="answer" className="interview-answer"><span>90 SEC ANSWER</span><blockquote>{topic.answer}</blockquote><div>{topic.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div></section>
              <ArticleTitle number={topic.code ? '04' : '03'} title="常见陷阱" subtitle="真正拉开差距的边界条件" />
              <section id="pitfall" className="pitfall"><b>!</b><p>{topic.pitfall}</p></section>
              <nav className="article-next"><button onClick={() => { const index = topics.findIndex((item) => item.id === topic.id); openTopic(topics[(index - 1 + topics.length) % topics.length].id); }}><span>上一篇</span><strong>← {topics[(topics.findIndex((item) => item.id === topic.id) - 1 + topics.length) % topics.length].title}</strong></button><button onClick={() => { const index = topics.findIndex((item) => item.id === topic.id); openTopic(topics[(index + 1) % topics.length].id); }}><span>下一篇</span><strong>{topics[(topics.findIndex((item) => item.id === topic.id) + 1) % topics.length].title} →</strong></button></nav>
            </article>
            <aside className="toc"><span>本页目录</span><a href="#conclusion">一句话结论</a><a href="#mechanism">核心机制</a>{topic.code && <a href="#example">最小示例</a>}<a href="#answer">面试怎么答</a><a href="#pitfall">常见陷阱</a><div><span>所属模块</span><strong>{categories.find((category) => category.id === topic.category)?.name}</strong></div></aside>
          </div>
        )}
      </main>

      {searchOpen && (
        <div className="search-modal" role="dialog" aria-modal="true" aria-label="搜索手册">
          <button className="search-backdrop" type="button" aria-label="关闭搜索" onClick={() => setSearchOpen(false)} />
          <div className="search-panel"><header><span>⌕</span><input ref={searchInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索闭包、缓存、useEffect…" /><kbd>ESC</kbd></header><p>{search ? `${searchResults.length} 个搜索结果` : '高频专题'}</p><div>{searchResults.length ? searchResults.map((item) => <button key={item.id} onClick={() => openTopic(item.id)}><span>{categories.find((category) => category.id === item.category)?.index}</span><div><strong>{item.title}</strong><small>{item.label} · {item.keywords.join(' / ')}</small></div><b>→</b></button>) : <div className="empty-search">没有匹配内容，试试更短的关键词。</div>}</div></div>
        </div>
      )}
    </div>
  );
}

function PageHeading({ index, title, description }: { index: string; title: string; description: string }) {
  return <header className="page-heading"><span>{index}</span><h1>{title}</h1><p>{description}</p></header>;
}

function ArticleTitle({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return <header className="article-title"><span>{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div></header>;
}

export default App;
