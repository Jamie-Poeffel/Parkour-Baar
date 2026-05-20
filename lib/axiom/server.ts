import { Axiom } from "@axiomhq/js";
import { Logger, AxiomJSTransport, ConsoleTransport } from "@axiomhq/logging";
import { createAxiomRouteHandler, nextJsFormatters } from "@axiomhq/nextjs";

const axiomClient = new Axiom({ token: process.env.AXIOM_TOKEN!, edge: "eu-central-1.aws.edge.axiom.co" });

export const logger = new Logger({
    transports: [
        new AxiomJSTransport({
            axiom: axiomClient,
            dataset: process.env.AXIOM_DATASET!,
        }),
        ...(process.env.NODE_ENV !== "production"
            ? [new ConsoleTransport({ prettyPrint: true })]
            : []),
    ],
    formatters: nextJsFormatters,
});

export const withAxiomRoute = createAxiomRouteHandler(logger);
