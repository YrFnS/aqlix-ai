"use client";

import { useCallback } from "react";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

/**
 * Toast notification hook
 *
 * Provides a simple toast notification system for displaying temporary messages to users.
 * Useful for success messages, error alerts, and informational notifications.
 *
 * @example
 * const { toast } = useToast();
 *
 * const handleClick = () => {
 *   toast({
 *     title: "Success",
 *     description: "Operation completed successfully",
 *     variant: "default",
 *   });
 * };
 */
export function useToast() {
  const toast = useCallback((props: ToastProps) => {
    // Default duration: 5 seconds
    const duration = props.duration || 5000;

    // Create a simple toast notification
    // This is a basic implementation using browser APIs
    // In production, you may want to use a toast library like react-hot-toast or sonner

    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.style.position = "fixed";
      toastContainer.style.top = "0";
      toastContainer.style.right = "0";
      toastContainer.style.zIndex = "9999";
      toastContainer.style.padding = "1rem";
      toastContainer.style.pointerEvents = "none";
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastElement = document.createElement("div");
    toastElement.className =
      "toast-notification animate-in slide-in-from-top-2 fade-in";
    toastElement.style.marginBottom = "0.5rem";
    toastElement.style.pointerEvents = "auto";
    toastElement.style.minWidth = "300px";
    toastElement.style.padding = "1rem";
    toastElement.style.borderRadius = "0.5rem";
    toastElement.style.boxShadow =
      "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)";
    toastElement.style.backgroundColor =
      props.variant === "destructive" ? "#fee2e2" : "#f3f4f6";
    toastElement.style.borderLeft =
      props.variant === "destructive"
        ? "4px solid #dc2626"
        : "4px solid #3b82f6";
    toastElement.style.color =
      props.variant === "destructive" ? "#991b1b" : "#111827";
    toastElement.style.fontFamily = "system-ui, -apple-system, sans-serif";

    // Create title element
    if (props.title) {
      const titleElement = document.createElement("div");
      titleElement.className = "font-semibold";
      titleElement.style.fontWeight = "600";
      titleElement.style.marginBottom = props.description ? "0.25rem" : "0";
      titleElement.textContent = props.title;
      toastElement.appendChild(titleElement);
    }

    // Create description element
    if (props.description) {
      const descriptionElement = document.createElement("div");
      descriptionElement.className = "text-sm opacity-90";
      descriptionElement.style.fontSize = "0.875rem";
      descriptionElement.style.opacity = "0.9";
      descriptionElement.textContent = props.description;
      toastElement.appendChild(descriptionElement);
    }

    // Add toast to container
    toastContainer.appendChild(toastElement);

    // Remove toast after duration
    const timeoutId = setTimeout(() => {
      toastElement.style.animation = "fade-out 0.3s ease-in-out forwards";
      setTimeout(() => {
        toastElement.remove();
      }, 300);
    }, duration);

    // Return function to manually dismiss toast
    return () => {
      clearTimeout(timeoutId);
      toastElement.remove();
    };
  }, []);

  return { toast };
}
