# Backend Server

Modern Express.js backend server with TypeScript.

## Features

- 🚀 Express.js with TypeScript
- 🔒 Security headers with Helmet
- 🌐 CORS support
- 📝 Request logging with Morgan
- ✅ Input validation with Zod
- 🔄 Hot reload with tsx
- 🐳 Docker support

## Getting Started

### Prerequisites

- Node.js >= 24.2.0
- pnpm >= 10.11.0

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### Development

```bash
# Start development server with hot reload
pnpm dev
```

The server will start on `http://localhost:3000`

### Building for Production

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server health status.

### API Root
```
GET /api
```
Returns API information and available endpoints.

### Users
```
GET /api/users
POST /api/users
```
Example CRUD endpoints.

### ElevenLabs Agents
```
POST /api/agents
```
Creates a new ElevenLabs conversational agent by forwarding your system prompt, preferred voice pool, and desired language (English `en`, French `fr`, or Spanish `es`). The route randomly selects one voice from the provided list (or from `ELEVENLABS_DEFAULT_VOICE_IDS`) and replies with the created `agentId`, `voiceId`, and language metadata.

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Support Agent",
    "systemPrompt": "You are a multilingual guitar expert.",
    "language": "fr",
    "voiceIds": ["voiceIdOne", "voiceIdTwo"],
    "firstMessage": "Bonjour! Pret a discuter guitares?"
  }'
```

#### Quick Test Script
Run the bundled script to create two sample agents (English + French) via the ElevenLabs API:

```bash
pnpm --filter backend run test:agents
```

The command prints the generated `agentId`, selected voice, language, and model so you can confirm the integration works outside of the HTTP route.

## Environment Variables

Create a `.env` file with the variables below:

```
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:5173
ELEVENLABS_API_KEY=sk_your_elevenlabs_key
ELEVENLABS_DEFAULT_MODEL_ID=eleven_turbo_v2_5
ELEVENLABS_DEFAULT_VOICE_IDS=voiceIdOne,voiceIdTwo,voiceIdThree
```

| Variable | Description | Default |
| --- | --- | --- |
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | HTTP port | `3000` |
| `HOST` | HTTP host | `0.0.0.0` |
| `LOG_LEVEL` | Logging verbosity | `info` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `ELEVENLABS_API_KEY` | API key for the ElevenLabs SDK | _(required)_ |
| `ELEVENLABS_DEFAULT_MODEL_ID` | Default TTS model for agents | `eleven_turbo_v2_5` |
| `ELEVENLABS_DEFAULT_VOICE_IDS` | Comma-separated fallback voice IDs used when a request omits `voiceIds` | _(empty)_ |

## Project Structure

```
src/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── routes/          # API routes
└── index.ts         # Application entry point
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

