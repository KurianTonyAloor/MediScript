import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, FileText, Share, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import InlineMedicationForm from "./inline-medication-form";
import { patientSchema, type Patient, type Medication, type DoctorProfile } from "@shared/schema";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { generatePDF } from "@/lib/pdf-generator";
import { generateQRCode } from "@/lib/qr-utils";
import { savePrescription } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function PrescriptionForm() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doctorProfile] = useLocalStorage<DoctorProfile | null>("doctorProfile", null);

  const { toast } = useToast();

  // Debug form state changes
  useEffect(() => {
    console.log("Component mounted/re-mounted");
  }, []);

  useEffect(() => {
    console.log("Medications changed:", medications);
  }, [medications]);

  const form = useForm<Patient>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      dob: "",
      gender: "male" as const,
      mobile: "",
      address: "",
      height: "",
      heightUnit: "cm" as const,
      weight: "",
      weightUnit: "kg" as const,
      chiefComplaint: "",
      diagnosis: "",
      notes: "",
      followupDate: "",
      followupTime: "",
    },
    mode: "onBlur", // Prevent unnecessary re-renders
  });

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return `${age} years`;
  };

  const handleMedicationsChange = (updatedMedications: Medication[]) => {
    console.log("BEFORE medications change - prescription form values:", form.getValues());
    setMedications(updatedMedications);
    setTimeout(() => {
      console.log("AFTER medications change - prescription form values:", form.getValues());
    }, 10);
  };

  const generatePrescription = async () => {
    if (!doctorProfile) {
      toast({
        title: "Doctor Profile Required",
        description: "Please complete your doctor profile before generating prescriptions.",
        variant: "destructive",
      });
      return;
    }

    const patientData = form.getValues();
    const isValid = await form.trigger();
    
    if (!isValid) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (medications.length === 0) {
      toast({
        title: "No Medications",
        description: "Please add at least one medication to the prescription.",
        variant: "destructive",
      });
      return;
    }

    try {
      const prescriptionId = `RX${Date.now()}`;
      const qrCode = await generateQRCode(prescriptionId);
      
      const prescription = {
        id: prescriptionId,
        patientData,
        medications,
        doctorData: doctorProfile,
        createdAt: new Date().toISOString(),
        qrCode,
      };

      // Save prescription to local storage
      savePrescription(prescription);

      // Generate PDF
      await generatePDF(prescription);

      toast({
        title: "Prescription Generated",
        description: "PDF has been generated and saved successfully.",
      });
    } catch (error) {
      console.error("Error generating prescription:", error);
      toast({
        title: "Generation Error",
        description: "Failed to generate prescription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearForm = () => {
    form.reset();
    setMedications([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Patient Information */}
      <div className="lg:col-span-2 space-y-6">
        <Form {...form}>
          <form className="space-y-6">
            {/* Patient Information Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Patient Information</CardTitle>
                  <Badge variant="secondary">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      {field.value && (
                        <p className="text-sm text-gray-500">Age: {calculateAge(field.value)}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter patient's address" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input placeholder="175" {...field} />
                        </FormControl>
                        <FormField
                          control={form.control}
                          name="heightUnit"
                          render={({ field: unitField }) => (
                            <Select onValueChange={unitField.onChange} defaultValue={unitField.value}>
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cm">cm</SelectItem>
                                <SelectItem value="ft">ft</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input placeholder="70" {...field} />
                        </FormControl>
                        <FormField
                          control={form.control}
                          name="weightUnit"
                          render={({ field: unitField }) => (
                            <Select onValueChange={unitField.onChange} defaultValue={unitField.value}>
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="lbs">lbs</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Medical Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Medical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="chiefComplaint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chief Complaint *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the main symptoms or reason for visit" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter diagnosis details" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinical Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional notes, observations, or instructions" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="followupDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Follow-up Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="followupTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Follow-up Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medications Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <InlineMedicationForm
                  medications={medications}
                  onMedicationsChange={handleMedicationsChange}
                />
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>

      {/* Right Column: Quick Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={generatePrescription} className="w-full bg-medical-blue hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
            <Button onClick={generatePrescription} className="w-full bg-success-green hover:bg-green-700">
              <Share className="w-4 h-4 mr-2" />
              Save & Share
            </Button>
            <Button onClick={clearForm} variant="outline" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Form
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
