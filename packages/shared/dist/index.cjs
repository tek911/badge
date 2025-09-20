"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DEFAULT_PAGE_SIZE: () => DEFAULT_PAGE_SIZE,
  InventoryClient: () => InventoryClient,
  createProblemDetails: () => createProblemDetails,
  normalizePagination: () => normalizePagination,
  sendDeploymentEvent: () => sendDeploymentEvent
});
module.exports = __toCommonJS(src_exports);

// src/utils/pagination.ts
var DEFAULT_PAGE_SIZE = 25;
function normalizePagination(query) {
  const size = Math.min(Math.max(query.size ?? DEFAULT_PAGE_SIZE, 1), 100);
  return { size, after: query.after ?? "" };
}

// src/utils/problemDetails.ts
function createProblemDetails(init) {
  return {
    type: init.type,
    title: init.title,
    status: init.status,
    detail: init.detail,
    instance: init.instance,
    errors: init.errors
  };
}

// src/sdk/client.ts
var import_axios = __toESM(require("axios"), 1);
var import_zod = require("zod");
var ListApplicationsResponse = import_zod.z.object({
  data: import_zod.z.array(
    import_zod.z.object({
      id: import_zod.z.string(),
      name: import_zod.z.string(),
      criticality: import_zod.z.string(),
      primaryCloud: import_zod.z.string(),
      tags: import_zod.z.array(import_zod.z.record(import_zod.z.string(), import_zod.z.any()))
    })
  ),
  meta: import_zod.z.object({
    nextCursor: import_zod.z.string().nullable().optional()
  })
});
var InventoryClient = class {
  constructor(baseURL, token) {
    const defaultToken = token ?? "demo.admin@example.com";
    this.http = import_axios.default.create({
      baseURL,
      headers: { Authorization: `Bearer ${defaultToken}` }
    });
  }
  async listApplications(params = {}) {
    const response = await this.http.get("/v1/applications", { params });
    return ListApplicationsResponse.parse(response.data);
  }
};

// src/ci/sendDeploymentEvent.ts
var import_node_crypto = __toESM(require("crypto"), 1);
var import_node_process = __toESM(require("process"), 1);
var import_axios2 = __toESM(require("axios"), 1);
async function sendDeploymentEvent(event, options) {
  const secret = options?.secret ?? import_node_process.default.env.HMAC_SECRET;
  const url = options?.url ?? import_node_process.default.env.API_URL;
  if (!secret) {
    throw new Error("Missing HMAC secret");
  }
  if (!url) {
    throw new Error("Missing API URL");
  }
  const payload = JSON.stringify({ ...event, timestamp: event.timestamp ?? (/* @__PURE__ */ new Date()).toISOString() });
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const signature = import_node_crypto.default.createHmac("sha256", secret).update(payload).digest("hex");
  await import_axios2.default.post(`${url}/v1/ingest/ci-event`, payload, {
    headers: {
      "Content-Type": "application/json",
      "X-Signature": `sha256=${signature}`,
      "X-Timestamp": timestamp
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_PAGE_SIZE,
  InventoryClient,
  createProblemDetails,
  normalizePagination,
  sendDeploymentEvent
});
