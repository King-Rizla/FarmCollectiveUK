import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type PlantStage = "sprout" | "growing" | "flower";

interface PlantBadgeProps {
  salesCount: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Get plant stage based on sales count
 * 🌱 Sprout: < 10 sales (New)
 * 🌿 Growing: 10-49 sales (Established)
 * 🌻 Flower: 50+ sales (Trusted)
 */
export const getPlantStage = (salesCount: number): PlantStage => {
  if (salesCount >= 50) return "flower";
  if (salesCount >= 10) return "growing";
  return "sprout";
};

const PLANT_CONFIG: Record<
  PlantStage,
  { emoji: string; label: string; color: string }
> = {
  sprout: {
    emoji: "🌱",
    label: "New Grower",
    color: "text-green-400",
  },
  growing: {
    emoji: "🌿",
    label: "Established",
    color: "text-green-500",
  },
  flower: {
    emoji: "🌻",
    label: "Trusted",
    color: "text-yellow-500",
  },
};

const SIZE_CLASSES = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export function PlantBadge({
  salesCount,
  className,
  showLabel = false,
  size = "md",
}: PlantBadgeProps) {
  const stage = getPlantStage(salesCount);
  const config = PLANT_CONFIG[stage];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 cursor-default",
              SIZE_CLASSES[size],
              className
            )}
          >
            <span role="img" aria-label={config.label}>
              {config.emoji}
            </span>
            {showLabel && (
              <span className={cn("text-sm font-medium", config.color)}>
                {config.label}
              </span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{config.label}</p>
          <p className="text-xs opacity-80">
            {salesCount} completed {salesCount === 1 ? "sale" : "sales"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { PlantBadge as default };
