# Poll Builder Design Document

This document outlines the design architecture and UX patterns implemented in the **NewPoll** component and its associated full-page administrative workflow.

## 1. Design Philosophy
The Poll Builder follows the **"Ecosystem Creation Utility"** pattern—a standardized interface used for major creation flows (like communities, rewards, and polls). The goal is to provide a high-focus, single-page environment that reduces cognitive load while providing immediate visual feedback.

## 2. Layout & Composition
The layout utilizes a responsive **12-column grid** optimized for administrative density.

- **Sticky Header (Primary Controls):** 
  - Maintains context (Title, Breadcrumb) and primary actions (Cancel, Create) regardless of scroll position.
  - Matches the `/communities/create` layout for institutional consistency.
- **Main Form (8/12 Column):**
  - Concentrates focus on the content generation task.
  - Uses a **Flat Form Architecture** (replacing the previous 3-step wizard) to allow users to see the entire configuration at once.
- **Utility Sidebar (4/12 Column):**
  - **Live Preview:** Provides real-time rendering of the poll as it will appear to end-users. This serves as functional documentation for the user, answering "How will this look?" without leaving the form.
  - **Contextual Help:** A "Quick Guide" section providing micro-copy tips to improve the quality of user-generated content.

## 3. UI Patterns & Components
The interface is built on **shadcn/ui** with custom "Ecosystem" enhancements.

- **Cards:** Styled with `border-none`, `shadow-sm`, and `ring-1 ring-border/50` for a premium, integrated look.
- **Typography:**
  - **Labels:** Standard `Label` component with `text-sm font-medium`.
  - **Metadata:** Smaller `text-xs text-muted-foreground` for character counters and helper text.
- **Input Fields:** 
  - Simplified from "Heavy Zinc" (rounded-2xl) to standard Shadcn style for better density and professionalism.
  - Textareas use `resize-none` with fixed row heights to maintain layout stability.
- **Option Row Management:**
  - Hover-active controls for reordering (`ArrowUp`, `ArrowDown`) and deletion.
  - Keeps the interface clean by hiding secondary actions until intent is shown.

## 4. Mobile Responsiveness
- **Sticky Bottom Action Bar:** On small screens, primary actions (Cancel/Create) move to a sticky footer to ensure "one-thumb" accessibility.
- **Stacking:** The 2-column grid collapses into a single column, prioritizing the Form above the Preview and Tips.

## 5. State Management
- **Formik:** Handles form validation, initial values, and coordinate submission.
- **Yup Schema:** Enforces strict content rules (min/max characters, required fields).
- **Apollo Client/GraphQL:** Manages the `addPoll` mutation with unified loading and completion handlers.

## 6. Iconography
- **BarChart3:** The primary symbol for Polls/Analytics.
- **Sparkles/Save:** Used for creation actions to evoke a sense of "publishing" rather than just data saving.
- **Eye:** Represents the Preview mode.
