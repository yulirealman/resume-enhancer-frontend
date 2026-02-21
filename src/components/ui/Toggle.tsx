import * as React from "react";
import { cn } from "@/src/lib/utils";

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className="flex items-center justify-between space-x-4 cursor-pointer">
        <div className="flex flex-col space-y-0.5">
          <span className="text-sm font-medium leading-none">{label}</span>
          {description && <span className="text-xs text-zinc-500">{description}</span>}
        </div>
        <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <input
            type="checkbox"
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
        </div>
      </label>
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle };
