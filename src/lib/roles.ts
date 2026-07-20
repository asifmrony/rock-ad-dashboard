// Role-based page access. Roles are written to localStorage at login
// (see AuthContext); exactly one role key is set per session.

export type Role = "admin" | "bingePlus" | "pran" | "bkash" | "mtb";

/** localStorage flags set at login, checked in priority order. */
const ROLE_KEYS: { key: string; role: Role }[] = [
  { key: "bingePlusAdmin", role: "bingePlus" },
  { key: "isPranAdmin", role: "pran" },
  { key: "isBkashAdmin", role: "bkash" },
  { key: "isMtbAdmin", role: "mtb" },
];

/** Every role flag, so logout can clear them all. */
export const ROLE_STORAGE_KEYS = ROLE_KEYS.map(({ key }) => key);

/** Resolves the current role; no flag set means the full-access admin. */
export const getRole = (): Role => {
  const match = ROLE_KEYS.find(
    ({ key }) => localStorage.getItem(key) === "true",
  );
  return match ? match.role : "admin";
};

/**
 * Pages each role may reach. The first entry doubles as that role's landing
 * page, used when it lands on a route it isn't allowed to see.
 */
export const ROLE_PATHS: Record<Role, string[]> = {
  admin: ["/", "/midroll", "/ads", "/advertisers", "/campaigns"],
  bingePlus: ["/", "/midroll"],
  // Vast Analytics only
  bkash: ["/"],
  // Midroll Analytics only
  pran: ["/midroll"],
  mtb: ["/midroll"],
};

// "/" must match exactly; everything else also covers nested routes
// (e.g. /ads/create belongs to /ads).
const matchesPath = (pathname: string, allowed: string) =>
  allowed === "/" ? pathname === "/" : pathname.startsWith(allowed);

export const canAccess = (pathname: string, role: Role): boolean =>
  ROLE_PATHS[role].some((allowed) => matchesPath(pathname, allowed));

export const getDefaultPath = (role: Role): string => ROLE_PATHS[role][0];
