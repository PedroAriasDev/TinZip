"use client";

import React from "react";

interface ErrorModalProps {
  fullScreen?: boolean;
  title: string;
  description: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

export function ErrorModal({ fullScreen, title, description, children, onClose }: ErrorModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        fullScreen ? "p-4" : ""
      }`}
    >
      <div className={`bg-card rounded-xl border border-border shadow-lg w-full max-w-lg p-6 relative`}>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground font-bold text-lg"
          >
            ×
          </button>
        )}
        <h2 className="text-2xl font-bold mb-2 text-foreground">{title}</h2>
        <p className="mb-4 text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  );
}
