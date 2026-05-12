import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

export const CORS = new Elysia().use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
