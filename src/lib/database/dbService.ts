
import { toast } from "@/components/ui/use-toast";
import { DB_CONFIG } from "@/config/config";
import { Patient, HealthData, HealthInsight } from "@/types/healthTypes";

// Enum for database operations (for better error handling)
enum DBOperation {
  READ = 'read',
  WRITE = 'write',
  UPDATE = 'update',
  DELETE = 'delete'
}

// For demo purposes, we'll use a simulated database with localStorage
// This can be replaced with actual database code when connection details are provided
class DatabaseService {
  private storageKeys = {
    patients: 'health_app_patients',
    healthData: 'health_app_health_data',
    insights: 'health_app_insights',
    credentials: 'health_app_credentials'
  };

  constructor() {
    console.log('Initializing database service with config:', DB_CONFIG);
    this.initLocalStorage();
  }

  private initLocalStorage() {
    // Initialize empty collections if they don't exist
    if (!localStorage.getItem(this.storageKeys.patients)) {
      localStorage.setItem(this.storageKeys.patients, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(this.storageKeys.healthData)) {
      localStorage.setItem(this.storageKeys.healthData, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(this.storageKeys.insights)) {
      localStorage.setItem(this.storageKeys.insights, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(this.storageKeys.credentials)) {
      // Add default admin and test user
      const defaultCredentials = [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
        { id: 2, username: 'patient', password: 'patient123', role: 'patient' }
      ];
      localStorage.setItem(this.storageKeys.credentials, JSON.stringify(defaultCredentials));
      
      // Add default patient record
      this.addPatient({
        id: 2,
        name: 'Jamie Smith',
        email: 'patient@example.com',
        age: 45,
        height: 175,
        weight: 70,
        medicalConditions: ['Type 2 Diabetes', 'Hypertension'],
        medications: ['Metformin 500mg', 'Lisinopril 10mg'],
        emergencyContact: 'Emergency Contact: (555) 123-4567'
      });
    }
  }

  private handleError(operation: DBOperation, entity: string, error: any) {
    console.error(`Database ${operation} error for ${entity}:`, error);
    toast({
      title: "Database Error",
      description: `Failed to ${operation} ${entity}. Please try again.`,
      variant: "destructive",
    });
  }

  // Authentication methods
  async validateCredentials(username: string, password: string): Promise<{id: number, role: string} | null> {
    try {
      const credentials = JSON.parse(localStorage.getItem(this.storageKeys.credentials) || '[]');
      const user = credentials.find((u: any) => u.username === username && u.password === password);
      
      if (user) {
        return { id: user.id, role: user.role };
      }
      return null;
    } catch (error) {
      this.handleError(DBOperation.READ, 'credentials', error);
      return null;
    }
  }

  // Patient methods
  async getPatient(id: number): Promise<Patient | null> {
    try {
      const patients = JSON.parse(localStorage.getItem(this.storageKeys.patients) || '[]');
      return patients.find((p: Patient) => p.id === id) || null;
    } catch (error) {
      this.handleError(DBOperation.READ, 'patient', error);
      return null;
    }
  }

  async addPatient(patient: Patient): Promise<boolean> {
    try {
      const patients = JSON.parse(localStorage.getItem(this.storageKeys.patients) || '[]');
      patients.push(patient);
      localStorage.setItem(this.storageKeys.patients, JSON.stringify(patients));
      return true;
    } catch (error) {
      this.handleError(DBOperation.WRITE, 'patient', error);
      return false;
    }
  }

  // Health data methods
  async saveHealthData(healthData: HealthData): Promise<HealthData | null> {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKeys.healthData) || '[]');
      
      // Add timestamp and ID if not present
      const enhancedData = {
        ...healthData,
        id: data.length + 1,
        timestamp: healthData.timestamp || new Date().toISOString()
      };
      
      data.push(enhancedData);
      localStorage.setItem(this.storageKeys.healthData, JSON.stringify(data));
      return enhancedData;
    } catch (error) {
      this.handleError(DBOperation.WRITE, 'health data', error);
      return null;
    }
  }

  async getHealthData(userId: number, limit: number = 100): Promise<HealthData[]> {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKeys.healthData) || '[]');
      
      // Filter by user ID and sort by timestamp (most recent first)
      return data
        .filter((item: HealthData) => item.userId === userId)
        .sort((a: HealthData, b: HealthData) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, limit);
    } catch (error) {
      this.handleError(DBOperation.READ, 'health data', error);
      return [];
    }
  }

  // Health insights methods
  async saveHealthInsight(insight: HealthInsight): Promise<HealthInsight | null> {
    try {
      const insights = JSON.parse(localStorage.getItem(this.storageKeys.insights) || '[]');
      
      // Add ID if not present
      const enhancedInsight = {
        ...insight,
        id: insights.length + 1,
        timestamp: insight.timestamp || new Date().toISOString()
      };
      
      insights.push(enhancedInsight);
      localStorage.setItem(this.storageKeys.insights, JSON.stringify(insights));
      return enhancedInsight;
    } catch (error) {
      this.handleError(DBOperation.WRITE, 'health insight', error);
      return null;
    }
  }

  async getHealthInsights(userId: number, condition?: string, limit: number = 50): Promise<HealthInsight[]> {
    try {
      const insights = JSON.parse(localStorage.getItem(this.storageKeys.insights) || '[]');
      
      // Filter by user ID and optionally by condition
      let filtered = insights.filter((item: HealthInsight) => item.userId === userId);
      
      if (condition) {
        filtered = filtered.filter((item: HealthInsight) => item.condition === condition);
      }
      
      // Sort by timestamp (most recent first)
      return filtered
        .sort((a: HealthInsight, b: HealthInsight) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, limit);
    } catch (error) {
      this.handleError(DBOperation.READ, 'health insights', error);
      return [];
    }
  }
}

// Create a singleton instance
const dbService = new DatabaseService();
export default dbService;
