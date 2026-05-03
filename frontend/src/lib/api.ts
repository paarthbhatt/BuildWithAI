const fallbackApiBaseUrl = "http://localhost:8010";

const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL = (configuredBaseUrl || fallbackApiBaseUrl).replace(/\/+$/, "");
