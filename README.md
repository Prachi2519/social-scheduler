# Social Operations Scheduler

A full-stack social media scheduling workspace for composing, previewing, scheduling, and publishing posts across Twitter / X, LinkedIn, Facebook, and Instagram.

The product combines a platform-aware post composer, live social previews, channel readiness checks, AI-assisted content generation, media handling, and a scheduled publishing queue in one dashboard.

## Highlights

- Multi-platform post scheduling for Twitter / X, LinkedIn, Facebook, and Instagram.
- Platform-aware live previews that adapt feed layout, metadata, media ratio, caption behavior, and engagement UI based on the selected channel.
- Composer workflow with caption editor, character limits, media upload, date/time scheduling, quick schedule chips, and readiness validation.
- AI content generation with optional AI image generation through Hugging Face Inference Providers.
- Cloudinary-ready media handling for uploaded and generated assets.
- Social account connection and scheduled publishing flow through Zernio.
- Scheduled and published content queues with platform badges, media indicators, timestamps, filters, and empty states.
- Authentication with JWT, protected client routes, and authenticated API requests.
- Responsive dashboard with light mode, dark mode, accessible contrast, focus states, loading states, disabled states, and subtle micro-interactions.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js, TypeScript, MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Media | Multer, Cloudinary |
| AI | Hugging Face Inference Providers |
| Scheduling / Publishing | node-cron, Zernio |

## Product Flow

1. Users register or sign in.
2. Users connect social accounts from the Channels workspace.
3. Users compose a post in the Scheduler workspace.
4. The composer validates selected platforms, caption, schedule time, and media rules.
5. The live preview updates to match the selected social platform.
6. Scheduled posts are stored in MongoDB with platform, media, timestamp, and status metadata.
7. The scheduler service checks due posts every minute and publishes through connected Zernio accounts.
8. Published or failed posts update their status and appear in the content queue/activity history.

## Key Screens

- Landing page
- Authentication page
- Command Center dashboard
- Channel connection workspace
- Social Operations Scheduler
- AI Creative Desk
- Scheduled and published content queue

## Project Structure

```text
social-scheduler/
  client/
    src/
      api/                 # Axios API client
      assets/              # Static image and platform metadata
      components/          # Sidebar, theme toggle, landing/dashboard components
      context/             # Auth and theme providers
      pages/               # Home, Login, Dashboard, Accounts, Scheduler, AIComposer
      index.css            # Design tokens, dark mode, global interactions
  server/
    config/                # Database, Cloudinary, Multer, Zernio config
    controllers/           # Auth, account, social auth, posts, activity
    middlewares/           # JWT protection middleware
    models/                # User, Account, Post, Generation, ActivityLog schemas
    routes/                # REST API route definitions
    services/              # Scheduled publishing service
    server.ts              # Express server entry point
```

## Getting Started

### Prerequisites

- Node.js 20 or newer recommended
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- Optional: Cloudinary account for media uploads and permanent image URLs
- Optional: Hugging Face token with Inference Providers access for AI image generation
- Optional: Zernio API key for social account connection and scheduled publishing

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd social-scheduler
```

### 2. Install dependencies

Install client dependencies:

```bash
cd client
npm install
```

Install server dependencies:

```bash
cd ../server
npm install
```

Installing server dependencies is required before running `npm start`, because the server uses `tsx` to run TypeScript directly.

### 3. Configure environment variables

Create `server/.env` from the example file:

```bash
cd server
cp .env.example .env
```

Update `server/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/social-scheduler
JWT_SECRET=replace-with-a-long-random-secret

ZERNIO_API_KEY=replace-with-your-zernio-api-key

CLOUDINARY_CLOUD_NAME=replace-with-your-cloudinary-cloud-name
CLOUDINARY_API_KEY=replace-with-your-cloudinary-api-key
CLOUDINARY_API_SECRET=replace-with-your-cloudinary-api-secret

HF_TOKEN=replace-with-your-hugging-face-token
HF_IMAGE_MODEL=Qwen/Qwen-Image
HF_IMAGE_PROVIDER=fal-ai
HF_IMAGE_STEPS=5
HF_IMAGE_WIDTH=1024
HF_IMAGE_HEIGHT=1024
```

Client API base URL is optional. If needed, create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Running Locally

Start the backend:

```bash
cd server
npm start
```

The API runs at:

```text
http://localhost:3000
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

## Available Scripts

### Client

```bash
npm run dev       # Start Vite development server
npm run build     # Type-check and build production assets
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

### Server

```bash
npm start         # Start server with tsx
npm run server    # Start server with nodemon + tsx
npm run build     # Compile TypeScript
```

## API Overview

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in and receive JWT | No |
| GET | `/api/accounts` | Get connected/manual accounts | Yes |
| POST | `/api/accounts` | Add an account record | Yes |
| DELETE | `/api/accounts/:id` | Disconnect an account | Yes |
| GET | `/api/oauth/:platform` | Generate Zernio connect URL | Yes |
| GET | `/api/oauth/sync` | Sync connected Zernio accounts | Yes |
| GET | `/api/posts` | Get user posts | Yes |
| POST | `/api/posts` | Schedule a post with optional media | Yes |
| POST | `/api/posts/generate` | Generate caption and optional image | Yes |
| GET | `/api/posts/generations` | Get AI generation history | Yes |
| GET | `/api/activity` | Get user activity feed | Yes |

## Data Models

### User

Stores authentication identity, encrypted password, and optional Zernio profile ID.

### Account

Stores connected platform, handle, avatar, Zernio account ID, token metadata, and connection status.

### Post

Stores post content, selected platforms, media URL, media type, scheduled time, and status.

Supported statuses:

- `draft`
- `scheduled`
- `published`
- `failed`

### Generation

Stores AI-generated captions, prompts, tone, generated image URL, image status, and image errors.

### ActivityLog

Stores publishing and AI-related activity events for the dashboard.

## Scheduler Service

The backend uses `node-cron` to evaluate scheduled posts every minute.

When a scheduled post is due:

1. The service finds connected Zernio accounts for the selected platforms.
2. It creates a publishing payload with caption and optional media.
3. It sends the post to Zernio.
4. It marks the post as `published` on success.
5. It marks the post as `failed` if publishing fails.
6. It writes an activity log entry for successful publishing.

## AI Image Generation

AI image generation uses Hugging Face Inference Providers.

Default configuration:

```env
HF_IMAGE_MODEL=Qwen/Qwen-Image
HF_IMAGE_PROVIDER=fal-ai
HF_IMAGE_STEPS=5
HF_IMAGE_WIDTH=1024
HF_IMAGE_HEIGHT=1024
```

If Cloudinary is configured, generated image buffers are uploaded to Cloudinary and stored as permanent public URLs. If Cloudinary is not configured, generated images can fall back to data URLs, but stable public URLs are recommended for real publishing.

## Media Uploads

Uploaded media is handled with Multer memory storage and uploaded to Cloudinary from the backend.

Cloudinary credentials are required for user-uploaded media:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Troubleshooting

### `tsx: command not found`

Run `npm install` inside the `server` directory:

```bash
cd server
npm install
npm start
```

### `401 Unauthorized` on API requests

Log in again so the client stores a valid JWT token. Protected endpoints require:

```text
Authorization: Bearer <token>
```

### Cloudinary configuration error

Add all required Cloudinary keys to `server/.env`, then restart the backend.

### Hugging Face permission error

Create or update a Hugging Face token with Inference Providers access, update `HF_TOKEN`, then restart the backend.

### Scheduled posts are not publishing

Check that:

- The backend server is running.
- MongoDB is connected.
- `ZERNIO_API_KEY` is configured.
- Social accounts are synced and have `connected` status.
- The post has `status: scheduled`.
- `scheduledFor` is due or in the past.

## Build Verification

Run these before deployment:

```bash
cd client
npm run lint
npm run build

cd ../server
npm run build
```

## License

This project is available for learning, portfolio, and development use. Add a license file before using it in production or distributing it publicly.
