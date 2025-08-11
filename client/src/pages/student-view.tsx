import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Camera } from "lucide-react";
import { Link, useLocation } from "wouter";
import { QRScanner } from "@/components/qr-scanner";
import { FacultyCard } from "@/components/faculty-card";
import { Faculty } from "@shared/schema";
import { useWebSocket } from "@/hooks/use-websocket";

export default function StudentView() {
  const [showScanner, setShowScanner] = useState(false);
  const [, setLocation] = useLocation();
  
  // Connect to WebSocket for real-time updates
  useWebSocket();

  const { data: faculty, isLoading } = useQuery<Faculty[]>({
    queryKey: ["/api/faculty"],
  });

  const handleScanResult = (result: string) => {
    // Extract faculty ID from scanned URL
    const url = new URL(result);
    const pathParts = url.pathname.split('/');
    const facultyId = pathParts[pathParts.indexOf('faculty') + 1];
    
    if (facultyId) {
      setLocation(`/faculty/${facultyId}`);
    }
    setShowScanner(false);
  };

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
              <Button variant="secondary" size="sm">
                Student View
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* QR Scanner Section */}
        {!showScanner ? (
          <Card className="mb-8">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="text-white w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Scan Faculty QR Code</h2>
              <p className="text-gray-600 mb-6">
                Point your camera at a faculty member's QR code to check their availability
              </p>
              <Button onClick={() => setShowScanner(true)} className="mx-auto">
                <Camera className="w-4 h-4 mr-2" />
                Start QR Scanner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-8">
            <QRScanner
              onScanResult={handleScanResult}
              onClose={() => setShowScanner(false)}
            />
          </div>
        )}

        {/* Faculty Directory */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Faculty Status</h3>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading faculty directory...</p>
              </div>
            ) : faculty && faculty.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {faculty.map((member) => (
                  <Link key={member.id} href={`/faculty/${member.id}`}>
                    <div className="cursor-pointer">
                      <FacultyCard faculty={member} compact />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No faculty members found.</p>
              </div>
            )}
          </CardContent>
        </Card>
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
