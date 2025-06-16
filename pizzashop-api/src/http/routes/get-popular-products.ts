import Elysia from "elysia";
import { auth } from "../auth";
import { UnauthorizedError } from "../erros/unauthorized-error";
import { db } from "../../db";
import { orderItems, orders, products } from "../../db/schema";
import { count, desc, eq, sum } from "drizzle-orm";

export const getPopularProducts = new Elysia()
  .use(auth)
  .get("/metrics/popular-products", async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new UnauthorizedError();
    }

    const popularProducst = await db
      .select({
        product: products.name,
        amount: sum(orderItems.quantity).mapWith(Number),
      })
      .from(orderItems)
      .leftJoin(orders, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .where(eq(orders.restaurantId, restaurantId))
      .groupBy(products.name)
      .orderBy((fields) => desc(fields.amount))
      .limit(5);

    return popularProducst;
  });
