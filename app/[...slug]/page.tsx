import { notFound } from "next/navigation";
import { requestLogger } from "@/lib/axiom/request-logger";

// Matches only URLs no other route handles, so this is where real 404s are
// logged. (app/not-found.tsx is also rendered on normal requests, so it must
// not log.)
//
// The path comes from the route params, not the x-pathname header: the proxy
// matcher skips URLs with static extensions (e.g. /.next/server/app/page.js),
// so that header is missing for exactly the probes we want to see here.
export default async function UnknownRoute({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  await requestLogger.warn("request.not_found", {
    pathname: "/" + slug.map(safeDecode).join("/"),
  });

  notFound();
}

function safeDecode(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
