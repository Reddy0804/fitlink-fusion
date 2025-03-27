
// Database Service (using localStorage)
// In a production app, this would be replaced with a real database

// Helper to generate a unique ID
const generateId = () => Date.now().toString();

// Initialize localStorage with default data if needed
const initializeDb = () => {
  if (!localStorage.getItem('health_data')) {
    localStorage.setItem('health_data', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('health_insights')) {
    localStorage.setItem('health_insights', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('users')) {
    // Add default user for demo
    const defaultUsers = [
      {
        id: 1,
        username: 'patient',
        password: 'patient123',
        email: 'patient@example.com',
        role: 'patient',
        created: new Date().toISOString()
      },
      {
        id: 2,
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com',
        role: 'admin',
        created: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
  
  if (!localStorage.getItem('patients')) {
    // Add default patient info for demo
    const defaultPatients = [
      {
        userId: 1,
        name: 'John Doe',
        age: 45,
        height: 175,
        weight: 80,
        medicalConditions: ['Type 2 Diabetes', 'Hypertension'],
        medications: ['Metformin 500mg', 'Lisinopril 10mg'],
        allergies: ['Penicillin'],
        emergencyContact: 'Jane Doe (555-123-4567)'
      },
      {
        userId: 2,
        name: 'Admin User',
        age: 35,
        height: 180,
        weight: 75,
        medicalConditions: [],
        medications: [],
        allergies: [],
        emergencyContact: 'Emergency Services (911)'
      }
    ];
    localStorage.setItem('patients', JSON.stringify(defaultPatients));
  }
};

// Initialize on import
initializeDb();

// Health data operations
const getHealthData = (userId: number) => {
  const data = JSON.parse(localStorage.getItem('health_data') || '[]');
  return data.filter((item: any) => item.userId === userId);
};

const saveHealthData = (data: any) => {
  const existingData = JSON.parse(localStorage.getItem('health_data') || '[]');
  const updatedData = [...existingData, { ...data, id: generateId() }];
  localStorage.setItem('health_data', JSON.stringify(updatedData));
  return data;
};

// Health insights operations
const getHealthInsights = (userId: number, condition?: string) => {
  const insights = JSON.parse(localStorage.getItem('health_insights') || '[]');
  let filtered = insights.filter((item: any) => item.userId === userId);
  
  // Sort by timestamp, newest first
  filtered.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Filter by condition if specified
  if (condition) {
    filtered = filtered.filter((item: any) => item.condition === condition);
  }
  
  return filtered;
};

const saveHealthInsight = (insight: any) => {
  const existingInsights = JSON.parse(localStorage.getItem('health_insights') || '[]');
  const updatedInsights = [...existingInsights, { ...insight, id: generateId() }];
  localStorage.setItem('health_insights', JSON.stringify(updatedInsights));
  return insight;
};

// User operations
const getUserByCredentials = (username: string, password: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find((user: any) => 
    user.username === username && user.password === password
  ) || null;
};

const getUserByUsername = (username: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find((user: any) => user.username === username) || null;
};

const saveUser = (user: any) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const updatedUsers = [...users, user];
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  return user;
};

// Patient operations
const getPatient = (userId: number) => {
  const patients = JSON.parse(localStorage.getItem('patients') || '[]');
  return patients.find((patient: any) => patient.userId === userId) || null;
};

const savePatient = (patient: any) => {
  const patients = JSON.parse(localStorage.getItem('patients') || '[]');
  const existingPatientIndex = patients.findIndex((p: any) => p.userId === patient.userId);
  
  if (existingPatientIndex >= 0) {
    // Update existing patient
    patients[existingPatientIndex] = patient;
  } else {
    // Add new patient
    patients.push(patient);
  }
  
  localStorage.setItem('patients', JSON.stringify(patients));
  return patient;
};

// Export all database functions
const dbService = {
  getHealthData,
  saveHealthData,
  getHealthInsights,
  saveHealthInsight,
  getUserByCredentials,
  getUserByUsername,
  saveUser,
  getPatient,
  savePatient
};

export default dbService;
