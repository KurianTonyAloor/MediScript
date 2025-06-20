import { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { type Medication } from "@shared/schema";

interface InlineMedicationFormProps {
  medications: Medication[];
  onMedicationsChange: (medications: Medication[]) => void;
}

export default function InlineMedicationForm({ medications, onMedicationsChange }: InlineMedicationFormProps) {
  const [currentMedication, setCurrentMedication] = useState({
    name: "",
    strength: "",
    dose: "",
    route: "",
    frequency: "",
    duration: "",
    quantity: "",
    instructions: "",
  });

  const { toast } = useToast();

  const updateCurrentMedication = (field: string, value: string) => {
    setCurrentMedication(prev => ({ ...prev, [field]: value }));
  };

  const addCurrentMedication = () => {
    // Validate required fields
    if (!currentMedication.name || !currentMedication.strength || !currentMedication.dose || 
        !currentMedication.route || !currentMedication.frequency || !currentMedication.duration) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required medication fields",
        variant: "destructive",
      });
      return;
    }

    const newMedication: Medication = {
      ...currentMedication,
      id: `med_${Date.now()}`,
    };
    
    const updatedMedications = [...medications, newMedication];
    onMedicationsChange(updatedMedications);
    
    // Clear current medication form
    setCurrentMedication({
      name: "",
      strength: "",
      dose: "",
      route: "",
      frequency: "",
      duration: "",
      quantity: "",
      instructions: "",
    });
    
    toast({
      title: "Success",
      description: "Medication added successfully",
    });
  };

  const deleteMedication = (id: string) => {
    const updatedMedications = medications.filter(med => med.id !== id);
    onMedicationsChange(updatedMedications);
  };

  return (
    <div className="space-y-6">
      {/* Add New Medication Form */}
      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
        <h3 className="font-medium text-gray-900 mb-4">Add New Medication</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="med-name">Drug Name *</Label>
            <Input
              id="med-name"
              value={currentMedication.name}
              onChange={(e) => updateCurrentMedication("name", e.target.value)}
              placeholder="Enter drug name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="med-strength">Strength *</Label>
            <Input
              id="med-strength"
              value={currentMedication.strength}
              onChange={(e) => updateCurrentMedication("strength", e.target.value)}
              placeholder="e.g., 500mg"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="med-dose">Dose *</Label>
            <Input
              id="med-dose"
              value={currentMedication.dose}
              onChange={(e) => updateCurrentMedication("dose", e.target.value)}
              placeholder="e.g., 1 tablet"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="med-route">Route *</Label>
            <select
              id="med-route"
              value={currentMedication.route}
              onChange={(e) => updateCurrentMedication("route", e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select route</option>
              <option value="Oral">Oral</option>
              <option value="IV">IV</option>
              <option value="IM">IM</option>
              <option value="SC">SC</option>
              <option value="Topical">Topical</option>
              <option value="Inhaled">Inhaled</option>
              <option value="Rectal">Rectal</option>
              <option value="Nasal">Nasal</option>
              <option value="Ophthalmic">Ophthalmic</option>
              <option value="Otic">Otic</option>
            </select>
          </div>
          <div>
            <Label htmlFor="med-frequency">Frequency *</Label>
            <select
              id="med-frequency"
              value={currentMedication.frequency}
              onChange={(e) => updateCurrentMedication("frequency", e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select frequency</option>
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Three times daily">Three times daily</option>
              <option value="Four times daily">Four times daily</option>
              <option value="Every 4 hours">Every 4 hours</option>
              <option value="Every 6 hours">Every 6 hours</option>
              <option value="Every 8 hours">Every 8 hours</option>
              <option value="Every 12 hours">Every 12 hours</option>
              <option value="As needed">As needed</option>
              <option value="Before meals">Before meals</option>
              <option value="After meals">After meals</option>
              <option value="At bedtime">At bedtime</option>
            </select>
          </div>
          <div>
            <Label htmlFor="med-duration">Duration *</Label>
            <Input
              id="med-duration"
              value={currentMedication.duration}
              onChange={(e) => updateCurrentMedication("duration", e.target.value)}
              placeholder="e.g., 7 days"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="med-quantity">Quantity</Label>
            <Input
              id="med-quantity"
              value={currentMedication.quantity}
              onChange={(e) => updateCurrentMedication("quantity", e.target.value)}
              placeholder="e.g., 14 tablets"
              className="mt-1"
            />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="med-instructions">Special Instructions</Label>
          <Textarea
            id="med-instructions"
            value={currentMedication.instructions}
            onChange={(e) => updateCurrentMedication("instructions", e.target.value)}
            placeholder="Additional instructions for the patient"
            className="mt-1"
            rows={2}
          />
        </div>

        <Button 
          onClick={addCurrentMedication}
          className="bg-medical-blue hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>

      {/* Existing Medications List */}
      {medications.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Added Medications ({medications.length})</h3>
          {medications.map((medication) => (
            <div key={medication.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Drug Name</span>
                      <p className="text-gray-900 font-medium">{medication.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Strength</span>
                      <p className="text-gray-900">{medication.strength}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Dose</span>
                      <p className="text-gray-900">{medication.dose}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Route</span>
                      <p className="text-gray-900">{medication.route}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Frequency</span>
                      <p className="text-gray-900">{medication.frequency}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Duration</span>
                      <p className="text-gray-900">{medication.duration}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Quantity</span>
                      <p className="text-gray-900">{medication.quantity || "N/A"}</p>
                    </div>
                  </div>
                  {medication.instructions && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Instructions</span>
                      <p className="text-gray-700">{medication.instructions}</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => deleteMedication(medication.id)}>
                    <RotateCcw className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}