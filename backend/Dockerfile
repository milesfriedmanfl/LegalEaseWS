# Use a Docker-friendly Node version
FROM node:18-bullseye-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package and package-lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of application code
COPY . .

# Build the application
RUN npm run build

# Expose port for Nest server
EXPOSE 3000

# Command to start the Nest server
CMD ["npm", "run", "start:prod"]