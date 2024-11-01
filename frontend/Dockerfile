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

# Build the React app
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Expose the port of app
EXPOSE 3002

# Command to run the app using serve
CMD ["sh", "-c", "PORT=3002 serve -s build"]
