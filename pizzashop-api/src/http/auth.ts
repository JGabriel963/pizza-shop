import jwt from "@elysiajs/jwt";
import Elysia, { t, type Static } from "elysia";
import { UnauthorizedError } from "./erros/unauthorized-error";
// import { env } from "../env";

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
});

export const auth = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case "UNAUTHORIZED": {
        set.status = 401;
        return { code, message: error.message };
      }
    }
  })
  .use(
    jwt({
      secret: process.env.JWT_SECRET_KEY!,
      schema: jwtPayload,
    })
  )
  .derive({ as: "scoped" }, ({ jwt, cookie: { auth } }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload);

        auth!.value = token;
        auth!.httpOnly = true;
        auth!.maxAge = 60 * 60 * 24 * 7; // 7 days
        auth!.path = "/";
      },
      signOut: () => {
        auth?.remove();
      },
      getCurrentUser: async () => {
        const payload = await jwt.verify(auth?.value);

        if (!payload) {
          throw new Error("Unauthorized.");
        }

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        };
      },
    };
  });
