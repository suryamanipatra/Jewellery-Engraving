# Frontend Dockerfile

FROM node:22
  # Set the working directory in the container
WORKDIR /app
  # Copy package.json and package-lock.json to the container
COPY frontend/package*.json .
  # Install project dependencies
RUN npm install --legacy-peer-deps
  # Copy the entire frontend application to the container
COPY . .
  # Expose the port that the React app runs on (default: 3000)
EXPOSE 5173
  # Define the command to start your application
CMD ["npm","run","dev","--host", "192.168.0.110"]
