import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const db = require("../db.json");

const generateId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  if (typeof req.body !== "undefined") {
    return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
  }

  let body = "";
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}

export default async function handleJsonResource(req, res, resource, routeId) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 204, null);
  }

  const queryIndex = req.url.indexOf("?");
  const pathname = queryIndex === -1 ? req.url : req.url.slice(0, queryIndex);
  const pathSegments = pathname.replace(/^\/+|\/+$/g, "").split("/");
  const query = new URLSearchParams(queryIndex === -1 ? "" : req.url.slice(queryIndex));
  const lastSegment = pathSegments[pathSegments.length - 1];
  const id =
    routeId ||
    query.get("id") ||
    (lastSegment === resource ? null : decodeURIComponent(lastSegment));

  if (!Object.prototype.hasOwnProperty.call(db, resource)) {
    return sendJson(res, 404, { message: "Resource not found" });
  }

  const collection = db[resource];

  if (req.method === "GET") {
    if (id) {
      const item = collection.find((entry) => String(entry.id) === String(id));
      return item
        ? sendJson(res, 200, item)
        : sendJson(res, 404, { message: "Item not found" });
    }

    const filtered = collection.filter((entry) =>
      [...query.entries()].every(
        ([key, value]) =>
          key === "id" || key.startsWith("_") || String(entry[key]) === value
      )
    );
    return sendJson(res, 200, filtered);
  }

  const body = await readBody(req);

  if (req.method === "POST" && !id) {
    const item = { ...body, id: body.id || generateId() };
    collection.push(item);
    return sendJson(res, 201, item);
  }

  if ((req.method === "PATCH" || req.method === "PUT") && id) {
    const index = collection.findIndex((entry) => String(entry.id) === String(id));
    if (index === -1) return sendJson(res, 404, { message: "Item not found" });

    collection[index] =
      req.method === "PUT"
        ? { ...body, id }
        : { ...collection[index], ...body };
    return sendJson(res, 200, collection[index]);
  }

  if (req.method === "DELETE" && id) {
    const index = collection.findIndex((entry) => String(entry.id) === String(id));
    if (index === -1) return sendJson(res, 404, { message: "Item not found" });

    const [deleted] = collection.splice(index, 1);
    return sendJson(res, 200, deleted);
  }

  return sendJson(res, 405, { message: "Method not allowed" });
}
