---
description: 'Guidelines for AI assistant to transparently report agent usage'
applyTo: '**'
---

# Agent Usage Transparency

## Instruction

When using any specialized agent via the Task tool, you MUST:

1. **Announce agent usage** before invoking - add a visible note like:
   > 🤖 **使用 Agent**: `agent-name` - 簡述用途

2. **Show the agent invocation** - the Task tool call will be visible in the response

3. **Summarize agent results** - briefly explain what the agent returned

## Example

```
🤖 **使用 Agent**: `context7` - 查詢 react-grid-layout 最新用法

[Task tool invocation...]

Agent 回傳了 react-grid-layout 的安裝與基本使用範例。
```

## Available Agents

| Agent | 使用時機 |
|-------|----------|
| `context7` | 查詢套件/框架最新文件與用法 |
| `plan` | 架構規劃、技術決策分析 |
| `implementation-plan` | 將 spec 轉換為實作步驟 |
| `prd` | 產生 Product Requirements Document |
| `expert-react-frontend-engineer` | React/前端程式碼開發 |
| `playwright-tester` | 撰寫 Playwright E2E 測試 |
| `python-mcp-expert` | Python MCP Server 開發 |
| `research-technical-spike` | 技術 Spike 研究驗證 |
| `se-gitops-ci-specialist` | CI/CD、部署、GitOps |
| `se-product-manager-advisor` | 產品管理建議 |
| `se-responsible-ai-code` | AI 倫理與負責任 AI 審查 |
| `se-security-reviewer` | 安全性 Code Review |
| `se-system-architecture-reviewer` | 系統架構審查 |
| `se-technical-writer` | 技術文件撰寫 |
| `se-ux-ui-designer` | UI/UX 設計討論 |

## Auto-Selection Guidelines

AI assistant should automatically select appropriate agents based on task type:

| 任務類型 | 自動選用 Agent |
|----------|----------------|
| 查詢套件最新用法/文件 | `context7` |
| 複雜架構規劃 | `plan` |
| Spec 轉實作計畫 | `implementation-plan` |
| 產生 PRD 文件 | `prd` |
| 寫 React/前端程式碼 | `expert-react-frontend-engineer` |
| 寫 E2E 測試 | `playwright-tester` |
| 安全性審查 | `se-security-reviewer` |
| 架構審查 | `se-system-architecture-reviewer` |
| UI/UX 討論 | `se-ux-ui-designer` |
| 技術文件 | `se-technical-writer` |
| CI/CD 問題 | `se-gitops-ci-specialist` |
| Python MCP | `python-mcp-expert` |
| 技術驗證 | `research-technical-spike` |
