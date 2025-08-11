import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, RefreshCw, Mail, Phone, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";
import { FacultyCard } from "@/components/faculty-card";
import { Faculty } from "@shared/schema";
import { useWebSocket } from "@/hooks/use-websocket";
import { cn } from "@/lib/utils";

interface FacultyStatusProps {
  params: { id: string };
}

export default function FacultyStatus({ params }: FacultyStatusProps) {
  // Connect to WebSocket for real-time updates
  useWebSocket();

  const { data: faculty, isLoading, refetch } = useQuery<Faculty>({
    queryKey: ["/api/faculty", params.id],
  });

  const { data: allFaculty } = useQuery<Faculty[]>({
    queryKey: ["/api/faculty"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Loading faculty information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Faculty Not Found</h2>
            <p className="text-gray-600 mb-4">The requested faculty member could not be found.</p>
            <Link href="/student">
              <Button>Back to Student View</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = {
    available: {
      color: "status-available",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      label: "Available",
    },
    busy: {
      color: "status-busy",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "Busy",
    },
    away: {
      color: "status-away",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      label: "Away",
    },
  };

  const statusInfo = statusConfig[faculty.status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <QrCode className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">FacultyQRStatus</h1>
            </div>
            <nav className="flex space-x-1">
              <Link href="/faculty">
                <Button variant="ghost" size="sm">
                  Faculty Dashboard
                </Button>
              </Link>
              <Link href="/student">
                <Button variant="ghost" size="sm">
                  Student View
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Faculty Status Display */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Faculty Status</h3>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated: {new Date(faculty.lastUpdated).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Faculty Info */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {faculty.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{faculty.name}</h4>
                <p className="text-sm text-gray-600">{faculty.department}</p>
                <p className="text-sm text-gray-500">{faculty.office}</p>
              </div>
            </div>

            {/* Current Status */}
            <div className={cn(
              "border rounded-xl p-6 mb-6",
              statusInfo.bgColor,
              statusInfo.borderColor
            )}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", `bg-status-${faculty.status}`)}>
                  <span className="text-white text-sm">●</span>
                </div>
                <span className={cn("text-lg font-semibold", statusInfo.color)}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-sm text-gray-700">
                {faculty.customMessage || `Faculty member is currently ${faculty.status.toLowerCase()}`}
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{faculty.email}</p>
                </div>
              </div>
              {faculty.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{faculty.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Office Hours */}
            {faculty.officeHours && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium text-gray-900">Office Hours</span>
                </div>
                <p className="text-sm text-gray-700">{faculty.officeHours}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Other Faculty */}
        {allFaculty && allFaculty.length > 1 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Faculty</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allFaculty
                  .filter(f => f.id !== faculty.id)
                  .map((member) => (
                    <Link key={member.id} href={`/faculty/${member.id}`}>
                      <div className="cursor-pointer">
                        <FacultyCard faculty={member} compact />
                      </div>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2024 FacultyQRStatus. Streamlining campus communication.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
