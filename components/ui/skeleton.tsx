// components/ui/skeleton.tsx — blocos de loading padronizados
import React from "react";

export interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton = ({ className = "", style }: SkeletonProps) => (
  <div aria-hidden className={`ui-skeleton ${className}`} style={style} />
);

/** Skeleton de card genérico (lista do admin, grids públicos). */
export const CardSkeleton = ({ lines = 2 }: { lines?: number }) => (
  <div className="ui-card p-4">
    <div className="flex gap-3 mb-3">
      <Skeleton className="w-10 h-10 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2 pt-1">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
    </div>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="h-2.5 w-full mb-2" />
    ))}
  </div>
);
