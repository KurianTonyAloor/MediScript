import type { Prescription, DoctorProfile } from "@shared/schema";

// Storage interface for the medical prescription app
export interface IStorage {
  // Since this is a client-side offline app, we don't need server storage
  // The storage is handled entirely on the client side using localStorage
}

export class MemStorage implements IStorage {
  constructor() {
    // Empty implementation since all storage is client-side
  }
}

export const storage = new MemStorage();
