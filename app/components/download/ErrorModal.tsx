import React from "react";

type ErrorModalProps = {
  errorMessage: string;
  onClose: () => void;
};

export function ErrorModal({ errorMessage, onClose }: ErrorModalProps) {
  if (!errorMessage) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      aria-labelledby="error-modal-title"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="bg-card rounded-xl border-2 border-destructive shadow-lg p-6 sm:p-8 max-w-sm w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-destructive"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 id="error-modal-title" className="text-2xl font-bold text-foreground mb-2">
          Error
        </h1>

        <p className="text-muted-foreground mb-6">{errorMessage}</p>

        <button
          onClick={onClose}
          autoFocus
          className="w-full h-11 flex items-center justify-center px-4 text-base font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}