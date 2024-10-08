import "reflect-metadata";
import * as tq from "type-graphql";
import { resolvers } from "@generated/type-graphql";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { ApolloServer, BaseContext } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { ApolloServerPluginLandingPageProductionDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import * as fs from "node:fs";
import dotenv from "dotenv";

dotenv.config();

interface Context extends BaseContext {
  prisma: PrismaClient;
}

const generateAndSaveToken = () => {
  let token = process.env.AUTH_TOKEN;

  if (!token) {
    token = uuidv4();
    fs.appendFileSync(".env.development", `\nAUTH_TOKEN=${token}\n`);
    console.log(`Generated Auth Token: ${token}`);
  } else {
    console.log(`Auth Token loaded from .env: ${token}`);
  }

  return token;
};

let authToken = "";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

  if (token === authToken) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Invalid or missing token" });
  }
};

const startExpressServer = (app: express.Express, prisma: PrismaClient, upload: multer.Multer) => {
  app.use(express.json());
  app.use(authenticateToken);

  // Route for uploading images
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { idVinyl } = req.body;

      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        console.log("No file uploaded");
        return;
      }

      if (!idVinyl || typeof idVinyl !== "string") {
        res.status(400).json({ message: "idVinyl is required as a body parameter" });
        console.log("idVinyl is required as a body parameter");
        return;
      }

      const uniqueName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const newPath = path.join("Images", uniqueName);

      fs.renameSync(req.file.path, newPath);

      if ((await prisma.vinyl.findUnique({ where: { idVinyl: idVinyl } })) == null) {
        res.status(400).json({ message: "idVinyl incorrect" });
        console.log("idVinyl incorrect");
        return;
      }

      const image = await prisma.image.create({
        data: {
          path: newPath,
          idVinyl,
        },
      });

      res.status(201).json({ id: image.idImage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Route for retrieving an image by its ID
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.get("/image", async (req: Request, res: Response) => {
    try {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        res.status(400).json({ message: "id is required as a query parameter" });
        return;
      }

      const image = await prisma.image.findUnique({
        where: { idImage: id },
      });

      if (!image) {
        res.status(404).json({ message: "Image not found" });
        return;
      }

      res.sendFile(path.resolve(image.path));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

const startGraphqlAPI = async (app: express.Express) => {
  const schema = await tq.buildSchema({
    resolvers,
    emitSchemaFile: true,
  });

  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageProductionDefault({ footer: false }),
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    authenticateToken,
    expressMiddleware(server, {
      // eslint-disable-next-line @typescript-eslint/require-await
      context: async () => ({
        prisma: prisma,
      }),
    }),
  );
};

const prisma = new PrismaClient();
const app = express();
const upload = multer({ dest: "Images/" });

startExpressServer(app, prisma, upload);

void startGraphqlAPI(app);

app.listen(4000, "0.0.0.0", () => {
  console.log("Listening...");
  authToken = generateAndSaveToken();
});
