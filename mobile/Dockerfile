FROM node:20-alpine

RUN npm install -g expo-cli @expo/ngrok

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 8081

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

CMD ["npx", "expo", "start", "--web", "--port", "8081", "--no-dev"]
