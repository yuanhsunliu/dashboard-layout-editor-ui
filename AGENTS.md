<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

<!-- SDD-EXTENSION:START -->
# SDD Workflow Extension

> **Author**: Yuan-Hsun Liu  
> **Purpose**: Extend OpenSpec with Epic Planning phase following Spec-Driven Development and MVP principles.  
> **Reusable**: Copy this block to other projects using OpenSpec.

## Extended Workflow: Stage 0 - Epic Planning

Before OpenSpec's Three-Stage Workflow, complete Stage 0:

### Stage 0: Epic Planning

**Trigger**: New project or major feature planning

**Workflow**:
1. **Confirm `openspec/project.md`** - Review and confirm project context, conventions, and constraints
2. **Define Features** - Break down into Feature Specs (F01, F02, ...) with clear scope
3. **Prioritize by MVP** - Mark P0 (MVP core), P1 (important), P2 (nice-to-have)
4. **Establish Development Order** - Define dependency-based sequence
5. **Create `openspec/specs/epics.md`** - Document features, priorities, and order

### New Requirement Proposal Flow

During development, new requirements may emerge. Follow this flow:

```
New Requirement Proposal
    ↓
┌─────────────────────────────────────┐
│  Stage 1: Create Change Proposal    │
│  - Create openspec/changes/<id>/    │
│  - Draft proposal.md, tasks.md      │
│  - Draft spec deltas                │
│  - Validate with openspec validate  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Clarify Requirements               │
│  - Review proposal with user        │
│  - Ask clarifying questions         │
│  - Confirm all spec details         │
│  - Update proposal based on answers │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Update ./specs/ (Pre-Implementation)│
│  - Update project.md if needed      │
│  - Add/Modify Feature Specs (FXX)   │
│  - Add/Modify Technical Specs (TXX) │
│  - Update epics.md development order│
└─────────────────────────────────────┘
    ↓
Continue with OpenSpec Stage 2-3
```

**Checklist for New Proposals**:

#### Phase 1: Create Proposal
1. [ ] Create change directory under `openspec/changes/<change-id>/`
2. [ ] Draft `proposal.md` with Why, What Changes, Impact
3. [ ] Draft `tasks.md` with implementation checklist
4. [ ] Draft spec deltas under `specs/` directory
5. [ ] Validate with `openspec validate <change-id> --strict`

#### Phase 2: Clarify Requirements
6. [ ] Review proposal with user
7. [ ] Ask clarifying questions for ambiguous requirements
8. [ ] Confirm all spec details and design decisions
9. [ ] Update proposal files based on confirmed answers

#### Phase 3: Update Specs (Pre-Implementation)
10. [ ] Check if `project.md` needs updates (scope, constraints, conventions)
11. [ ] Check if Technical Specs need updates (new TXX, infrastructure)
12. [ ] Check if Feature Specs need updates (new FXX in `specs/features/`)
13. [ ] Check if `epics.md` development order needs adjustment
14. [ ] Confirm proposal is ready for implementation

### MVP Principles

When planning development order:
- **P0 First**: Complete all P0 features before P1
- **Dependency Chain**: Features that depend on others come after
- **User Value**: Earliest deliverable that provides user value
- **Iterate**: Ship MVP, then extend in phases

### Epic Status Tracking

Track feature status in `epics.md`:

| Status | Meaning |
|--------|---------|
| 待開發 | Not started |
| 進行中 | In progress (has active change) |
| ✅ 完成 | Completed and archived |

### Integration with OpenSpec Stages

```
Stage 0: Epic Planning (this extension)
    ↓
Stage 1: Creating Changes
    ├── 1.1 Create Change Proposal (proposal.md, tasks.md, spec deltas)
    ├── 1.2 Clarify Requirements (ask questions, confirm details)
    └── 1.3 Update Specs (project.md, FXX, TXX, epics.md)
    ↓
Stage 2: Implementing Changes
    ↓
Stage 3: Archiving Changes
    ↓
Stage 3.1: Post-Archive Status Update (this extension)
    ↓
Next feature
```

### Post-Archive Status Update (Stage 3.1)

After `openspec archive <change-id>`, complete these updates:

**Checklist**:
1. [ ] Update `specs/features/FXX-*.md` or `specs/technical/TXX-*.md` status with timestamp
2. [ ] Update `specs/epics.md` feature status to `✅ 完成`
3. [ ] Update acceptance criteria checkboxes in the spec file
4. [ ] Verify spec content reflects final implementation (Data Model, Component Structure, etc.)
5. [ ] Confirm next feature in development order

### Status History Format

Each spec file should maintain a Status History section:

```markdown
## Status
- [x] Completed

## Status History
| Date | Status | Notes |
|------|--------|-------|
| 2026-01-07 | ✅ Completed | Archived as 2026-01-07-change-id |
| 2026-01-05 | 🔄 In Progress | Implementation started |
| 2026-01-03 | 📝 Planned | Initial spec created |
```

**Status Icons**:
| Icon | Status | Meaning |
|------|--------|---------|
| 📝 | Planned | Spec created, not started |
| 🔄 | In Progress | Active development |
| ✅ | Completed | Archived and verified |
| ⏸️ | On Hold | Paused (with reason) |
| ❌ | Cancelled | Cancelled (with reason) |

### Feature Spec Template

Each feature in `openspec/specs/features/` should include:

```markdown
# FXX: Feature Name

## Status
- [ ] Not Started / [ ] In Progress / [x] Completed

## Overview
Brief description of the feature

## User Stories
- As a [role], I can [action], so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Dependencies
- Depends on: F01, F02

## Out of Scope
- What this feature does NOT include
```

### Technical Spec Template

Each technical spec in `openspec/specs/technical/` should include:

```markdown
# TXX: Technical Name

## Status
- [ ] Not Started / [ ] In Progress / [x] Completed

## Overview
Brief description of the technical requirement (non-functional)

## Scope
- Infrastructure, tooling, performance, security, etc.

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Constraints
- Technology constraints, compatibility requirements

## Dependencies
- Depends on: (other specs or external systems)

## Out of Scope
- What this technical spec does NOT cover
```

### Spec Naming Convention

| Type | Prefix | Location | Example |
|------|--------|----------|---------|
| Feature Spec | FXX | `specs/features/` | F01-dashboard-crud.md |
| Technical Spec | TXX | `specs/technical/` | T01-project-setup.md |

### Triggers for Stage 0

Invoke Stage 0 when:
- "確認 project.md" / "confirm project.md"
- "規劃 epic" / "plan epics"
- "建立開發順序" / "establish development order"
- "MVP 規劃" / "MVP planning"
- Starting a new project with OpenSpec

<!-- SDD-EXTENSION:END -->