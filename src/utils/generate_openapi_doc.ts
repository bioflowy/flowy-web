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
import { GetJobByNodeNameSchema, JobListSchema, JobSchema, JobUpdateInputSchema, JobWithInputOutputSchema } from "../schema/job";
import { ResourceSchema, ResourceUpdateSchema } from "../schema/resource";

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
registry.registerPath({
  method: "get",
  path: "/jobs",
  description: "report node status from flowy daemon",
  summary: "get jobs by nodeName",
  request: {
    body: {
      content: {
        "application/json": {
          schema: GetJobByNodeNameSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Object with job data.",
      content: {
        "application/json": {
          schema: JobListSchema,
        },
      },
    },
  },
});
registry.registerPath({
  method: "get",
  path: "/jobs/{jobId}",
  description: "report node status from flowy daemon",
  summary: "get jobs by nodeName",
  request: {
    params: z.object({ jobId: z.number().int() }),
  },
  responses: {
    200: {
      description: "Object with job data.",
      content: {
        "application/json": {
          schema: JobWithInputOutputSchema,
        },
      },
    },
  },
});
registry.registerPath({
  method: "post",
  path: "/jobs/{jobId}",
  description: "report node status from flowy daemon",
  summary: "get jobs by nodeName",
  request: {
    params: z.object({ jobId: z.number().int() }),
    body: {
      content: {
        "application/json": {
          schema: JobUpdateInputSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Object with job data.",
    },
  },
});
registry.registerPath({
  method: "get",
  path: "/resources/{resourceId}",
  description: "report node status from flowy daemon",
  summary: "get jobs by nodeName",
  request: {
    params: z.object({ resourceId: z.number().int() }),
  },
  responses: {
    200: {
      description: "Updated successfully.",
      content: {
        "application/json": {
          schema: ResourceSchema,
        },
      },
    },
  },
});
registry.registerPath({
  method: "post",
  path: "/resources/{resourceId}",
  description: "report node status from flowy daemon",
  summary: "get jobs by nodeName",
  request: {
    params: z.object({ resourceId: z.number().int() }),
    body: {
      content: {
        "application/json": {
          schema: ResourceUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Object with job data.",
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
