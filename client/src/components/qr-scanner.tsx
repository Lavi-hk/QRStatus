import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onScanResult: (result: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScanResult, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startScanning = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      setStream(mediaStream);
      setIsScanning(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  // Simulate QR scanning for demo purposes
  const handleTestScan = () => {
    // For demo, we'll simulate scanning the first faculty member
    const baseUrl = window.location.origin;
    onScanResult(`${baseUrl}/faculty/sample-id`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">QR Code Scanner</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {!isScanning ? (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-12 h-12 text-primary" />
            </div>
            <p className="text-sm text-gray-600">
              Click below to start scanning QR codes
            </p>
            <div className="space-y-2">
              <Button onClick={startScanning} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestScan} 
                className="w-full"
              >
                Test with Sample QR
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-gray-100 rounded-lg object-cover"
              />
              <div className="absolute inset-0 border-2 border-primary rounded-lg"></div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Point your camera at a QR code to scan
            </p>
            <Button 
              variant="outline" 
              onClick={stopScanning} 
              className="w-full"
            >
              Stop Scanning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
