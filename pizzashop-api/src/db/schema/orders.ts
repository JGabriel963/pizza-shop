import {
  integer,
  pgTable,
  varchar,
  uuid,
  text,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { restaurants } from "./restaurants";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { orderItems } from "./order-items";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "delivering",
  "delivered",
  "canceled",
]);

export const orders = pgTable("orders", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text("customer_id").references(() => users.id, {
    onDelete: "set null",
  }),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id, {
      onDelete: "cascade",
    }),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalInCents: integer("total_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const orderRelations = relations(orders, ({ one, many }) => {
    return {
        customer: one(users, {
            fields: [orders.customerId],
            references: [users.id],
            relationName: 'order_customer'
        }),
        restaurant: one(restaurants, {
            fields: [orders.restaurantId],
            references: [restaurants.id],
            relationName: 'order_restaurant'
        }),
        orderItems: many(orderItems)
    }
})
