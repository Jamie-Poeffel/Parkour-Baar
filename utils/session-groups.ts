/**
 * Utilities for grouping training sessions.
 *
 * Sessions can be "linked" together (e.g. Tuesday + Thursday are one unit).
 * buildGroups collects linked sessions into a single Group so the UI can
 * display them together and allow batch registration.
 */

import type { Session } from "@/utils/site-data";

/** Maps German weekday names to JavaScript Date.getDay() values (0 = Sunday). */
export const DAY_INDEX: Record<string, number> = {
    Sonntag: 0,
    Montag: 1,
    Dienstag: 2,
    Mittwoch: 3,
    Donnerstag: 4,
    Freitag: 5,
    Samstag: 6,
};

/** A single session or a pair of linked sessions treated as one unit. */
export type Group = { sessions: Session[]; linked: boolean };

/**
 * Converts a flat session list into groups.
 * Linked sessions (via Session.linkedTo) are combined into one Group.
 * Each session appears in exactly one group.
 */
export function buildGroups(sessions: Session[]): Group[] {
    const visited = new Set<string>();
    const groups: Group[] = [];

    for (const s of sessions) {
        if (visited.has(s.id)) continue;
        visited.add(s.id);

        if (s.linkedTo) {
            const linked = sessions.find((x) => x.id === s.linkedTo);
            if (linked && !visited.has(linked.id)) {
                visited.add(linked.id);
                groups.push({ sessions: [s, linked], linked: true });
                continue;
            }
        }

        const linksToThis = sessions.find(
            (x) => x.linkedTo === s.id && !visited.has(x.id),
        );
        if (linksToThis) {
            visited.add(linksToThis.id);
            groups.push({ sessions: [s, linksToThis], linked: true });
            continue;
        }

        groups.push({ sessions: [s], linked: false });
    }

    return groups;
}
