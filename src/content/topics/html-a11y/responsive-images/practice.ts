import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'responsive-images',
  code: {
    input: '写一个带 `srcset` 宽度描述符和 `sizes` 的 `img`，在 DevTools 里切换视口宽度与设备像素比，观察 Network 面板实际请求了哪个候选图。',
    output: '浏览器按 `sizes` 计算出的 CSS 像素宽度乘以 DPR 选出候选；把 `sizes` 写错（例如固定成 100vw 而实际只占一半）会让它稳定地多下载一档，说明 `sizes` 是开发者提供的布局承诺，浏览器不会替你测量。',
  },
  reference: {
    caption: '图片相关属性的职责划分',
    rows: [
      { term: 'srcset + w 描述符', meaning: '同一张图的不同分辨率，由浏览器按 sizes 和 DPR 选择。' },
      { term: 'picture + source', meaning: '需要开发者强制决定时使用：换格式、换裁剪、按媒体查询换图。' },
      { term: 'sizes', meaning: '声明图片在布局中会占多宽，必须与 CSS 实际结果一致。' },
      { term: 'loading="lazy"', meaning: '推迟视口外图片的加载，绝不要用在首屏主图上。' },
      { term: 'fetchpriority', meaning: '提升 LCP 图片或降低次要图片的优先级。' },
      { term: 'width / height 或 aspect-ratio', meaning: '让浏览器在图片到达前留出正确空间，避免布局偏移。' },
    ],
  },
  interview: {
    answer: '响应式图片要分清两个问题：分辨率切换和艺术方向。同一张图只是尺寸不同，用 img 的 srcset 加 w 描述符配合 sizes，由浏览器结合视口、DPR 甚至网络状况自己选，这样保留了浏览器的决策空间；如果要按断点换裁剪、换格式，就得用 picture 加 source，因为那是必须由开发者决定的。sizes 是一个承诺，它告诉浏览器图片在布局里会占多宽，写错会稳定地选大或选小，而浏览器在预加载扫描阶段还没有布局信息，无法自己算。时机上，首屏主图不加 loading=lazy，反而可以加 fetchpriority=high 或者预加载，视口外的图片才用 lazy。最后每张图都要写 width 和 height 或 aspect-ratio 占位，避免图片到达时把内容推下去，这是 CLS 的主要来源；alt 按用途写，装饰性图片要写空 alt 让辅助技术跳过。',
    followUps: [
      'srcset 的 w 描述符和 x 描述符分别适用于什么场景？',
      '为什么 sizes 写错会导致选错图，浏览器不能自己测量吗？',
      '什么时候该用 picture 而不是 srcset？',
    ],
  },
};
