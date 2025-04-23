const fs = require('fs');

const envContent = `# MinIO Configuration
MINIO_API_PORT=9002
MINIO_CONSOLE_PORT=9003
STACKHERO_MINIO_ACCESS_KEY=minioadmin
STACKHERO_MINIO_SECRET_KEY=minioadmin

# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gemtec

# NestJS Configuration
NESTJS_PORT=3000
NODE_ENV=development

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"gemtec-e25e8"}
FIREBASE_PROJECT_ID=gemtec-e25e8`;

fs.writeFileSync('.env', envContent);
console.log('.env file created successfully!'); 