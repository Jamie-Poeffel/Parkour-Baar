# Parkour Baar

Website and member area for the Parkour Baar club (parkourbaar.ch).

**Stack:** Next.js 16 (App Router), React 19, Tailwind 4, Clerk (auth), Firestore (`firebase-admin`), Axiom (logging).

## Development

```bash
npm install
npm run dev      # http://localhost (port 80, see package.json)
npm run lint
npm run build
```

Required environment variables live in a single root `.env` (copy `.env.example`; never committed). Deploy derives its files from it, so there is no second copy to keep in sync:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk auth |
| `CLERK_WEBHOOK_SECRET` | Verifies `/api/webhooks/clerk` (svix) |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Firestore |
| `AXIOM_TOKEN`, `AXIOM_DATASET` | Logging |
| `NEXT_PUBLIC_GA_ID` | Google Analytics (loaded only after cookie consent) |

## Structure

- `proxy.ts` – Clerk middleware: route protection, request id, request log.
- `app/` – public pages (`/`, `/training`, `/kontakt`), member area (`/mitglieder`, `/abmelden`), admin (`/dashboard/*`).
- `app/actions.ts` – admin server actions (site content). Admin only.
- `lib/auth.ts` – `requirePermission()`; call it in **every** server action.
- `lib/axiom/` – logging. Every log carries `userId`, `sessionId`, `role`, `requestId`, `pathname`.
- `instrumentation.ts` – logs uncaught server errors.
- `utils/` – Firestore data access, roles/permissions, session grouping.

## Roles

`admin` and `member` come from Clerk `publicMetadata.role`; permissions are mapped in `utils/permissions.ts`.

## Logging

Query the Axiom dataset by `sessionId` to follow one session, by `userId` for one person, or by `requestId` for one request.
Useful messages: `request.completed`, `action:<name>`, `action:<name>:error`, `client.error`, `auth:forbidden`, `auth:session.*` (Clerk webhook).

## Deployment

- Oracle ARM64: no CI. `make publish` builds and pushes the image to GHCR, then `make deploy OCI_PUBLIC_IP=...` runs `deploy/deploy.ps1` (docker compose + Cloudflare tunnel).
- Terraform: `terraform/` (Oracle). State and secrets are gitignored.

## Maintenance mode

On the server a small `gateway` container sits in front of the app (Cloudflare tunnel → gateway → `web`). During a maintenance window it serves a 503 maintenance page (also whenever the app is down), pauses the active UptimeRobot monitors 60s before the start, and resumes exactly those 30s after the end.

```
make maintenance OCI_PUBLIC_IP=IP FROM="2026-11-20 22:00" TO="2026-11-21 02:00" MESSAGE="Datenbank-Update"
make maintenance-status OCI_PUBLIC_IP=IP
make maintenance-off OCI_PUBLIC_IP=IP     # end early, resumes monitors
```

Times are in your local machine time. Dates can be changed any time without redeploying. For UptimeRobot, copy `deploy/gateway.env.example` to `deploy/gateway.env` and set the main API key, then `make deploy`.
