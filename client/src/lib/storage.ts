import type { Prescription } from "@shared/schema";

export const savePrescription = (prescription: Prescription) => {
  try {
    const existingPrescriptions = getPrescriptions();
    const updatedPrescriptions = [prescription, ...existingPrescriptions];
    localStorage.setItem("prescriptions", JSON.stringify(updatedPrescriptions));
    
    // Also save the QR verification data
    const qrData = {
      [prescription.qrCode]: prescription.id
    };
    const existingQRData = getQRVerificationData();
    const updatedQRData = { ...existingQRData, ...qrData };
    localStorage.setItem("qrVerification", JSON.stringify(updatedQRData));
  } catch (error) {
    console.error("Error saving prescription:", error);
    throw new Error("Failed to save prescription");
  }
};

export const getPrescriptions = (): Prescription[] => {
  try {
    const stored = localStorage.getItem("prescriptions");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading prescriptions:", error);
    return [];
  }
};

export const getPrescriptionById = (id: string): Prescription | null => {
  const prescriptions = getPrescriptions();
  return prescriptions.find(p => p.id === id) || null;
};

export const deletePrescription = (id: string) => {
  try {
    const prescriptions = getPrescriptions();
    const filteredPrescriptions = prescriptions.filter(p => p.id !== id);
    localStorage.setItem("prescriptions", JSON.stringify(filteredPrescriptions));
  } catch (error) {
    console.error("Error deleting prescription:", error);
    throw new Error("Failed to delete prescription");
  }
};

export const getQRVerificationData = (): Record<string, string> => {
  try {
    const stored = localStorage.getItem("qrVerification");
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error loading QR verification data:", error);
    return {};
  }
};
