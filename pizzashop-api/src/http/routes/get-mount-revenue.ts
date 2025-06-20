import Elysia from "elysia";
import { auth } from "../auth";
import { UnauthorizedError } from "../erros/unauthorized-error";
import dayjs from "dayjs";
import { db } from "../../db";
import { orders } from "../../db/schema";
import { and, eq, gte, sql, sum } from "drizzle-orm";

export const getMontRevenue = new Elysia()
  .use(auth)
  .get("/metrics/month-revenue", async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new UnauthorizedError();
    }

    const today = dayjs();
    const lastMonth = today.subtract(1, "month");
    const startOfLastMonth = lastMonth.startOf("month");

    const monthsReceipts = await db
      .select({
        monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        receipt: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfLastMonth.toDate())
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`); // TO_CHAR -> Converter data em SQL

    const lastMonthWithYear = lastMonth.format("YYYY-MM"); // 2025-01
    const currentMonthWithYear = today.format("YYYY-MM"); // 2025-02

    const currentMonthReceipt = monthsReceipts.find((monthReceipt) => {
      return monthReceipt.monthWithYear === currentMonthWithYear;
    });

    const lastMonthReceipt = monthsReceipts.find((monthReceipt) => {
      return monthReceipt.monthWithYear === lastMonthWithYear;
    });

    const diffFromLastMonth =
      currentMonthReceipt && lastMonthReceipt
        ? ((currentMonthReceipt.receipt - lastMonthReceipt.receipt) * 100) /
          lastMonthReceipt.receipt
        : 0;

    return {
      receipt: currentMonthReceipt?.receipt,
      diffFromLastMonth: Number(diffFromLastMonth.toFixed(2)),
    };
  });
