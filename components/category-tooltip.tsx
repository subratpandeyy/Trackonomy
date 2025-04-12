import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CategoryTooltipProps {
  category: string;
  className?: string;
}

export const CategoryTooltip = ({ category, className }: CategoryTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("text-sm font-medium", className)}>
            {category}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{category}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};