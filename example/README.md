# UserAvatar 组件迁移示例

本示例展示如何将使用 REST API `fetch` 的组件迁移到使用 Apollo Client 的 `useQuery` 钩子。

## 文件结构

- `src/graphql/queries/user.ts` - 定义 GraphQL 查询
- `src/apollo/client.ts` - Apollo Client 配置
- `src/components/UserAvatar.original.tsx` - 原始使用 fetch 的组件
- `src/components/UserAvatar.tsx` - 修改后使用 useQuery 的组件

## 主要变更

### 1. 导入变更

**原始代码：**
```tsx
import { useState, useEffect } from "react";
```

**修改后：**
```tsx
import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER_QUERY } from "../graphql/queries/user";
```

### 2. 状态管理移除

移除了手动的 `useState` 和 `useEffect`，改为使用 `useQuery` 自动管理加载、错误和数据状态。

### 3. 缓存自动处理

Apollo Client 的零配置缓存会自动缓存查询结果，避免重复请求。
