# AI Agent Guidelines & Project Context (Project: Imperial Codex)

## 1. Project Overview & Domain Context
**Name:** Imperial Codex (Working Title)
**Description:** A highly customized, visually imposing web wiki system designed for a creative writer. It serves as a digital sanctuary/codex for world-building, stories, and character profiles.
**Tone & Aesthetic:** "Neon Imperial Brutalism". Dark mode absolute, high-contrast neon accents (crimson/gold), blending World War I/II historical aesthetics with futuristic/cyberpunk elements (Gears of War inspired).
**Key Dynamics:** - **Egocentric Admin UX:** The system revolves around the "Creator" (Admin). High focus on personal branding, creation metrics, and frictionless authoring.
- **Immersive Public UX:** Standard users get a read-only, immersive, distraction-free encyclopedia experience.

## 2. Tech Stack & Agent Boundaries
You are operating within the following stack. **Do not deviate** or suggest alternative libraries without explicit user request.
- **Core:** Next.js (App Router), React, TypeScript (Strict Mode).
- **Styling:** Tailwind CSS, Framer Motion, Shadcn UI (Radix UI).
- **State/Fetching:** TanStack Query (React Query) for client-state, Supabase Client for server-state.
- **Backend/DB:** Supabase (PostgreSQL, Auth, Storage, RLS).

## 3. Core Architectural Principles (Strict Adherence)

### 3.1. Clean & Modular Code
- **DRY & SOLID:** Always prioritize readable, maintainable, and decoupled code.
- **Component Hierarchy:** Prefer small, single-responsibility components. Use the `atoms/molecules/organisms` or feature-based folder structure.
- **Server vs. Client Components:** Default to React Server Components (RSC). Only use `'use client'` when absolutely necessary (e.g., hooks, Framer Motion, event listeners).

### 3.2. TypeScript Strictness
- **No `any`:** The use of `any` is strictly prohibited. Use `unknown` if the type is truly dynamic, and narrow it down.
- **Supabase Typing:** Always utilize the generated `Database` types from Supabase for all data fetching functions.

### 3.3. UI/UX & Styling Rules
- **Tailwind First:** Use Tailwind utility classes. Avoid custom CSS files unless strictly necessary for complex animations.
- **Shadcn UI:** Leverage existing Shadcn components. Do not build from scratch if a Radix primitive exists.
- **Motion Restraint:** Framer Motion should be used for meaningful transitions (e.g., page loads, micro-interactions). Ensure `reduced-motion` accessibility standards are respected.

## 4. Agentic Interaction & Code Generation Rules

### 4.1. Step-by-Step Execution
Before writing code for complex features, output a brief architectural plan (1-3 sentences) explaining the approach.

### 4.2. Error Handling & Edge Cases
- Always implement loading states (skeletons preferred over spinners) and error boundaries.
- Assume network requests can fail. Implement retries via TanStack Query and fallback UI.

### 4.3. Future-Proofing (3D Maps)
When designing database schemas or data models for "Locations" or "Events", include nullable fields for spatial coordinates (X, Y, Z) to prepare for the future WebGL/React Three Fiber integration.

## 5. Prohibited Actions
- DO NOT expose API keys or Supabase service_role keys in client components.
- DO NOT hallucinate NPM packages. Verify compatibility with Next.js App Router before suggesting a package.
- DO NOT alter UI variables in `tailwind.config.ts` without explicitly checking the design requirements first.