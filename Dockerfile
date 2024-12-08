# Step 1: Use an official Node.js runtime as a base image
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY /package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the src directory and all other application files into the container
COPY /src ./src

# Step 6: Expose port 3000 (since your app runs on this port)
EXPOSE 8000

# Step 7: Define the command to run the app (assuming entry point is app.js inside src)
CMD ["node", "src/app.js"]
