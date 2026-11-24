export const dynamic = "force-dynamic";

// Liveness probe for Docker. Excluded from proxy.ts so it is neither
// authenticated nor logged.
export function GET() {
    return new Response("ok", {
        status: 200,
        headers: { "cache-control": "no-store" },
    });
}
