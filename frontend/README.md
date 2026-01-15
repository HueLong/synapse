# Synapse Web (Frontend)


一个极具现代感、交互流畅的面试题库 Web 客户端。
采用 **React 18** + **Vite** 构建，融合了 **Glassmorphism (毛玻璃)** 风格与 **Framer Motion** 高级动画。

## ✨ 亮点功能

- **沉浸式 UI**: 全站采用 Tailwind CSS 打造的现代极简风，配备动态**聚光灯 (Spotlight)** 卡片效果。
- **流畅交互**: 
  - 列表页支持 **瀑布流 (Staggered Fade)** 入场动画。
  - 筛选与排序支持 **Layout Animation** 平滑过渡，无视觉跳变。
- **数据仪表盘**: 集成 Recharts，展示学习**热力图 (Heatmap)** 与技能**雷达图 (Radar)**，可视化你的成长轨迹。
- **沉浸式学习**: 
  - Markdown 实时渲染支持代码高亮。
  - 专注模式的心跳检测，自动记录有效学习时长。
- **移动端适配**: 完美适配移动端，支持侧边栏抽屉 (Drawer) 交互。

## 🛠 技术栈

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Animation**: Framer Motion
- **Components**: Ant Design (Headless 理念使用)
- **Charts**: Recharts, React-Calendar-Heatmap
- **Network**: Axios (拦截器封装)

## 🚀 开发指南

### 1. 安装依赖
```bash
pnpm install 或 npm install
```
### 2. 启动开发模式
Bash
```
npm run dev
```
访问 http://localhost:5173。

## 📦 部署
``` Bash
npm run build
```
构建产物将生成在 dist 目录下，可直接部署至 Nginx 或 Vercel。

