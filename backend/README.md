
# Synapse Server (Backend)

Synapse 的核心服务端口，负责数据持久化、记忆算法调度与权限管理。

## 🔥 核心逻辑

- **SRS Engine**: 实现基于艾宾浩斯曲线的 `NextReviewAt` 计算逻辑。
- **Heartbeat System**: 通过 Redis/DB 原子操作记录用户的有效学习时长。
- **Secure Auth**: 实现了基于 BCrypt + JWT 的无状态认证机制。

## 🚀 快速启动

### 1. 配置环境
复制配置文件副本：
```bash
cp config.example.yaml config.yaml
# 修改 config.yaml 中的 MySQL DSN 和 JWT Secret
```

### 2. 运行服务
```bash
go mod tidy
go run cmd/server/main.go
```

服务默认监听 :8080 端口。