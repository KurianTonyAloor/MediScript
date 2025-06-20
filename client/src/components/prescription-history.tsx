import { useState } from "react";
import { Search, Download, Eye, Copy, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { generatePDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";
import type { Prescription } from "@shared/schema";

export default function PrescriptionHistory() {
  const [prescriptions] = useLocalStorage<Prescription[]>("prescriptions", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const { toast } = useToast();

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.patientData.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (dateFilter === "today") {
      const today = new Date().toDateString();
      return new Date(prescription.createdAt).toDateString() === today;
    } else if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(prescription.createdAt) >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(prescription.createdAt) >= monthAgo;
    }

    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadPDF = async (prescription: Prescription) => {
    try {
      await generatePDF(prescription);
      toast({
        title: "PDF Downloaded",
        description: `Prescription for ${prescription.patientData.name} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to download prescription PDF.",
        variant: "destructive",
      });
    }
  };

  const copyPrescriptionId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "ID Copied",
      description: "Prescription ID has been copied to clipboard.",
    });
  };

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions Yet</h3>
          <p className="text-gray-500">
            You haven't created any prescriptions yet. Create your first prescription to see it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Prescription History</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-gray-200">
        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg">No prescriptions found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="py-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {prescription.patientData.name}
                    </h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(prescription.createdAt)}
                    </div>
                    <div>
                      <span className="font-medium">Diagnosis:</span>{" "}
                      {prescription.patientData.diagnosis}
                    </div>
                    <div>
                      <span className="font-medium">Medications:</span>{" "}
                      {prescription.medications.length} items
                    </div>
                    <div>
                      <span className="font-medium">ID:</span>{" "}
                      <button
                        onClick={() => copyPrescriptionId(prescription.id)}
                        className="font-mono text-blue-600 hover:underline"
                      >
                        {prescription.id}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" title="View Details">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => downloadPDF(prescription)}
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
