import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import * as yaml from "js-yaml";
import * as fs from "fs/promises";
import {} from "@asteasolutions/zod-to-openapi";
import { NodeUpdateSchema } from "../schema/node";

extendZodWithOpenApi(z);
const registry = new OpenAPIRegistry();
const NodeUpdateSchema2 = registry.register("nodeUpdate", NodeUpdateSchema);

registry.registerPath({
  method: "post",
  path: "/node",
  description: "report node status from flowy daemon",
  summary: "Get a single job",
  request: {
    body: {
      content: {
        "application/json": {
          schema: NodeUpdateSchema2,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Object with job data.",
      content: {
        "application/json": {
          schema: z.object({status: z.string()}),
        },
      },
    },
  },
});

async function writeOpenApiDoc() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  generator;
  const doc = generator.generateDocument({
    openapi:  '3.0.0',
    info: {
      version: "1.0.0",
      title: "My API",
      description: "This is the API",
    },
    servers: [{ url: "http://localhost:3000/api" }],
  });
  await fs.writeFile("openapi.yaml", yaml.dump(doc), "utf-8");
}

writeOpenApiDoc().catch((e) => {
  console.log(e);
});
