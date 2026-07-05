// components/ui/card.tsx
import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export const Card = ({ children, className = "", hoverable, style }: CardProps) => (
  <div
    className={`ui-card ${hoverable ? "ui-card-hover" : ""} ${className}`}
    style={style}
  >
    {children}
  </div>
);
