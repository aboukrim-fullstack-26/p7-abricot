"use client";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

/* ── Input ──────────────────────────────────────────── */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

/**
 * Input — champ texte stylé avec label, état d'erreur et required.
 *
 * Forwardref pour permettre le focus programmatique.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, required, id, className = "", ...rest },
  ref
) {
  return (
    <div className="form-group">
      {label && (
        <label
          className={`form-label${required ? " form-label--required" : ""}`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`form-input${error ? " form-input--error" : ""} ${className}`.trim()}
        aria-invalid={!!error}
        aria-required={required}
        {...rest}
      />
      {error && (
        <p role="alert" style={{ fontSize: 12, color: "#E5484D", marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
});

/* ── Textarea ───────────────────────────────────────── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

/**
 * Textarea — zone de texte multi-lignes avec les mêmes props que Input.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, required, id, className = "", ...rest },
  ref
) {
  return (
    <div className="form-group">
      {label && (
        <label
          className={`form-label${required ? " form-label--required" : ""}`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        className={`form-input form-input--textarea${error ? " form-input--error" : ""} ${className}`.trim()}
        aria-invalid={!!error}
        aria-required={required}
        {...rest}
      />
      {error && (
        <p role="alert" style={{ fontSize: 12, color: "#E5484D", marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
});
