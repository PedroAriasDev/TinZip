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
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative`}>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-lg"
          >
            ×
          </button>
        )}
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="mb-4 text-gray-700">{description}</p>
        {children}
      </div>
    </div>
  );
}
