import Elysia, { t } from "elysia";
import { db } from "../../db";
import dayjs from "dayjs";
import { auth } from "../auth";
import { authLinks } from "../../db/schema";
import { eq } from "drizzle-orm";

export const authenticateFromLink = new Elysia().use(auth).get(
  "/auth-links/authenticate",
  async ({ query, jwt, cookie: { auth }, set, redirect, signUser }) => {
    const { code, redirect: redirectUrl } = query;

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code);
      },
    });

    if (!authLinkFromCode) {
      throw new Error("Auth link not found.");
    }

    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createdAt,
      "days"
    );

    if (daysSinceAuthLinkWasCreated > 7) {
      throw new Error("Auth link expired, please generate a new one.");
    }

    const managerRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId);
      },
    });

    signUser({
      sub: authLinkFromCode.userId,
      restaurantId: managerRestaurant?.id,
    });

    await db.delete(authLinks).where(eq(authLinks.code, code));

    return redirect(redirectUrl, 301);
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  }
);
