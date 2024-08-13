import "reflect-metadata";
import * as tq from "type-graphql";
import { resolvers } from "@generated/type-graphql";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer, BaseContext } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { ApolloServerPluginLandingPageProductionDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";

interface Context extends BaseContext {
  prisma: PrismaClient;
}

/* eslint-disable */
const app = async () => {
  const prisma = new PrismaClient();

  const schema = await tq.buildSchema({
    resolvers,
    emitSchemaFile: true,
  });

  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageProductionDefault({ footer: false }),
    ],
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => ({
      prisma: prisma,
    }),
    listen: {
      port: 4000,
      host: "0.0.0.0",
    },
  });

  console.log(`Server listening at: ${url}`);
};

app().then();
/* eslint-enable */
