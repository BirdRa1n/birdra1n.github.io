// components/ui/LoadingSpinner.tsx
interface Props {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 32, className = "" }: Props) {
  return (
    <div
      className={`border-2 border-t-transparent rounded-full animate-spin ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: "var(--neon)",
        borderTopColor: "transparent",
      }}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>
  );
}
