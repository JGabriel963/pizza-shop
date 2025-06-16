import Elysia from "elysia";
import { auth } from "../auth";
import { UnauthorizedError } from "../erros/unauthorized-error";
import dayjs from "dayjs";
import { db } from "../../db";
import { orders } from "../../db/schema";
import { and, count, eq, gte, sql, sum } from "drizzle-orm";

export const getMonthCanceledOrdersAmount = new Elysia()
  .use(auth)
  .get("/metrics/month-canceled-orders-amount", async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new UnauthorizedError();
    }

    const today = dayjs();
    const lastMonth = today.subtract(1, "month");
    const startOfLastMonth = lastMonth.startOf("month");

    const orderPerMonth = await db
      .select({
        monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        amount: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          eq(orders.status, "canceled"),
          gte(orders.createdAt, startOfLastMonth.toDate())
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`); // TO_CHAR -> Converter data em SQL

    const lastMonthWithYear = lastMonth.format("YYYY-MM"); // 2025-01
    const currentMonthWithYear = today.format("YYYY-MM"); // 2025-02

    const currentMonthOrdersAmount = orderPerMonth.find((orderPerMonth) => {
      return orderPerMonth.monthWithYear === currentMonthWithYear;
    });

    const lastMonthOrdersAmount = orderPerMonth.find((orderPerMonth) => {
      return orderPerMonth.monthWithYear === lastMonthWithYear;
    });

    const diffFromLastMonth =
      currentMonthOrdersAmount && lastMonthOrdersAmount
        ? ((currentMonthOrdersAmount.amount - lastMonthOrdersAmount.amount) *
            100) /
          lastMonthOrdersAmount.amount
        : 0;

    return {
      amount: currentMonthOrdersAmount?.amount,
      diffFromLastMonth: Number(diffFromLastMonth.toFixed(2)),
    };
  });
