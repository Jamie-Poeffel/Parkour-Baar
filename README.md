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

Required environment variables live in a single root `.env` (copy `.env.example`; never committed). Deploy and Terraform derive their files from it, so there is no second copy to keep in sync (`make sync-env` regenerates `terraform-aws/app-secrets.json`):

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

- Oracle ARM64: `.github/workflows/oci-image.yml` builds the image to GHCR; `make deploy OCI_PUBLIC_IP=...` runs `deploy/deploy.ps1` (docker compose + Cloudflare tunnel).
- Vercel: `.github/workflows/deploy.yml` on the `release` branch.
- Terraform: `terraform/` (Oracle), `terraform-aws/`. State and secrets are gitignored.
