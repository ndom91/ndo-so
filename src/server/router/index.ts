// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { githubRouter } from "./github";
import { shortcutRouter } from "./shortcut";
import { authRouter } from "./auth-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("github.", githubRouter)
  .merge("shortcut.", shortcutRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
