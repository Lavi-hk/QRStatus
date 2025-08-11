import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertFacultySchema, updateFacultyStatusSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Faculty routes
  app.get("/api/faculty", async (req, res) => {
    try {
      const allFaculty = await storage.getAllFaculty();
      res.json(allFaculty);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch faculty" });
    }
  });

  app.get("/api/faculty/:id", async (req, res) => {
    try {
      const faculty = await storage.getFaculty(req.params.id);
      if (!faculty) {
        return res.status(404).json({ error: "Faculty not found" });
      }
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch faculty" });
    }
  });

  app.post("/api/faculty", async (req, res) => {
    try {
      const data = insertFacultySchema.parse(req.body);
      const faculty = await storage.createFaculty(data);
      
      // Broadcast new faculty to all connected clients
      broadcastToClients({ type: "faculty_added", data: faculty });
      
      res.status(201).json(faculty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create faculty" });
    }
  });

  app.patch("/api/faculty/:id/status", async (req, res) => {
    try {
      const statusUpdate = updateFacultyStatusSchema.parse(req.body);
      const faculty = await storage.updateFacultyStatus(req.params.id, statusUpdate);
      
      if (!faculty) {
        return res.status(404).json({ error: "Faculty not found" });
      }

      // Broadcast status update to all connected clients
      broadcastToClients({ type: "status_updated", data: faculty });
      
      res.json(faculty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update faculty status" });
    }
  });

  // QR Code endpoint - returns the URL for the faculty status page
  app.get("/api/faculty/:id/qr-data", async (req, res) => {
    try {
      const faculty = await storage.getFaculty(req.params.id);
      if (!faculty) {
        return res.status(404).json({ error: "Faculty not found" });
      }
      
      // Return the URL that should be encoded in the QR code
      const baseUrl = process.env.REPLIT_DOMAINS 
        ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
        : `http://localhost:5000`;
      
      const qrData = `${baseUrl}/faculty/${faculty.id}`;
      res.json({ qrData, faculty });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate QR data" });
    }
  });

  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('close', () => {
      clients.delete(ws);
    });

    // Send initial faculty data
    storage.getAllFaculty().then(faculty => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "initial_data", data: faculty }));
      }
    });
  });

  function broadcastToClients(message: any) {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  return httpServer;
}
