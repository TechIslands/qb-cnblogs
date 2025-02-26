# 博客园快速美化框架 (cnblogLoader.js)

## 项目简介

本项目为博客园(https://www.cnblogs.com/)个人博客提供快速美化解决方案，通过简单的配置即可实现博客风格的现代化改造，无需深入了解CSS和JavaScript知识。

## 设计风格

默认提供两种经典风格：

### Nabo风格
受Twitter启发的简约蓝色主题
- [设计参考](https://twitter.krait.cn/)
- [原始主题](https://github.com/nakbo/Nabo-theme-typecho)

### Reborn风格
清新现代的绿色主题
- [设计参考](https://shawnzeng.com/)
- [原始主题](https://github.com/ShawnZeng1996/reborn)

## 设计特点

### 整体风格
- 简约现代设计
- 卡片式内容布局
- 扁平化设计元素
- 柔和舒适的色彩搭配
- 全响应式设计，完美适配各类设备

### 色彩方案
- Nabo主题：#1DA1F2（Twitter蓝）
- Reborn主题：#49C468（清新绿）
- 背景色：#F5F8FA（浅灰色背景）
- 文字颜色：#333333（主要文字）、#657786（次要文字）
- 强调色：#E1E8ED（边框和分割线）

## 功能特性

- ✨ 一键部署，快速美化
- 🌓 明暗模式切换
- 📱 完美响应式设计
- 🧩 可配置的侧边栏位置
- 📜 无限滚动文章列表
- 🎨 可扩展的主题样式
- 🚀 CDN加速资源加载

## 使用指南

### 前提条件
- 拥有博客园账号
- 已开通博客园的自定义CSS和JavaScript权限

### 快速部署方法（推荐）

在博客园后台管理页面中，找到"页面定制CSS代码"，添加以下代码：

```html
<script type="text/javascript">
(()=>{
  // 主题配置对象
  let p = {};
  
  // 主题样式：'nabo'或'reborn'
  p.themeStyle = "nabo"; 
  
  // 是否默认启用暗黑模式
  p.darkMode = false;
  
  // 侧边栏位置：'left'或'right'
  p.sidebarPosition = "right";
  
  // 是否启用无限滚动
  p.infiniteScroll = true;
  
  // 静态资源路径（使用CDN加速）
  p.staticSrc = "//cdn.jsdelivr.net/gh/TechIslands/qb-cnblogs@main/dist/";
  
  // 可选：额外CSS文件
  p.extCss = [];
  
  // 可选：额外JS文件
  p.extJs = [];
  
  // 设置全局配置对象
  window.__BLOG_CONFIG__ = p;
})();
</script>
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/TechIslands/qb-cnblogs@main/dist/js/cnblogLoader.min.js"></script>
```

> **注意**：请将代码中的 `TechIslands` 替换为您的GitHub用户名或您托管资源的实际路径。

### 配置参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| themeStyle | string | "nabo" | 主题风格，可选值："nabo"、"reborn" |
| darkMode | boolean | false | 是否默认启用暗黑模式 |
| sidebarPosition | string | "right" | 侧边栏位置，可选值："left"、"right" |
| infiniteScroll | boolean | true | 是否启用文章列表无限滚动加载 |
| staticSrc | string | - | 静态资源CDN路径，以"/"结尾 |
| extCss | array | [] | 额外加载的CSS文件URL数组 |
| extJs | array | [] | 额外加载的JS文件URL数组 |

## 高级定制

如需进一步定制主题样式，您可以通过以下方式：

1. Fork本项目到您的GitHub仓库
2. 修改 `src/css` 目录下的相关样式文件
3. 运行构建脚本生成新的发布文件
4. 更新您的博客配置，指向您自己的资源路径

## 本地开发

```bash
# 安装依赖
npm install

# 构建项目
node build.js

# 构建输出目录
./dist/
```

## 浏览器兼容性

- Chrome (最新3个版本)
- Firefox (最新3个版本)
- Safari (最新3个版本)
- Edge (最新3个版本)

## 参考资源

- [博客园自定义皮肤教程](https://blog.csdn.net/weixin_45765795/article/details/113928881)
- [博客园主题快速部署教程](https://www.cnblogs.com/yjlaugus/p/13466375.html)
- [CSS动画库：Animate.css](https://animate.style/)
- [图标库：Font Awesome](https://fontawesome.com/)

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进本项目。

## 许可证

本项目采用 [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](LICENSE) 许可证。

这意味着您可以自由地：
- 分享 — 在任何媒介以任何形式复制、发行本作品
- 演绎 — 修改、转换或以本作品为基础进行创作

惟须遵守下列条件：
- 署名 — 您必须给出适当的署名，提供指向本许可协议的链接，同时标明是否对原始作品作了修改
- 非商业性使用 — 您不得将本作品用于商业目的
- 相同方式共享 — 如果您再混合、转换或者基于本作品进行创作，您必须基于与原先许可协议相同的条款分发您的贡献作品

详细信息请参阅 [CC BY-NC-SA 4.0 完整许可证](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)
