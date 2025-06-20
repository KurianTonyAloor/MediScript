import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Upload, PenTool, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { doctorProfileSchema, appSettingsSchema, type DoctorProfile, type AppSettings } from "@shared/schema";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

export default function DoctorProfile() {
  const [doctorProfile, setDoctorProfile] = useLocalStorage<DoctorProfile | null>("doctorProfile", null);
  const [appSettings, setAppSettings] = useLocalStorage<AppSettings>("appSettings", {
    autoSave: true,
    darkMode: false,
    includeQR: true,
  });
  const [isEditing, setIsEditing] = useState(!doctorProfile);
  const { toast } = useToast();

  const form = useForm<DoctorProfile>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: doctorProfile || {
      name: "",
      degree: "",
      registrationNumber: "",
      phone: "",
      hospital: "",
      address: "",
      signature: "",
    },
  });

  const handleSave = (data: DoctorProfile) => {
    setDoctorProfile(data);
    setIsEditing(false);
    toast({
      title: "Profile Saved",
      description: "Your doctor profile has been saved successfully.",
    });
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        form.setValue("signature", base64);
        toast({
          title: "Signature Uploaded",
          description: "Your signature has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    form.setValue("signature", "");
    toast({
      title: "Signature Cleared",
      description: "Your signature has been removed.",
    });
  };

  const updateSetting = (key: keyof AppSettings, value: boolean) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: `${key} has been ${value ? "enabled" : "disabled"}.`,
    });
  };

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear();
      setDoctorProfile(null);
      setAppSettings({
        autoSave: true,
        darkMode: false,
        includeQR: true,
      });
      form.reset();
      toast({
        title: "Data Cleared",
        description: "All application data has been cleared.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Profile */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Doctor Profile</CardTitle>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. John Smith" disabled={!isEditing} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree *</FormLabel>
                          <FormControl>
                            <Input placeholder="MBBS, MD" disabled={!isEditing} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="REG123456" disabled={!isEditing} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" disabled={!isEditing} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="hospital"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hospital/Clinic Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="City General Hospital" disabled={!isEditing} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Hospital address" rows={3} disabled={!isEditing} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-medical-blue hover:bg-blue-700">
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Signature & Settings */}
        <div className="space-y-6">
          {/* Digital Signature */}
          <Card>
            <CardHeader>
              <CardTitle>Digital Signature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {form.watch("signature") ? (
                  <div className="space-y-3">
                    <img 
                      src={form.watch("signature")} 
                      alt="Doctor Signature" 
                      className="max-h-20 mx-auto border rounded"
                    />
                    <Button variant="outline" size="sm" onClick={clearSignature}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-gray-100 h-20 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No signature uploaded</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="hidden"
                    id="signature-upload"
                  />
                  <label htmlFor="signature-upload">
                    <Button className="w-full bg-medical-blue hover:bg-blue-700" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Signature
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Recommended: PNG format, transparent background, 300x100px
              </p>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card>
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">Auto-save drafts</span>
                  <p className="text-xs text-gray-500">Automatically save form data</p>
                </div>
                <Switch
                  checked={appSettings.autoSave}
                  onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">Dark mode</span>
                  <p className="text-xs text-gray-500">Use dark theme</p>
                </div>
                <Switch
                  checked={appSettings.darkMode}
                  onCheckedChange={(checked) => updateSetting("darkMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">QR code on PDF</span>
                  <p className="text-xs text-gray-500">Include verification QR code</p>
                </div>
                <Switch
                  checked={appSettings.includeQR}
                  onCheckedChange={(checked) => updateSetting("includeQR", checked)}
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button variant="destructive" onClick={clearAllData} className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
