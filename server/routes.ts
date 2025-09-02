import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendEmergencyNotification } from "./services/email";
import { insertChatSessionSchema, insertStressAssessmentSchema, insertEmergencyRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Chat endpoints
  app.post("/api/chat/start", async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      const chatSession = await storage.createChatSession({
        sessionId,
        messages: JSON.stringify([{
          id: Date.now().toString(),
          text: "Halo! Selamat datang di Ruang Tenang. Saya di sini untuk mendengarkan dan memberikan dukungan. Bagaimana perasaan Anda hari ini?",
          isUser: false,
          timestamp: new Date().toISOString()
        }])
      });

      res.json({ success: true, chatSession });
    } catch (error) {
      console.error('Error starting chat session:', error);
      res.status(500).json({ error: "Failed to start chat session" });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const { sessionId, message } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ error: "Session ID and message are required" });
      }

      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Chat session not found" });
      }

      const messages = JSON.parse(session.messages);
      
      // Add user message
      messages.push({
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date().toISOString()
      });

      // Generate AI response (positive affirmations)
      const affirmations = [
        "Terima kasih sudah berbagi. Ingat, kamu lebih kuat dari yang kamu kira. 💪",
        "Setiap langkah kecil adalah sebuah kemajuan. Aku bangga padamu. 🌱",
        "Perasaan ini akan berlalu. Kamu memiliki kekuatan untuk melewati ini. 🌈",
        "Tidak apa-apa untuk tidak baik-baik saja. Yang penting kamu berusaha. ❤️",
        "Kamu sudah melakukan yang terbaik hari ini, dan itu sudah cukup. ⭐",
        "Setiap hari adalah kesempatan baru untuk mulai lagi. Semangat! 🌅",
        "Kamu berharga dan kehadiranmu di dunia ini berarti. 🌟",
        "Ambil napas dalam-dalam. Kamu mampu melewati ini satu langkah pada satu waktu. 🌸",
        "Perasaanmu valid dan penting. Terima kasih sudah percaya untuk berbagi. 🤗",
        "Kamu tidak sendirian dalam perjuangan ini. Kami di sini untuk mendukungmu. 🤝"
      ];

      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      
      messages.push({
        id: (Date.now() + 1).toString(),
        text: randomAffirmation,
        isUser: false,
        timestamp: new Date().toISOString()
      });

      const updatedSession = await storage.updateChatSession(sessionId, {
        messages: JSON.stringify(messages)
      });

      res.json({ 
        success: true, 
        response: randomAffirmation,
        messages: messages
      });
    } catch (error) {
      console.error('Error sending chat message:', error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.post("/api/chat/end", async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      const updatedSession = await storage.updateChatSession(sessionId, {
        endedAt: new Date()
      });

      res.json({ success: true, session: updatedSession });
    } catch (error) {
      console.error('Error ending chat session:', error);
      res.status(500).json({ error: "Failed to end chat session" });
    }
  });

  // Stress Assessment endpoints
  app.post("/api/stress/assess", async (req, res) => {
    try {
      const validatedData = insertStressAssessmentSchema.parse(req.body);
      
      // Calculate stress score (average * 20 to get 0-100 scale)
      const questions = [validatedData.question1, validatedData.question2, validatedData.question3, validatedData.question4, validatedData.question5];
      const average = questions.reduce((sum, q) => sum + q, 0) / questions.length;
      const stressScore = Math.round((average - 1) * 25);
      
      // Determine stress level
      let stressLevel: string;
      if (stressScore <= 25) stressLevel = 'Rendah';
      else if (stressScore <= 50) stressLevel = 'Sedang';
      else if (stressScore <= 75) stressLevel = 'Tinggi';
      else stressLevel = 'Sangat Tinggi';

      const assessment = await storage.createStressAssessment({
        ...validatedData,
        stressScore,
        stressLevel
      });

      res.json({ 
        success: true, 
        assessment,
        stressScore,
        stressLevel
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid assessment data", details: error.errors });
      }
      console.error('Error creating stress assessment:', error);
      res.status(500).json({ error: "Failed to create stress assessment" });
    }
  });

  app.get("/api/stress/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 7;
      const assessments = await storage.getRecentStressAssessments(limit);
      res.json({ success: true, assessments });
    } catch (error) {
      console.error('Error fetching stress history:', error);
      res.status(500).json({ error: "Failed to fetch stress history" });
    }
  });

  // Emergency Request endpoints
  app.post("/api/emergency", async (req, res) => {
    try {
      const validatedData = insertEmergencyRequestSchema.parse(req.body);
      
      const emergencyRequest = await storage.createEmergencyRequest(validatedData);
      
      // Send emergency notification email
      const emailSent = await sendEmergencyNotification({
        name: validatedData.name || undefined,
        contact: validatedData.contact,
        message: validatedData.message || undefined
      });

      if (!emailSent) {
        console.error('Failed to send emergency notification email');
      }

      res.json({ 
        success: true, 
        emergencyRequest,
        emailSent
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid emergency request data", details: error.errors });
      }
      console.error('Error creating emergency request:', error);
      res.status(500).json({ error: "Failed to create emergency request" });
    }
  });

  app.get("/api/emergency", async (req, res) => {
    try {
      const requests = await storage.getAllEmergencyRequests();
      res.json({ success: true, requests });
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
      res.status(500).json({ error: "Failed to fetch emergency requests" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
