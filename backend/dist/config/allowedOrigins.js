"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOriginAllowed = isOriginAllowed;
const LOCAL_ORIGIN_PATTERNS = [
    /^http:\/\/localhost(:\d+)?$/i,
    /^http:\/\/127\.0\.0\.1(:\d+)?$/i,
];
/** Vercel production, preview, and team deployment URLs */
const VERCEL_ORIGIN_PATTERN = /^https:\/\/[a-z0-9][a-z0-9-]*[a-z0-9](-[a-z0-9-]+)*\.vercel\.app$/i;
function parseExtraOrigins() {
    const fromList = process.env.CORS_ORIGINS?.split(",").map((o) => o.trim()) ?? [];
    const singles = [
        process.env.FRONTEND_URL,
        process.env.VERCEL_FRONTEND_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    ].filter((o) => Boolean(o));
    return [...fromList, ...singles];
}
const extraOrigins = parseExtraOrigins();
function isOriginAllowed(origin) {
    if (!origin)
        return true;
    if (extraOrigins.includes(origin))
        return true;
    if (LOCAL_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin))) {
        return true;
    }
    if (VERCEL_ORIGIN_PATTERN.test(origin))
        return true;
    return false;
}
