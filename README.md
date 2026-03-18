# ⚡ Synapse

> **Connect your knowledge. Master your tech stack.**
> 连接你的知识，构建工程师的第二大脑。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Go](https://img.shields.io/badge/Backend-Go%201.25+-00ADD8.svg?logo=go&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB.svg?logo=react&logoColor=black)

**Synapse** 是一个全栈开发的现代化面试题库与知识管理系统。它不只是一个笔记本，更是一个基于 **艾宾浩斯遗忘曲线 (Ebbinghaus)** 的智能复习助教。

通过 **Go (Gin)** 提供的稳健后端与 **React + Framer Motion** 打造的沉浸式前端，Synapse 致力于将枯燥的“背题”转化为一种流畅、可视化的心流体验。

## 📸 预览 (Preview)

| 沉浸式刷题 (Spotlight UI) | 学习数据仪表盘 (Dashboard) |
|:---:|:---:|
| ![Home Preview](./frontend/assets/preview-home.png) | ![Stats Preview](./frontend/assets/preview-stats.png) |

## ✨ 核心特性 (Features)

- 🧠 **智能调度算法**: 内置 SRS (间隔重复系统)，根据你的掌握程度自动安排下一次复习时间。
- 🔦 **沉浸式交互**: 独家设计的 "Spotlight" 聚光灯卡片与平滑的布局流动画，拒绝枯燥。
- 📊 **可视化反馈**: GitHub 风格的**学习热力图**与**技能雷达图**，量化你的每一次进步。
- 🛡️ **企业级安全**: 完整的 JWT 认证体系与 RBAC 权限控制 (Admin/User)。
- ⏱️ **心跳检测**: 自动记录有效学习时长，通过 Hook 模型建立学习习惯。

## 🚀 快速导航 (Quick Start)

这是一个 Monorepo 仓库，包含前后端完整代码：

- **服务端 (Backend)**: 基于 Go Gin + GORM + MySQL。
  - [👉 查看后端文档与部署指南](./backend/README.md)

- **客户端 (Frontend)**: 基于 React 18 + Vite + Tailwind CSS。
  - [👉 查看前端文档与启动指南](./frontend/README.md)

## 🛠️ 技术栈 (Tech Stack)

| 层级 | 技术选型 |
| :--- | :--- |
| **Backend** | Go, Gin, GORM, MySQL, JWT, Viper |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **Charts** | Recharts, React-Calendar-Heatmap |
| **Infra** | Docker (Optional), Nginx |

## 📄 License

MIT © [huelong]