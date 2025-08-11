import { Faculty } from "@shared/schema";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FacultyCardProps {
  faculty: Faculty;
  showStatus?: boolean;
  compact?: boolean;
}

const statusConfig = {
  available: { color: "status-available", label: "Available" },
  busy: { color: "status-busy", label: "Busy" },
  away: { color: "status-away", label: "Away" },
};

export function FacultyCard({ faculty, showStatus = true, compact = false }: FacultyCardProps) {
  const statusInfo = statusConfig[faculty.status as keyof typeof statusConfig];

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {faculty.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">{faculty.name}</h4>
              <p className="text-xs text-gray-500">{faculty.department.replace(' Department', '')}</p>
            </div>
            {showStatus && (
              <div className={cn("w-3 h-3 rounded-full", `bg-status-${faculty.status}`)} />
            )}
          </div>
          {showStatus && (
            <div className="flex items-center justify-between text-sm">
              <span className={cn("font-medium", statusInfo.color)}>{statusInfo.label}</span>
              <span className="text-gray-500">
                {new Date(faculty.lastUpdated).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-lg font-medium text-gray-600">
              {faculty.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{faculty.name}</h3>
            <p className="text-sm text-gray-600">{faculty.department}</p>
            <p className="text-sm text-gray-500">{faculty.office}</p>
          </div>
          {showStatus && (
            <div className="flex items-center space-x-2">
              <div className={cn("w-3 h-3 rounded-full", `bg-status-${faculty.status}`)} />
              <span className={cn("text-sm font-medium", statusInfo.color)}>
                {statusInfo.label}
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{faculty.email}</span>
          </div>
          {faculty.phone && (
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{faculty.phone}</span>
            </div>
          )}
          {faculty.officeHours && (
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{faculty.officeHours}</span>
            </div>
          )}
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{faculty.office}</span>
          </div>
        </div>

        {showStatus && faculty.customMessage && (
          <div className={cn(
            "mt-6 p-4 rounded-xl border",
            faculty.status === "available" && "bg-green-50 border-green-200",
            faculty.status === "busy" && "bg-red-50 border-red-200",
            faculty.status === "away" && "bg-orange-50 border-orange-200"
          )}>
            <p className="text-sm text-gray-700">{faculty.customMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
