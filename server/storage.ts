import { type Faculty, type InsertFaculty, type UpdateFacultyStatus } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Faculty operations
  getFaculty(id: string): Promise<Faculty | undefined>;
  getFacultyByEmail(email: string): Promise<Faculty | undefined>;
  getAllFaculty(): Promise<Faculty[]>;
  createFaculty(faculty: InsertFaculty): Promise<Faculty>;
  updateFacultyStatus(id: string, statusUpdate: UpdateFacultyStatus): Promise<Faculty | undefined>;
  deleteFaculty(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private faculty: Map<string, Faculty>;

  constructor() {
    this.faculty = new Map();
    this.seedData();
  }

  private seedData() {
    // Add sample faculty data
    const sampleFaculty: InsertFaculty[] = [
      {
        name: "Dr. Sarah Johnson",
        email: "s.johnson@university.edu",
        department: "Computer Science Department",
        office: "Room 204B, Tech Building",
        phone: "(555) 123-4567",
        officeHours: "Monday - Friday: 2:00 PM - 4:00 PM",
        status: "available",
        customMessage: "Ready for student visits and questions",
        isActive: true,
      },
      {
        name: "Prof. Michael Chen",
        email: "m.chen@university.edu",
        department: "Mathematics Department",
        office: "Room 301A, Science Building",
        phone: "(555) 234-5678",
        officeHours: "Tuesday, Thursday: 1:00 PM - 3:00 PM",
        status: "busy",
        customMessage: "In meeting until 4:30 PM",
        isActive: true,
      },
      {
        name: "Dr. Emily Rodriguez",
        email: "e.rodriguez@university.edu",
        department: "Physics Department",
        office: "Room 105C, Physics Building",
        phone: "(555) 345-6789",
        officeHours: "Monday, Wednesday, Friday: 10:00 AM - 12:00 PM",
        status: "away",
        customMessage: "Back at 3:00 PM",
        isActive: true,
      },
    ];

    sampleFaculty.forEach(f => {
      const id = randomUUID();
      const faculty: Faculty = {
        id,
        name: f.name,
        email: f.email,
        department: f.department,
        office: f.office,
        phone: f.phone || null,
        officeHours: f.officeHours || null,
        status: f.status || "away",
        customMessage: f.customMessage || null,
        lastUpdated: new Date(),
        isActive: f.isActive ?? true,
      };
      this.faculty.set(id, faculty);
    });
  }

  async getFaculty(id: string): Promise<Faculty | undefined> {
    return this.faculty.get(id);
  }

  async getFacultyByEmail(email: string): Promise<Faculty | undefined> {
    return Array.from(this.faculty.values()).find(f => f.email === email);
  }

  async getAllFaculty(): Promise<Faculty[]> {
    return Array.from(this.faculty.values()).filter(f => f.isActive);
  }

  async createFaculty(insertFaculty: InsertFaculty): Promise<Faculty> {
    const id = randomUUID();
    const faculty: Faculty = {
      id,
      name: insertFaculty.name,
      email: insertFaculty.email,
      department: insertFaculty.department,
      office: insertFaculty.office,
      phone: insertFaculty.phone || null,
      officeHours: insertFaculty.officeHours || null,
      status: insertFaculty.status || "away",
      customMessage: insertFaculty.customMessage || null,
      lastUpdated: new Date(),
      isActive: insertFaculty.isActive || true,
    };
    this.faculty.set(id, faculty);
    return faculty;
  }

  async updateFacultyStatus(id: string, statusUpdate: UpdateFacultyStatus): Promise<Faculty | undefined> {
    const faculty = this.faculty.get(id);
    if (!faculty) return undefined;

    const updatedFaculty: Faculty = {
      ...faculty,
      ...statusUpdate,
      lastUpdated: new Date(),
    };
    this.faculty.set(id, updatedFaculty);
    return updatedFaculty;
  }

  async deleteFaculty(id: string): Promise<boolean> {
    return this.faculty.delete(id);
  }
}

export const storage = new MemStorage();
