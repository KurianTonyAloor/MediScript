import { useState } from "react";
import { FileText, History, Shield, User, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrescriptionForm from "@/components/prescription-form";
import DoctorProfile from "@/components/doctor-profile";
import PrescriptionHistory from "@/components/prescription-history";
import QRVerification from "@/components/qr-verification";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { DoctorProfile as DoctorProfileType } from "@shared/schema";

export default function Home() {
  const [doctorProfile] = useLocalStorage<DoctorProfileType | null>("doctorProfile", null);
  const [activeTab, setActiveTab] = useState("new-prescription");

  const getInitials = (name: string | undefined) => {
    if (!name) return "DR";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'hsl(210, 40%, 98%)'}}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-medical-blue p-2 rounded-lg">
                <FileText className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MedScript</h1>
                <p className="text-sm text-gray-500">Digital Prescription Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
              <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {getInitials(doctorProfile?.name)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg border border-gray-200">
            <TabsTrigger 
              value="new-prescription" 
              className="flex items-center space-x-2 data-[state=active]:bg-medical-blue data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">New Prescription</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="flex items-center space-x-2 data-[state=active]:bg-medical-blue data-[state=active]:text-white"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger 
              value="verify"
              className="flex items-center space-x-2 data-[state=active]:bg-medical-blue data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Verify</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="flex items-center space-x-2 data-[state=active]:bg-medical-blue data-[state=active]:text-white"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="new-prescription" className="mt-0">
              <PrescriptionForm />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <PrescriptionHistory />
            </TabsContent>

            <TabsContent value="verify" className="mt-0">
              <QRVerification />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <DoctorProfile />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
