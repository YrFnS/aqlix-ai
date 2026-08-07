# Product Brief

**Date:** 2026-08-07  
**Working name:** Kiteb  
**Stage:** Product reset

## Product thesis

Professionals who work across Arabic and English often lose time moving between chats, files, notes, and unfinished drafts. General AI chat tools can answer questions, but they do not reliably preserve the working context, sources, language direction, and reusable output needed for day-to-day professional work.

Kiteb will provide one calm workspace where a user can bring a question and supporting documents, understand the result, verify where it came from, and turn it into finished work.

## Primary user

The first target user is an Arabic-speaking professional or small team in Iraq or the wider MENA region who:

- works with Arabic, English, or mixed-language documents;
- repeatedly summarizes, compares, explains, translates, or drafts from source material;
- needs persistent work rather than disposable chat sessions;
- values a product designed correctly for RTL and bidirectional content.

The first release is not segmented by profession. Legal, medical, education, government, and other specialist modes require separate evidence, safeguards, and product validation before they are introduced.

## Core problem

The user has context scattered across messages and documents, but needs a clear output they can trust and reuse.

## Product promise

> Bring the context. Understand it. Turn it into work.

Arabic positioning:

> اجمع السياق، افهمه، وحوّله إلى عمل واضح.

## Core product loop

### 1. Ask

Start with a question, instruction, or task in Arabic or English.

### 2. Ground

Attach or select relevant documents. The system clearly distinguishes sourced statements from general model output.

### 3. Draft

Turn the result into a summary, comparison, email, memo, checklist, decision note, or another reusable artifact.

### 4. Continue

Save the conversation, sources, and outputs in a persistent workspace and return to them later.

## MVP scope

The first complete release contains:

- account access and a lightweight first-run experience;
- a responsive Arabic-first application shell;
- bilingual chat with correct RTL, LTR, and mixed-text behavior;
- streamed AI responses with explicit failure and retry states;
- document upload, extraction, status, and deletion;
- source-aware responses with inspectable citations or passages;
- persistent workspaces, conversations, messages, and attachments;
- basic output actions: copy, rename, save, export, and continue editing;
- model, language, privacy, and data-retention settings;
- observable usage, latency, errors, and provider cost for operators.

## Explicit non-goals for the MVP

The first release will not include:

- a 21-agent product surface;
- autonomous multi-agent workflows;
- payment gateway integrations;
- desktop or browser automation;
- voice calling or real-time voice interaction;
- a no-code workflow builder;
- mobile applications;
- specialist legal, medical, financial, or religious advice modes;
- claims of Iraqi dialect accuracy, cultural compliance, security compliance, or production readiness without measured evidence.

## Product principles

### Sources before spectacle

The product should make context, citations, uncertainty, and output state easier to understand than visual effects or agent terminology.

### Arabic is structural

Arabic support is not a translated skin. Navigation, editing, mixed text, typography, keyboard flow, file names, dates, and generated outputs must work naturally in Arabic and English.

### One workspace, not many disconnected demos

Chat, documents, drafts, and history belong to one coherent flow.

### Honest states

Prototype, unavailable, processing, failed, unsourced, and verified states must be visible. Placeholder data must never look live.

### Progressive capability

A feature enters the roadmap only when it strengthens the core loop and can be validated end to end.

## Success criteria for the first release

The release is successful when a new user can, without assistance:

1. create or enter a workspace;
2. upload an Arabic or English document;
3. ask a question about it;
4. inspect the supporting source;
5. create and save a useful draft;
6. close the application, return, and continue the same work.

Engineering acceptance requires that this journey is covered by repeatable integration and end-to-end tests.

## Initial product measurements

Measurements begin only after the vertical slice is real. The initial operating dashboard should track:

- successful completion of the core journey;
- response and document-processing failure rates;
- time to first useful result;
- source-opening and citation-use behavior;
- return to an existing workspace;
- model and infrastructure cost per completed task.

No target percentages are declared before baseline data exists.
