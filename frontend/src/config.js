// Base URL of the FastAPI backend.
// - Local dev: '/api' (proxied to http://localhost:8000 by vite.config.js)
// - Production: set VITE_API_URL at build time (e.g. the Hugging Face Space URL)
export const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
