import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { QrCode, Download, Printer, Clock, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";
import { StatusCard } from "@/components/status-card";
import { Faculty, UpdateFacultyStatus } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { generateQRCode, downloadQRCode, printQRCode } from "@/lib/qr-utils";

export default function FacultyDashboard() {
  const [selectedStatus, setSelectedStatus] = useState<"available" | "busy" | "away">("available");
  const [customMessage, setCustomMessage] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const { toast } = useToast();
  
  // Connect to WebSocket for real-time updates
  useWebSocket();

  // For demo purposes, we'll use the first faculty member
  const { data: faculty } = useQuery<Faculty[]>({
    queryKey: ["/api/faculty"],
  });

  const currentFaculty = faculty?.[0];

  // Get QR code data
  const { data: qrData } = useQuery({
    queryKey: ["/api/faculty", currentFaculty?.id, "qr-data"],
    enabled: !!currentFaculty,
  });

  // Generate QR code image when data is available
  useEffect(() => {
    if (qrData && typeof qrData === 'object' && 'qrData' in qrData && qrData.qrData) {
      generateQRCode(qrData.qrData as string)
        .then(setQrCodeDataUrl)
        .catch(console.error);
    }
  }, [qrData]);

  const updateStatusMutation = useMutation({
    mutationFn: async (statusUpdate: UpdateFacultyStatus) => {
      if (!currentFaculty) throw new Error("No faculty selected");
      return apiRequest("PATCH", `/api/faculty/${currentFaculty.id}/status`, statusUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faculty"] });
      toast({
        title: "Status Updated",
        description: "Your availability status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = () => {
    updateStatusMutation.mutate({
      status: selectedStatus,
      customMessage: customMessage.trim() || undefined,
    });
  };

  const handleDownloadQR = () => {
    if (qrCodeDataUrl) {
      downloadQRCode(qrCodeDataUrl, `faculty-qr-${currentFaculty?.name.replace(/\s+/g, '-')}.png`);
    }
  };

  const handlePrintQR = () => {
    if (qrCodeDataUrl) {
      printQRCode(qrCodeDataUrl);
    }
  };

  if (!currentFaculty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Loading faculty data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Button variant="secondary" size="sm">
                Faculty Dashboard
              </Button>
              <Link href="/student">
                <Button variant="ghost" size="sm">
                  Student View
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Update Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Update Your Status</h2>
                <p className="text-sm text-gray-600">Let students know your current availability</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>
                  Last updated: {new Date(currentFaculty.lastUpdated).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
            
            {/* Status Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatusCard
                status="available"
                isSelected={selectedStatus === "available"}
                onSelect={() => setSelectedStatus("available")}
              />
              <StatusCard
                status="busy"
                isSelected={selectedStatus === "busy"}
                onSelect={() => setSelectedStatus("busy")}
              />
              <StatusCard
                status="away"
                isSelected={selectedStatus === "away"}
                onSelect={() => setSelectedStatus("away")}
              />
            </div>

            {/* Custom Message */}
            <div className="mb-6">
              <Label htmlFor="customMessage" className="text-sm font-medium text-gray-700 mb-2">
                Custom Message (Optional)
              </Label>
              <Textarea
                id="customMessage"
                rows={3}
                className="resize-none"
                placeholder="Back at 3:00 PM, In meeting until 4:30 PM, etc."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleStatusUpdate}
              disabled={updateStatusMutation.isPending}
              className="w-full md:w-auto"
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </CardContent>
        </Card>

        {/* Faculty Profile & QR Code */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Faculty Profile */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {currentFaculty.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{currentFaculty.name}</h3>
                  <p className="text-sm text-gray-600">{currentFaculty.department}</p>
                  <p className="text-sm text-gray-500">{currentFaculty.office}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 bg-status-${currentFaculty.status} rounded-full`} />
                  <span className={`text-sm font-medium status-${currentFaculty.status} capitalize`}>
                    {currentFaculty.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{currentFaculty.email}</span>
                </div>
                {currentFaculty.phone && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{currentFaculty.phone}</span>
                  </div>
                )}
                {currentFaculty.officeHours && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{currentFaculty.officeHours}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{currentFaculty.office}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your QR Code</h3>
              <div className="mb-6">
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Faculty QR Code" 
                    className="w-48 h-48 mx-auto border-2 border-gray-200 rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Generating QR Code...</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Students can scan this QR code to check your real-time availability
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={handleDownloadQR}
                  disabled={!qrCodeDataUrl}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrintQR}
                  disabled={!qrCodeDataUrl}
                  className="flex-1"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
