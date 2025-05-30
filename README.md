# Clone the repo
git clone https://github.com/yourusername/health-monitoring-system.git
cd health-monitoring-system

# Backend setup
cd backend
./mvnw spring-boot:run

# Frontend setup
cd ../frontend
npm install
npm start
