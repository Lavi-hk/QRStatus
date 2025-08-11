import { Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  status: "available" | "busy" | "away";
  message?: string;
  onSelect?: () => void;
  isSelected?: boolean;
  className?: string;
}

const statusConfig = {
  available: {
    label: "Available",
    description: "Ready for student visits",
    icon: Check,
    colorClass: "status-available",
    bgClass: "bg-green-50",
    borderClass: "border-status-available",
    hoverClass: "hover:bg-green-100",
  },
  busy: {
    label: "Busy",
    description: "In meeting or class",
    icon: X,
    colorClass: "status-busy",
    bgClass: "bg-red-50",
    borderClass: "border-status-busy",
    hoverClass: "hover:bg-red-100",
  },
  away: {
    label: "Away",
    description: "Out of office temporarily",
    icon: Clock,
    colorClass: "status-away",
    bgClass: "bg-orange-50",
    borderClass: "border-status-away",
    hoverClass: "hover:bg-orange-100",
  },
};

export function StatusCard({ status, message, onSelect, isSelected, className }: StatusCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "p-4 border-2 rounded-xl transition-colors group text-left w-full",
        isSelected
          ? `${config.borderClass} ${config.bgClass}`
          : `border-gray-200 ${config.hoverClass}`,
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", `bg-status-${status}`)}>
          <Icon className="text-white w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{config.label}</h3>
          <p className="text-sm text-gray-600">
            {message || config.description}
          </p>
        </div>
      </div>
    </button>
  );
}
