import type { Draft, DraftKind } from "@iraqi-ai/types";

export interface DraftEditorValue {
  title: string;
  content: string;
  direction: "auto" | "rtl" | "ltr";
  kind: DraftKind;
}

export function draftEditorValue(draft: Draft): DraftEditorValue {
  return {
    title: draft.title,
    content: draft.content,
    direction: draft.direction,
    kind: draft.kind,
  };
}

export function isDraftEditorDirty(
  accepted: Draft,
  editor: DraftEditorValue,
): boolean {
  return (
    accepted.title !== editor.title ||
    accepted.content !== editor.content ||
    accepted.direction !== editor.direction ||
    accepted.kind !== editor.kind
  );
}
