"use client";

import { useEffect, useState, type ReactNode } from "react";

export function ClientReadyBoundary({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div
      className="contents"
      data-client-surface={name}
      data-client-ready={ready ? "true" : "false"}
    >
      {children}
    </div>
  );
}
