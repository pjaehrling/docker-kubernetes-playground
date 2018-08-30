FROM node:8

# Create app directory
WORKDIR /usr/app

# Install app dependencies (just copy package files first to make use of cache)
COPY package*.json ./
RUN npm install

# Copy code
COPY ./src ./src

# Make sure the app can be reached
EXPOSE 8080

# Start the app
CMD npm start