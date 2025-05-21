
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

const ProgressBar = ({ currentStep, totalSteps, className }: ProgressBarProps) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full mb-6", className)}>
      <div className="flex justify-between mb-1 text-xs text-muted-foreground">
        <span>Setup Progress</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-smart-primary transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
