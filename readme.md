Below is a `README.md` template that explains how to set up and run the provided project locally, along with information about the technology stack used.

```markdown
# Project Setup and Local Development

This guide will help you set up and run the project locally on your machine. The project consists of two main parts: the server and the client.

## Prerequisites

Before you begin, make sure you have Node.js installed on your system. You can download it from [Node.js official website](https://nodejs.org/).

## Setting up the Server

1. **Install TypeScript globally**:
   ```bash
   npm install -g typescript
   npm install -g tsc

   ```

2. **Navigate to the server directory**:
   ```bash
   cd server
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the server directory and fill in the following environment variables:
   ```
   MONGODB_URI=your_mongodb_uri
   MONGODB_DB_NAME=your_database_name
   TOKEN_SECRET=your_token_secret
   S3_ACCESS_KEY=your_s3_access_key
   S3_SECRET_KEY=your_s3_secret_key
   S3_ENDPOINT=your_s3_endpoint
   S3_BUCKET=your_s3_bucket
   PORT=8000
   CORS_ORIGIN=your_cors_origin
   ```

5. **Run the server in development mode**:
   ```bash
   npm run dev
   ```

## Setting up the Client

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the client directory and add the following:
   ```
   NEXT_PUBLIC_API_URI=http://localhost:8000/
   ```

4. **Run the client in development mode**:
   ```bash
   npm run dev
   ```

## Tech Stack

### Server Dependencies
- Express: Web framework for Node.js.
- Mongoose: MongoDB object modeling tool.
- JSON Web Token and bcrypt: For authentication and data encryption.
- AWS SDK and multer-s3: For handling uploads to AWS S3.
- Zod: For data validation.
- Cors, dotenv, cookie-parser, and http-status-codes for various server-side utilities.

### Client Dependencies
- Next.js: React framework for server-rendered applications.
- Axios for promise-based HTTP client.
- Various @radix-ui libraries for UI components.
- Tailwind CSS for styling.
- Zod for client-side validation.

### Development Dependencies
- TypeScript: Adds static types to JavaScript.
- ESLint and various plugins for code linting.
- nodemon, ts-node for enhanced development experience with auto-restarts and TypeScript execution.

## Conclusion

This README provides a basic setup for running the project locally. Adjust configurations and dependencies as per your project requirements and environment settings.
```
