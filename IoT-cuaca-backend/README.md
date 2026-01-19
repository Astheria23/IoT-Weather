# IoT-cuaca-backend

Minimal backend for IoT weather dashboard (Fiber + MongoDB).

## Required environment variables
Create a `.env` file based on `.env.example` and set values for:

- `MONGO_URI` — MongoDB connection string (e.g., `mongodb://localhost:27017`)
- `DB_NAME` — Database name (e.g., `weatherdb`)
- `JWT_SECRET` — secret for signing JWT tokens
- `IOT_API_KEY` — API key expected from IoT devices when posting to `/api/sensor`

## Run locally
1. Start MongoDB (e.g., via Docker or local install).
2. Create a `.env` file in this folder (copy `.env.example`).
3. (Optional) Seed an admin user:

```bash
cd cmd/seed
go run main.go
```

4. Run the server:

```bash
go run main.go
```

Server listens on `:3000` by default.

## Realtime WebSocket
Clients can connect to `ws://<API_HOST>/ws` to receive realtime JSON messages when new sensor data is ingested.

Example message payload:

```json
{
  "id": "...",
  "temp": 24.5,
  "rain_level": 0,
  "wind_speed": 5.2,
  "created_at": "2026-01-18T12:34:56.789Z"
}
```

## Notes
- CORS is permissive (`*`) for development in the current setup. Consider restricting `AllowOrigins` in production.
- The WebSocket hub is a simple in-memory broadcaster. For horizontal scaling consider using Redis/pubsub or another message broker.
