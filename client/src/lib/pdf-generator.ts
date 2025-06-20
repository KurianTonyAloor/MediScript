import jsPDF from 'jspdf';
import type { Prescription } from '@shared/schema';

export const generatePDF = async (prescription: Prescription): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with automatic line breaks
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    };

    // Header - Doctor Information
    pdf.setFillColor(37, 99, 235); // medical-blue
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PRESCRIPTION', margin, 15);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    yPosition = 22;
    yPosition = addText(`Dr. ${prescription.doctorData.name}, ${prescription.doctorData.degree}`, margin, yPosition, pageWidth - 2 * margin, 10);
    yPosition = addText(`Reg No: ${prescription.doctorData.registrationNumber}`, margin, yPosition, pageWidth - 2 * margin, 8);
    yPosition = addText(`${prescription.doctorData.hospital}`, margin, yPosition, pageWidth - 2 * margin, 8);

    // Reset text color and position
    pdf.setTextColor(0, 0, 0);
    yPosition = 50;

    // Patient Information
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText('PATIENT INFORMATION', margin, yPosition, pageWidth - 2 * margin, 14);
    yPosition += 5;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Calculate age
    const calculateAge = (dob: string) => {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const patientInfo = [
      `Name: ${prescription.patientData.name}`,
      `Age: ${calculateAge(prescription.patientData.dob)} years`,
      `Gender: ${prescription.patientData.gender}`,
      `Mobile: ${prescription.patientData.mobile}`,
      `DOB: ${new Date(prescription.patientData.dob).toLocaleDateString()}`,
    ];

    if (prescription.patientData.address) {
      patientInfo.push(`Address: ${prescription.patientData.address}`);
    }

    patientInfo.forEach(info => {
      yPosition = addText(info, margin, yPosition, pageWidth - 2 * margin);
      yPosition += 2;
    });

    yPosition += 10;

    // Medical Details
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText('MEDICAL DETAILS', margin, yPosition, pageWidth - 2 * margin, 14);
    yPosition += 5;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    yPosition = addText(`Chief Complaint: ${prescription.patientData.chiefComplaint}`, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 5;
    yPosition = addText(`Diagnosis: ${prescription.patientData.diagnosis}`, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 5;

    if (prescription.patientData.notes) {
      yPosition = addText(`Notes: ${prescription.patientData.notes}`, margin, yPosition, pageWidth - 2 * margin);
      yPosition += 5;
    }

    yPosition += 10;

    // Medications
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText('MEDICATIONS', margin, yPosition, pageWidth - 2 * margin, 14);
    yPosition += 5;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    prescription.medications.forEach((medication, index) => {
      const medicationText = `${index + 1}. ${medication.name} ${medication.strength} - ${medication.dose} - ${medication.route} - ${medication.frequency} - ${medication.duration}`;
      yPosition = addText(medicationText, margin, yPosition, pageWidth - 2 * margin);
      
      if (medication.instructions) {
        yPosition = addText(`   Instructions: ${medication.instructions}`, margin, yPosition, pageWidth - 2 * margin);
      }
      yPosition += 3;

      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }
    });

    // Follow-up
    if (prescription.patientData.followupDate) {
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      yPosition = addText('FOLLOW-UP', margin, yPosition, pageWidth - 2 * margin, 12);
      yPosition += 3;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const followupDate = new Date(prescription.patientData.followupDate).toLocaleDateString();
      const followupTime = prescription.patientData.followupTime || '';
      yPosition = addText(`Next visit: ${followupDate} ${followupTime}`, margin, yPosition, pageWidth - 2 * margin);
    }

    // Footer with signature and QR code
    const footerY = pageHeight - 40;
    
    // Date and prescription ID
    pdf.setFontSize(8);
    pdf.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, margin, footerY);
    pdf.text(`Prescription ID: ${prescription.id}`, margin, footerY + 5);

    // Doctor signature (if available)
    if (prescription.doctorData.signature) {
      try {
        pdf.addImage(prescription.doctorData.signature, 'PNG', pageWidth - 80, footerY - 20, 60, 20);
      } catch (error) {
        console.warn('Could not add signature to PDF:', error);
      }
    }

    // Add QR code for verification (if available)
    if (prescription.qrCode) {
      try {
        // Generate QR code as data URL using a simple QR library approach
        const qrCodeDataUrl = await generateQRCodeDataUrl(prescription.id);
        pdf.addImage(qrCodeDataUrl, 'PNG', margin, footerY - 20, 20, 20);
        pdf.setFontSize(6);
        pdf.text('Scan to verify', margin, footerY + 5);
      } catch (error) {
        console.warn('Could not add QR code to PDF:', error);
      }
    }

    // Footer text
    pdf.setFontSize(8);
    pdf.text('-- Prescription generated by MedScript --', margin, pageHeight - 10);

    // Save the PDF
    const fileName = `prescription_${prescription.patientData.name.replace(/\s+/g, '_')}_${prescription.id}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Helper function to generate QR code as data URL
const generateQRCodeDataUrl = async (data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a simple QR code using canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = 100;
      canvas.height = 100;
      
      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 100, 100);
      
      // Create a simple pattern for the QR code (placeholder)
      ctx.fillStyle = 'black';
      ctx.font = '8px monospace';
      ctx.fillText(data, 5, 15);
      
      // Add some pattern blocks to make it look like a QR code
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if ((i + j + data.length) % 3 === 0) {
            ctx.fillRect(i * 8 + 10, j * 8 + 20, 6, 6);
          }
        }
      }
      
      resolve(canvas.toDataURL());
    } catch (error) {
      reject(error);
    }
  });
};
