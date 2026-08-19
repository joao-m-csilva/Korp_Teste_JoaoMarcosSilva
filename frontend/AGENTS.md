# AGENTS.md - Frontend Development Rules

These rules apply to all frontend development tasks.

---

# General Principles

- Prioritize simplicity, maintainability, and readability.
- Do not introduce unnecessary complexity, abstractions, or dependencies.
- Analyze the existing project structure before creating or modifying files.
- Follow the current architecture, naming conventions, and coding patterns.
- Avoid rewriting existing code unless there is a clear technical reason.
- Remove unused code, imports, components, styles, and dependencies when modifying existing features.

---

# Code Comments

- All code comments must be written in English.
- Comments should explain complex decisions, business rules, or non-obvious behavior.
- Do not write comments explaining obvious code.
- Avoid excessive comments that make the code harder to read.

---

# Components

- Create components only when they represent a reusable or meaningful UI responsibility.
- Avoid creating components that only wrap a single HTML element without adding value.
- Keep components focused on presentation and user interaction.
- Do not place business rules inside UI components.
- Prefer composition over large components with many responsibilities.

---

# Functions and Logic

- Never create functions without tests when they contain non-trivial logic.
- Keep functions small and focused on a single responsibility.
- Avoid unnecessary utility functions.
- Reuse existing functions and services before creating new ones.
- Business logic should not be duplicated in the frontend when it already exists in the backend.

---

# API Integration

- The frontend must consume the backend API as the source of truth.
- Do not create mock data, duplicated models, or fake business rules unless explicitly requested.
- Keep API communication isolated in services or dedicated layers.
- Handle loading, error, and empty states properly.
- Do not assume API responses; follow the backend contracts.

---

# UI / UX

- Do not use emojis as UI elements.
- Prefer professional icon libraries or existing UI libraries when icons are required.
- Do not manually create icons when a suitable library is available.
- Maintain visual consistency with the existing design system.
- Prioritize accessibility and usability.
- Avoid unnecessary animations, visual effects, or decorative elements.

---

# Styling

- Follow the existing styling approach of the project.
- Avoid adding new CSS frameworks or libraries without justification.
- Avoid duplicated styles.
- Prefer reusable styles and design tokens when available.
- Keep responsive behavior in mind.

---

# Forms and Validation

- Keep validations consistent with backend rules.
- Use frontend validation only to improve user experience.
- Do not duplicate complex business validation logic.
- Provide clear feedback for user input errors.

---

# Dependencies

- Do not add dependencies unless they provide clear value.
- Prefer existing project dependencies and built-in browser/framework capabilities.
- Before adding a library, verify whether the functionality can be implemented simply with the current stack.

---

# Testing

- New components with complex behavior should include tests.
- New services, utilities, or functions containing logic should include tests.
- Tests should validate user behavior and expected results.
- Avoid tests that only verify implementation details.

---

# AI Development Guidelines

Before making changes:

1. Inspect the existing frontend structure.
2. Understand the framework version and conventions.
3. Reuse existing components and services.
4. Avoid generating unnecessary boilerplate.
5. Do not create files that are not required.
6. Keep the implementation aligned with the backend capabilities.

Before finishing:

- Remove unused code.
- Verify imports.
- Verify tests.
- Confirm that the solution follows the existing architecture.
- Confirm that no unnecessary dependencies were introduced.