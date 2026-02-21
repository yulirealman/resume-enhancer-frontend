import * as React from "react";
import { cn } from "@/src/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
            <span className="text-xs text-zinc-500 font-mono">{props.value}%</span>
          </div>
        )}
        <input
          type="range"
          ref={ref}
          className={cn(
            "w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-zinc-900",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
