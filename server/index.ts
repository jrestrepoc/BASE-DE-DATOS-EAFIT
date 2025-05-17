import express, { json, urlencoded, Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import path from "path";

async function main() {
  const app = express();
  const port = process.env.PORT || 5000;

  // Setup middleware
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Serve static files from the 'public' directory
  app.use(express.static(path.join(__dirname, '../public')));

  // Register API routes
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Algo salió mal";
    res.status(statusCode).json({ message });
  });

  // Start the server
  server.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });
}

main().catch((err) => console.error(err));