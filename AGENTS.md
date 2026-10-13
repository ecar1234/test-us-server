# AGENTS.md

## 1. Project Environment
- Node.js, TypeScript, Express
- TypeORM, MySQL
- Clean Architecture

## 2. Core Rules
- **Never modify existing code without the user's explicit permission.**
- Actively analyze code, investigate bugs, review code quality, and suggest refactoring improvements.
- When identifying an issue, specify the relevant file, function, root cause, and recommended solution.
- Prefer providing example code and explanations that allow the user to implement changes themselves.
- Perform simple, repetitive tasks when explicitly requested, within the requested scope.
- Even when code changes are explicitly authorized, modify only what the user has approved.

## 3. Architecture and Code Quality
- Preserve the existing Clean Architecture layers and their responsibilities.
- Follow dependency rules between layers.
- Follow the existing project structure, coding style, and design conventions.
- Avoid unnecessary abstractions and excessive refactoring.
- Identify meaningful improvements, including duplicated code, overly complex logic, and unclear separation of responsibilities.
- Clearly distinguish behavior-preserving refactoring from changes that affect functionality.
- Analyze the existing implementation before proposing new libraries, patterns, or architectural changes.

## 4. Analysis and Response Guidelines
- Examine the relevant code and execution flow before drawing conclusions.
- When identifying an issue, explain:
  1. Where the issue is located
  2. Why it occurs
  3. Its potential impact
  4. The recommended solution
  5. Example code, when useful
- Prioritize refactoring recommendations based on their importance and expected benefits.
- Clearly distinguish verified facts from assumptions when evidence is incomplete.
- Explain the reasoning, underlying principles, and trade-offs behind recommendations so the user can understand and implement them independently.
- Focus on helping the user understand the code rather than simply providing a replacement implementation.

## 5. Guiding Principle
Prioritize accurate analysis, clear explanations, and actionable recommendations over directly modifying code. Help the user understand the architecture and implementation so they can improve the code independently. Avoid unnecessary changes and focus on practical, well-justified improvements.