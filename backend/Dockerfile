# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Optimize build caching: Copy package files first
COPY package.json package-lock.json ./

# Install dependencies
# using ci for clean install based on lockfile
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
