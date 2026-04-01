# 1. Use a stable Node.js base image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first to leverage Docker caching
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your backend source code
COPY . .

# 6. Expose the port your Express app will run on
EXPOSE 3000

# 7. Start the server
CMD ["node", "server.js"]