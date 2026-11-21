import jsonServer from "json-server";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const db = require("../db.json");

const server = jsonServer.create();
server.use(jsonServer.defaults());
server.use(jsonServer.router(db));

export default function handler(req, res) {
  const queryIndex = req.url.indexOf("?");
  const pathname = queryIndex === -1 ? req.url : req.url.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : req.url.slice(queryIndex);
  req.url = pathname.replace(/^\/api/, "") + query;

  return server(req, res);
}
