import fastify from "fastify";
import cors from "@fastify/cors";
import logRoutes from "./routes/logRoutes.js";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import ejs from "ejs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = fastify({
  logger: process.env.NODE_ENV === "test" ? false : true,
});

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

// Cors
app.register(cors, {
  origin: true,
});

// Templating
app.register(fastifyView, {
  engine: {
    ejs,
  },
});

// public
app.register(fastifyStatic, {
  root: join(rootDir, "public"),
});

// Routes managers
app.register(logRoutes, { prefix: "/log" });
app.setNotFoundHandler((req, res) => res.view("src/views/notFound.ejs"));

export default app;
