import { useState, useRef } from "react";
import { Camera, Shield, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { verifyQRCode, startQRScanner, stopQRScanner } from "@/lib/qr-utils";
import { useToast } from "@/hooks/use-toast";
import type { Prescription } from "@shared/schema";

export default function QRVerification() {
  const [prescriptions] = useLocalStorage<Prescription[]>("prescriptions", []);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifiedPrescription, setVerifiedPrescription] = useState<Prescription | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleManualVerification = () => {
    if (!verificationCode.trim()) {
      setError("Please enter a verification code");
      return;
    }

    const prescription = prescriptions.find(p => p.id === verificationCode.trim());
    
    if (prescription) {
      setVerifiedPrescription(prescription);
      setError("");
      toast({
        title: "Prescription Verified",
        description: "The prescription is authentic and valid.",
      });
    } else {
      setError("Invalid verification code. Prescription not found.");
      setVerifiedPrescription(null);
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setError("");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Start QR code scanning
        const onDetected = (result: string) => {
          const prescription = prescriptions.find(p => p.id === result);
          if (prescription) {
            setVerifiedPrescription(prescription);
            setError("");
            stopCamera();
            toast({
              title: "QR Code Scanned",
              description: "Prescription verified successfully.",
            });
          } else {
            setError("Invalid QR code. Prescription not found.");
          }
        };

        startQRScanner(videoRef.current, onDetected);
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setError("Unable to access camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    stopQRScanner();
    setIsScanning(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-medical-blue" />
          </div>
          <CardTitle className="text-2xl">Verify Prescription</CardTitle>
          <p className="text-gray-600">
            Scan QR code or enter verification code to authenticate prescription
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Camera Scanner */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {isScanning ? (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg border"
                />
                <Button onClick={stopCamera} variant="outline">
                  Stop Camera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                <p className="text-gray-600">Position QR code within camera view</p>
                <Button onClick={startCamera} className="bg-medical-blue hover:bg-blue-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Open Camera
                </Button>
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter Verification Code
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="RX001234"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="font-mono"
                onKeyPress={(e) => e.key === 'Enter' && handleManualVerification()}
              />
              <Button 
                onClick={handleManualVerification} 
                className="bg-success-green hover:bg-green-700"
              >
                Verify
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Verification Result */}
          {verifiedPrescription && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-green-900">
                    Prescription Verified ✓
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                    <div>
                      <span className="font-medium">Patient:</span>{" "}
                      {verifiedPrescription.patientData.name}
                    </div>
                    <div>
                      <span className="font-medium">Doctor:</span>{" "}
                      {verifiedPrescription.doctorData.name}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(verifiedPrescription.createdAt)}
                    </div>
                    <div>
                      <span className="font-medium">Diagnosis:</span>{" "}
                      {verifiedPrescription.patientData.diagnosis}
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="font-medium">Medications:</span>
                    <ul className="mt-2 space-y-1">
                      {verifiedPrescription.medications.map((med, index) => (
                        <li key={med.id} className="text-sm">
                          {index + 1}. {med.name} {med.strength} - {med.dose} - {med.frequency}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
