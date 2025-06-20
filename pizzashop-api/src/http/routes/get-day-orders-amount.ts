import Elysia from "elysia";
import { auth } from "../auth";
import { UnauthorizedError } from "../erros/unauthorized-error";
import dayjs from "dayjs";
import { db } from "../../db";
import { orders } from "../../db/schema";
import { and, count, eq, gte, sql } from "drizzle-orm";

export const getDayOrdersAmount = new Elysia()
  .use(auth)
  .get("/metrics/day-orders-amount", async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new UnauthorizedError();
    }

    // TESTE TIMEZONE
    const today = dayjs().add(dayjs().utcOffset(), "minutes");
    const yesterday = today.subtract(1, "day");
    const startOfYesterday = yesterday.startOf("day");

    const orderPerDay = await db
      .select({
        dayWithMonthAndYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
        amount: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfYesterday.toDate())
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`);

    const todayWithMonthAndYear = today.format("YYYY-MM-DD");
    const yesterdayWithMonthAndYear = yesterday.format("YYYY-MM-DD");

    const todayOrdersAmount = orderPerDay.find((orderPerDay) => {
      return orderPerDay.dayWithMonthAndYear === todayWithMonthAndYear;
    });

    const yesterdayOrdersAmount = orderPerDay.find((orderPerDay) => {
      return orderPerDay.dayWithMonthAndYear === yesterdayWithMonthAndYear;
    });

    const diffFromYesterday =
      todayOrdersAmount && yesterdayOrdersAmount
        ? ((todayOrdersAmount.amount - yesterdayOrdersAmount.amount) * 100) /
          yesterdayOrdersAmount.amount
        : 0;

    return {
      amount: todayOrdersAmount?.amount,
      diffFromLastMonth: Number(diffFromYesterday.toFixed(2)),
    };
  });
