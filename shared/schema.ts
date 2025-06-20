import { z } from "zod";

export const doctorProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  degree: z.string().min(1, "Degree is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  hospital: z.string().min(1, "Hospital/Clinic name is required"),
  address: z.string().min(1, "Address is required"),
  signature: z.string().optional(), // base64 encoded signature image
});

export const medicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Drug name is required"),
  strength: z.string().min(1, "Strength is required"),
  dose: z.string().min(1, "Dose is required"),
  route: z.string().min(1, "Route is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  quantity: z.string().optional(),
  instructions: z.string().optional(),
});

export const patientSchema = z.object({
  name: z.string().min(1, "Patient name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  mobile: z.string().min(10, "Valid mobile number is required"),
  address: z.string().optional(),
  height: z.string().optional(),
  heightUnit: z.enum(["cm", "ft"]).default("cm"),
  weight: z.string().optional(),
  weightUnit: z.enum(["kg", "lbs"]).default("kg"),
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  notes: z.string().optional(),
  followupDate: z.string().optional(),
  followupTime: z.string().optional(),
});

export const prescriptionSchema = z.object({
  id: z.string(),
  patientData: patientSchema,
  medications: z.array(medicationSchema),
  doctorData: doctorProfileSchema,
  createdAt: z.string(),
  qrCode: z.string(),
});

export const appSettingsSchema = z.object({
  autoSave: z.boolean().default(true),
  darkMode: z.boolean().default(false),
  includeQR: z.boolean().default(true),
});

export type DoctorProfile = z.infer<typeof doctorProfileSchema>;
export type Medication = z.infer<typeof medicationSchema>;
export type Patient = z.infer<typeof patientSchema>;
export type Prescription = z.infer<typeof prescriptionSchema>;
export type AppSettings = z.infer<typeof appSettingsSchema>;
