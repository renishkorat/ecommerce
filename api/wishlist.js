import handleJsonResource from "../lib/handleJsonResource.js";

export default function handler(req, res) {
  return handleJsonResource(req, res, "wishlist");
}
