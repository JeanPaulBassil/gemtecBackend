#!/bin/bash

# Create .env file with necessary environment variables
cat > .env << EOL
# MinIO Configuration
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
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"gemtec-e25e8","private_key_id":"","private_key":"","client_email":"","client_id":"","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":""}
FIREBASE_PROJECT_ID=gemtec-e25e8
EOL

echo "Environment variables have been set up in .env file."
echo "You can now run 'docker-compose up' to start the services." 