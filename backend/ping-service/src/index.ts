import express, { Request, Response } from "express";
import fetch, { type Response as FetchResponse } from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5003;

// Services to ping
const SERVICES: string[] = [
  "https://vartax.onrender.com",
  "https://vartax-1.onrender.com",
  "https://vartax-3.onrender.com",
];

const TIMEOUT_MS = 5000;
const MAX_RETRIES = 2;


// Fetch with timeout

async function fetchWithTimeout(url: string): Promise<FetchResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, {
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

// Ping logic with retry

async function pingWithRetry(url: string) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(url);

      return {
        url,
        alive: true,
        status: res.status,
        attempts: attempt,
      };
    } catch (err: any) {
      if (attempt === MAX_RETRIES) {
        return {
          url,
          alive: false,
          attempts: attempt,
          error:
            err?.name === "AbortError"
              ? "Timeout"
              : err?.message || "Unknown error",
        };
      }
    }
  }
}

// Routes

app.get("/health", (_: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "master-ping",
    uptime: process.uptime(),
  });
});

app.get("/ping-all", async (_: Request, res: Response) => {
  const results = [];

  for (const url of SERVICES) {
    const result = await pingWithRetry(url);
    results.push(result);
  }

  res.json({
    success: true,
    checkedAt: new Date().toISOString(),
    services: results,
  });
});

app.get("/", (_: Request, res: Response) => {
  res.send("Master Ping Service Running");
});

app.listen(PORT, () => {
  console.log(`Master Ping running on port ${PORT}`);
});
