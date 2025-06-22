import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { medicationSchema, type Medication } from "@shared/schema";

interface MedicationFormProps {
  medication?: Medication | null;
  onSave: (medication: Medication) => void;
  onCancel: () => void;
}

export default function MedicationForm({ medication, onSave, onCancel }: MedicationFormProps) {
  const form = useForm<Medication>({
    resolver: zodResolver(medicationSchema),
    defaultValues: medication || {
      id: "",
      name: "",
      strength: "",
      dose: "",
      route: "",
      frequency: "",
      duration: "",
      quantity: "",
      instructions: "",
    },
  });

  const handleSave = async (data: Medication) => {
    try {
      const medicationData = {
        ...data,
        id: medication?.id || `med_${Date.now()}`,
      };

      console.log("✅ Saving medication:", medicationData); // Debug log

      // Important: Do not perform full page reloads or reset states here.
      onSave(medicationData);
    } catch (err) {
      console.error("❌ Error while saving medication", err);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {medication ? "Edit Medication" : "Add Medication"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="space-y-6"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                e.preventDefault(); // Avoid accidental reload or premature submit
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* All Form Fields remain the same */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drug Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Paracetamol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="strength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strength *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 500mg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dose *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1 tablet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="route"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Route" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="oral">Oral</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="inhaled">Inhaled</SelectItem>
                        <SelectItem value="sublingual">Sublingual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="once-daily">Once daily</SelectItem>
                        <SelectItem value="twice-daily">Twice daily</SelectItem>
                        <SelectItem value="3-times-daily">3 times daily</SelectItem>
                        <SelectItem value="4-times-daily">4 times daily</SelectItem>
                        <SelectItem value="as-needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5 days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 15 tablets" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Take after meals, avoid alcohol" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
