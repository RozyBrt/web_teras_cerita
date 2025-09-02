import { 
  type User, 
  type InsertUser,
  type ChatSession,
  type InsertChatSession,
  type StressAssessment,
  type InsertStressAssessment,
  type EmergencyRequest,
  type InsertEmergencyRequest
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  updateChatSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;
  
  createStressAssessment(assessment: InsertStressAssessment & { stressScore: number; stressLevel: string }): Promise<StressAssessment>;
  getStressAssessmentsBySession(sessionId: string): Promise<StressAssessment[]>;
  getRecentStressAssessments(limit?: number): Promise<StressAssessment[]>;
  
  createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest>;
  getAllEmergencyRequests(): Promise<EmergencyRequest[]>;
  updateEmergencyRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatSessions: Map<string, ChatSession>;
  private stressAssessments: Map<string, StressAssessment>;
  private emergencyRequests: Map<string, EmergencyRequest>;

  constructor() {
    this.users = new Map();
    this.chatSessions = new Map();
    this.stressAssessments = new Map();
    this.emergencyRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      ...insertSession,
      id,
      startedAt: new Date(),
      endedAt: null,
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return Array.from(this.chatSessions.values()).find(
      (session) => session.sessionId === sessionId
    );
  }

  async updateChatSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = await this.getChatSession(sessionId);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.chatSessions.set(session.id, updatedSession);
    return updatedSession;
  }

  async createStressAssessment(insertAssessment: InsertStressAssessment & { stressScore: number; stressLevel: string }): Promise<StressAssessment> {
    const id = randomUUID();
    const assessment: StressAssessment = {
      ...insertAssessment,
      id,
      sessionId: insertAssessment.sessionId || null,
      completedAt: new Date(),
    };
    this.stressAssessments.set(id, assessment);
    return assessment;
  }

  async getStressAssessmentsBySession(sessionId: string): Promise<StressAssessment[]> {
    return Array.from(this.stressAssessments.values()).filter(
      (assessment) => assessment.sessionId === sessionId
    );
  }

  async getRecentStressAssessments(limit: number = 7): Promise<StressAssessment[]> {
    const assessments = Array.from(this.stressAssessments.values())
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, limit);
    return assessments;
  }

  async createEmergencyRequest(insertRequest: InsertEmergencyRequest): Promise<EmergencyRequest> {
    const id = randomUUID();
    const request: EmergencyRequest = {
      ...insertRequest,
      id,
      name: insertRequest.name || null,
      message: insertRequest.message || null,
      isResolved: false,
      createdAt: new Date(),
    };
    this.emergencyRequests.set(id, request);
    return request;
  }

  async getAllEmergencyRequests(): Promise<EmergencyRequest[]> {
    return Array.from(this.emergencyRequests.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateEmergencyRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest | undefined> {
    const request = this.emergencyRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.emergencyRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
