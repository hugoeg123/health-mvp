# Health MVP

A full-stack healthcare application built with React and Node.js.

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

## Setup Instructions

1. Clone the repository

2. Install dependencies:
   ```bash
   npm run setup
   ```
   This will install dependencies for both client and server.

3. Environment Configuration:
   - Copy `.env.example` to `.env` in both client and server directories
   - Update the environment variables as needed

4. Database Setup:
   ```bash
   cd server
   npx prisma migrate reset
   ```

## Development

To run both client and server in development mode:

```bash
 npm run dev
```

This will start:
- Client at http://localhost:3000
- Server at http://localhost:3001

## Project Structure

```
/
├── client/          # React frontend
│   ├── src/
│   └── ...
├── server/          # Express backend
│   ├── middleware/
│   ├── utils/
│   └── ...
└── ...
```

## Troubleshooting

### CORS Issues
- Ensure the client is running on port 3000
- Ensure the server is running on port 3001
- Check that CORS is properly configured in server/index.ts

### Database Issues
- Verify database connection string in server/.env
- Ensure database service is running
- Run migrations if schema changes