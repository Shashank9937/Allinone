import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, normalize, resolve } from "node:path";

const PORT = Number(process.env.PORT || 10000);
const DIST_DIR = resolve(process.cwd(), "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  const ext = extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  createReadStream(filePath).pipe(res);
}

function safePathFromUrl(urlPath) {
  const cleaned = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const candidate = resolve(DIST_DIR, `.${cleaned}`);
  if (!candidate.startsWith(DIST_DIR)) return null;
  return candidate;
}

async function readJsonBody(req, maxBytes = 1_000_000) {
  return new Promise((resolvePromise, rejectPromise) => {
    let raw = "";
    let total = 0;

    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        rejectPromise(new Error("Payload too large"));
        req.destroy();
        return;
      }
      raw += chunk.toString("utf8");
    });

    req.on("end", () => {
      try {
        resolvePromise(raw ? JSON.parse(raw) : {});
      } catch (err) {
        rejectPromise(new Error("Invalid JSON body"));
      }
    });

    req.on("error", (err) => {
      rejectPromise(err);
    });
  });
}

function extractChatText(data) {
  if (!data) return "";
  const message = data.choices?.[0]?.message?.content;
  if (typeof message === "string") return message;
  if (Array.isArray(message)) {
    return message.map((item) => item?.text || "").join("\n");
  }
  return "";
}

function extractAnthropicText(data) {
  if (!data) return "";
  const content = data.content;
  if (!Array.isArray(content)) return "";
  return content
    .map((item) => {
      if (typeof item === "string") return item;
      if (item?.type === "text") return item.text || "";
      return "";
    })
    .join("\n")
    .trim();
}

const server = createServer((req, res) => {
  const requestPath = (req.url || "/").split("?")[0] || "/";

  if (req.method === "POST" && requestPath === "/api/openai") {
    (async () => {
      if (!process.env.OPENAI_API_KEY) {
        sendJson(res, 500, { error: "OPENAI_API_KEY is not set on server." });
        return;
      }

      try {
        const body = await readJsonBody(req);
        const prompt = String(body.prompt || "").trim();
        const system =
          String(body.system || "").trim() || "You are a pragmatic startup execution copilot.";
        const model = String(body.model || "").trim() || "gpt-4o-mini";
        const temperature = typeof body.temperature === "number" ? body.temperature : 0.7;

        if (!prompt) {
          sendJson(res, 400, { error: "Prompt is required." });
          return;
        }

        const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            temperature,
            messages: [
              { role: "system", content: system },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (!upstream.ok) {
          const text = await upstream.text();
          sendJson(res, upstream.status, { error: text || "OpenAI request failed." });
          return;
        }

        const data = await upstream.json();
        sendJson(res, 200, { content: extractChatText(data) });
      } catch (err) {
        sendJson(res, 500, { error: err.message || "Unexpected server error." });
      }
    })();
    return;
  }

  if (req.method === "POST" && requestPath === "/api/anthropic") {
    (async () => {
      if (!process.env.ANTHROPIC_API_KEY) {
        sendJson(res, 500, { error: "ANTHROPIC_API_KEY is not set on server." });
        return;
      }

      try {
        const body = await readJsonBody(req);
        const prompt = String(body.prompt || "").trim();
        const system =
          String(body.system || "").trim() || "You are a pragmatic startup execution copilot.";
        const model = String(body.model || "").trim() || "claude-3-5-sonnet-latest";
        const temperature = typeof body.temperature === "number" ? body.temperature : 0.3;
        const maxTokens = typeof body.max_tokens === "number" ? body.max_tokens : 1200;

        if (!prompt) {
          sendJson(res, 400, { error: "Prompt is required." });
          return;
        }

        const upstream = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model,
            max_tokens: maxTokens,
            temperature,
            system,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!upstream.ok) {
          const text = await upstream.text();
          sendJson(res, upstream.status, { error: text || "Anthropic request failed." });
          return;
        }

        const data = await upstream.json();
        sendJson(res, 200, { content: extractAnthropicText(data) });
      } catch (err) {
        sendJson(res, 500, { error: err.message || "Unexpected server error." });
      }
    })();
    return;
  }

  const isRoot = requestPath === "/";
  const filePath = isRoot ? resolve(DIST_DIR, "index.html") : safePathFromUrl(requestPath);

  if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
    sendFile(res, filePath);
    return;
  }

  const indexPath = resolve(DIST_DIR, "index.html");
  if (existsSync(indexPath)) {
    sendFile(res, indexPath);
    return;
  }

  res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Build output not found. Run `npm run build` first.");
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`FounderOS server listening on port ${PORT}`);
});
