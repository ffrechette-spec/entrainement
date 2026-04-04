interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
  error?: string;
}

export default function Input({
  label,
  unit,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground/70"
        >
          {label}
        </label>
      ) : null}
      <div className="relative flex items-center">
        <input
          id={inputId}
          inputMode="decimal"
          className={[
            "w-full rounded-xl border border-accent/20 bg-white px-4 py-3",
            "text-base text-foreground placeholder:text-foreground/40",
            "min-h-[44px]",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
            error ? "border-red-500 focus:ring-red-500" : "",
            unit ? "pr-10" : "",
            className,
          ].join(" ")}
          {...props}
        />
        {unit ? (
          <span className="pointer-events-none absolute right-3 text-sm text-foreground/50">
            {unit}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : null}
    </div>
  );
}
