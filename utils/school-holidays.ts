const DAY_MS = 86_400_000;

/**
 * School-free days in Kanton Zug (valid for Gemeinde Baar), school years
 * 2026/27 – 2030/31. Training does not take place on these days.
 *
 * Source: Amt für gemeindliche Schulen, "Schulferien 2026/27 bis 2030/31"
 * (28.05.2026), https://zg.ch/schulferien
 *
 * Ranges are inclusive, ISO format (YYYY-MM-DD). Extend this list when the
 * canton publishes the next five-year plan; HOLIDAYS_COVERED_UNTIL must be
 * moved forward at the same time.
 */
export const SCHOOL_FREE_RANGES: ReadonlyArray<readonly [string, string]> = [
    // 2026/27 (Herbstferien bis 18.10.2026 sind bereits vorbei)
    ["2026-12-08", "2026-12-08"], // Mariä Empfängnis
    ["2026-12-19", "2027-01-03"], // Weihnachtsferien
    ["2027-02-06", "2027-02-21"], // Sportferien
    ["2027-03-26", "2027-03-26"], // Karfreitag
    ["2027-03-29", "2027-03-29"], // Ostermontag
    ["2027-04-17", "2027-05-02"], // Frühlingsferien
    ["2027-05-06", "2027-05-09"], // Auffahrtsferien
    ["2027-05-17", "2027-05-17"], // Pfingstmontag
    ["2027-05-27", "2027-05-27"], // Fronleichnam
    ["2027-07-03", "2027-08-15"], // Sommerferien

    // 2027/28
    ["2027-10-02", "2027-10-17"], // Herbstferien
    ["2027-11-01", "2027-11-01"], // Allerheiligen
    ["2027-12-08", "2027-12-08"], // Mariä Empfängnis
    ["2027-12-23", "2028-01-05"], // Weihnachtsferien
    ["2028-02-05", "2028-02-20"], // Sportferien
    ["2028-04-14", "2028-04-14"], // Karfreitag
    ["2028-04-15", "2028-04-30"], // Frühlingsferien
    ["2028-05-25", "2028-05-28"], // Auffahrtsferien
    ["2028-06-05", "2028-06-05"], // Pfingstmontag
    ["2028-06-15", "2028-06-15"], // Fronleichnam
    ["2028-07-08", "2028-08-20"], // Sommerferien

    // 2028/29
    ["2028-10-07", "2028-10-22"], // Herbstferien
    ["2028-11-01", "2028-11-01"], // Allerheiligen
    ["2028-12-08", "2028-12-08"], // Mariä Empfängnis
    ["2028-12-23", "2029-01-07"], // Weihnachtsferien
    ["2029-02-03", "2029-02-18"], // Sportferien
    ["2029-03-30", "2029-03-30"], // Karfreitag
    ["2029-04-02", "2029-04-02"], // Ostermontag
    ["2029-04-14", "2029-04-29"], // Frühlingsferien
    ["2029-05-10", "2029-05-13"], // Auffahrtsferien
    ["2029-05-21", "2029-05-21"], // Pfingstmontag
    ["2029-05-31", "2029-05-31"], // Fronleichnam
    ["2029-07-07", "2029-08-19"], // Sommerferien

    // 2029/30
    ["2029-10-06", "2029-10-21"], // Herbstferien
    ["2029-11-01", "2029-11-01"], // Allerheiligen
    ["2029-12-22", "2030-01-06"], // Weihnachtsferien
    ["2030-02-02", "2030-02-17"], // Sportferien
    ["2030-04-13", "2030-04-28"], // Frühlingsferien
    ["2030-05-30", "2030-06-02"], // Auffahrtsferien
    ["2030-06-10", "2030-06-10"], // Pfingstmontag
    ["2030-06-20", "2030-06-20"], // Fronleichnam
    ["2030-07-06", "2030-08-18"], // Sommerferien

    // 2030/31
    ["2030-10-05", "2030-10-20"], // Herbstferien
    ["2030-11-01", "2030-11-01"], // Allerheiligen
    ["2030-12-21", "2031-01-05"], // Weihnachtsferien
    ["2031-02-01", "2031-02-16"], // Sportferien
    ["2031-04-11", "2031-04-11"], // Karfreitag
    ["2031-04-12", "2031-04-27"], // Frühlingsferien
    ["2031-05-22", "2031-05-25"], // Auffahrtsferien
    ["2031-06-02", "2031-06-02"], // Pfingstmontag
    ["2031-06-12", "2031-06-12"], // Fronleichnam
    ["2031-07-05", "2031-08-17"], // Sommerferien
];

/**
 * Days that are only free in Gemeinde Baar (not in the whole canton), e.g.
 * the Chilbi. Same format as above: [from, to], inclusive, ISO dates.
 * Merged into SCHOOL_FREE_DAYS below.
 */
export const BAAR_FREE_RANGES: ReadonlyArray<readonly [string, string]> = [
    ...Array.from({ length: 6 }, (_, i) => chilbiBaar(2026 + i)),
];

/**
 * Chilbi Baar: three days (Saturday–Monday) on the weekend after St. Martin
 * (11 November). If 11 November is a Saturday, that weekend is the Chilbi.
 * So the Saturday is the first Saturday on or after 11 November.
 */
function chilbiBaar(year: number): readonly [string, string] {
    const martin = Date.UTC(year, 10, 11);
    const daysToSaturday = (6 - new Date(martin).getUTCDay() + 7) % 7;
    const saturday = martin + daysToSaturday * DAY_MS;
    const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
    return [iso(saturday), iso(saturday + 2 * DAY_MS)];
}

/** Last day for which the list above is complete. */
export const HOLIDAYS_COVERED_UNTIL = "2031-08-17";

function toUtc(iso: string): number {
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
}

/** Set of every school-free day as an ISO date string. */
export const SCHOOL_FREE_DAYS: ReadonlySet<string> = (() => {
    const days = new Set<string>();
    for (const [from, to] of [...SCHOOL_FREE_RANGES, ...BAAR_FREE_RANGES]) {
        for (let t = toUtc(from); t <= toUtc(to); t += DAY_MS) {
            days.add(new Date(t).toISOString().slice(0, 10));
        }
    }
    return days;
})();

/** ISO date (YYYY-MM-DD) of a Date's local calendar day. */
export function localIso(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** True if training takes place on this calendar day (no holiday, no free day). */
export function isTrainingDay(d: Date): boolean {
    return !SCHOOL_FREE_DAYS.has(localIso(d));
}

/**
 * Next real training on the given weekday (0 = Sunday … 6 = Saturday), counting
 * today, skipping holidays and free days. Returns local midnight of that day.
 */
export function nextTrainingDate(
    dayIndex: number,
    from: Date = new Date(),
): Date {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + ((dayIndex - d.getDay() + 7) % 7));
    // At most one year ahead; past HOLIDAYS_COVERED_UNTIL nothing is excluded.
    for (let i = 0; i < 60 && !isTrainingDay(d); i++) {
        d.setDate(d.getDate() + 7);
    }
    return d;
}

/** The next `count` real training days on the given weekday. */
export function nextTrainingDates(
    dayIndex: number,
    count: number,
    from: Date = new Date(),
): Date[] {
    const dates: Date[] = [];
    let cursor = from;
    for (let i = 0; i < count; i++) {
        const d = nextTrainingDate(dayIndex, cursor);
        dates.push(d);
        cursor = new Date(d);
        cursor.setDate(d.getDate() + 1);
    }
    return dates;
}

/** Today's date (YYYY-MM-DD) in Zurich, independent of the server timezone. */
export function zurichToday(): string {
    return new Date().toLocaleDateString("sv-SE", {
        timeZone: "Europe/Zurich",
    });
}
