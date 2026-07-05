// components/ui/field.tsx — Input, Textarea, Select e Toggle padronizados
import React, { useId } from "react";

interface FieldWrapperProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

const FieldWrapper = ({ id, label, required, hint, children }: FieldWrapperProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="ui-label" htmlFor={id}>
      {label}
      {required && (
        <span aria-hidden style={{ color: "var(--neon)" }}>
          {" "}*
        </span>
      )}
    </label>
    {children}
    {hint && (
      <p
        className="text-[10px] opacity-40"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {hint}
      </p>
    )}
  </div>
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export const Input = ({ label, required, hint, id, ...props }: InputProps) => {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <FieldWrapper hint={hint} id={fieldId} label={label} required={required}>
      <input className="ui-field" id={fieldId} required={required} {...props} />
    </FieldWrapper>
  );
};

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export const Textarea = ({
  label,
  required,
  hint,
  rows = 4,
  id,
  ...props
}: TextareaProps) => {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <FieldWrapper hint={hint} id={fieldId} label={label} required={required}>
      <textarea
        className="ui-field"
        id={fieldId}
        required={required}
        rows={rows}
        {...props}
      />
    </FieldWrapper>
  );
};

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
}

export const Select = ({
  label,
  required,
  hint,
  children,
  id,
  ...props
}: SelectProps) => {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <FieldWrapper hint={hint} id={fieldId} label={label} required={required}>
      <select className="ui-field" id={fieldId} required={required} {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
};

export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}

export const Toggle = ({ label, checked, onChange, description }: ToggleProps) => (
  <div className="flex items-center gap-3">
    <button
      aria-checked={checked}
      aria-label={label}
      className="relative w-10 h-5 rounded-sm transition-all cursor-pointer"
      role="switch"
      style={{
        background: checked ? "var(--neon)" : "var(--bg-card-alt)",
        border: `1px solid ${checked ? "var(--neon)" : "var(--border)"}`,
        boxShadow: checked ? "0 0 10px var(--neon-glow)" : "none",
      }}
      type="button"
      onClick={() => onChange(!checked)}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-sm transition-all"
        style={{
          left: checked ? "calc(100% - 18px)" : "2px",
          background: checked ? "var(--bg-primary)" : "var(--text-muted)",
        }}
      />
    </button>
    <div>
      <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
        {label}
      </p>
      {description && (
        <p
          className="text-[10px] opacity-40"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {description}
        </p>
      )}
    </div>
  </div>
);
