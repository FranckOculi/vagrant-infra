import { getLog, postLog } from "../controllers/logController.js";
import { getLogSchema, postLogSchema } from "../schemas/logSchema.js";

async function logRoutes(fastify) {
  fastify.route({
    method: "POST",
    url: "/",
    schema: postLogSchema,
    handler: postLog,
  });

  fastify.route({
    method: "GET",
    url: "/",
    schema: getLogSchema,
    handler: getLog,
  });
}

export default logRoutes;
