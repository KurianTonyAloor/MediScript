import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type Medication } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface SimpleMedicationFormProps {
  medication?: Medication | null;
  onSave: (medication: Medication) => void;
  onCancel: () => void;
  isOpen?: boolean;
}

export default function SimpleMedicationForm({ medication, onSave, onCancel, isOpen = true }: SimpleMedicationFormProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: medication?.name || "",
    strength: medication?.strength || "",
    dose: medication?.dose || "",
    route: medication?.route || "",
    frequency: medication?.frequency || "",
    duration: medication?.duration || "",
    quantity: medication?.quantity || "",
    instructions: medication?.instructions || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Drug name is required";
    if (!formData.strength.trim()) newErrors.strength = "Strength is required";
    if (!formData.dose.trim()) newErrors.dose = "Dose is required";
    if (!formData.route.trim()) newErrors.route = "Route is required";
    if (!formData.frequency.trim()) newErrors.frequency = "Frequency is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const medicationData: Medication = {
        ...formData,
        id: medication?.id || `med_${Date.now()}`,
      };
      
      onSave(medicationData);
      toast({
        title: "Success",
        description: "Medication saved successfully",
      });
    } catch (error) {
      console.error("Error saving medication:", error);
      toast({
        title: "Error",
        description: "Failed to save medication",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {medication ? "Edit Medication" : "Add Medication"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Drug Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Paracetamol"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="strength">Strength *</Label>
              <Input
                id="strength"
                value={formData.strength}
                onChange={(e) => handleChange("strength", e.target.value)}
                placeholder="e.g., 500mg"
                className={errors.strength ? "border-red-500" : ""}
              />
              {errors.strength && <p className="text-red-500 text-sm mt-1">{errors.strength}</p>}
            </div>

            <div>
              <Label htmlFor="dose">Dose *</Label>
              <Input
                id="dose"
                value={formData.dose}
                onChange={(e) => handleChange("dose", e.target.value)}
                placeholder="e.g., 1 tablet"
                className={errors.dose ? "border-red-500" : ""}
              />
              {errors.dose && <p className="text-red-500 text-sm mt-1">{errors.dose}</p>}
            </div>

            <div>
              <Label htmlFor="route">Route *</Label>
              <select
                id="route"
                value={formData.route}
                onChange={(e) => handleChange("route", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.route ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Route</option>
                <option value="oral">Oral</option>
                <option value="topical">Topical</option>
                <option value="injection">Injection</option>
                <option value="inhaled">Inhaled</option>
                <option value="sublingual">Sublingual</option>
              </select>
              {errors.route && <p className="text-red-500 text-sm mt-1">{errors.route}</p>}
            </div>

            <div>
              <Label htmlFor="frequency">Frequency *</Label>
              <select
                id="frequency"
                value={formData.frequency}
                onChange={(e) => handleChange("frequency", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.frequency ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Frequency</option>
                <option value="once-daily">Once daily</option>
                <option value="twice-daily">Twice daily</option>
                <option value="3-times-daily">3 times daily</option>
                <option value="4-times-daily">4 times daily</option>
                <option value="as-needed">As needed</option>
              </select>
              {errors.frequency && <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>}
            </div>

            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="e.g., 5 days"
                className={errors.duration ? "border-red-500" : ""}
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                placeholder="e.g., 15 tablets"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => handleChange("instructions", e.target.value)}
                placeholder="e.g., Take after meals, avoid alcohol"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-medical-blue hover:bg-blue-700">
              {medication ? "Update Medication" : "Add Medication"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}