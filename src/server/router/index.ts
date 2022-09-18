// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { githubRouter } from "./github";
import { authRouter } from "./auth-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("github.", githubRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
