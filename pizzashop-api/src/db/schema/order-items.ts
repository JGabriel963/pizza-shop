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
import { orders } from "./orders";
import { products } from "./products";
import { relations } from "drizzle-orm";

export const orderItems = pgTable("order_items", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  productId: text("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  priceInCents: integer('price_in_cents').notNull(),
  quantity: integer('quantity').notNull()
});

export const orderItemRelations = relations(orderItems, ({ one, many }) => {
    return {
        order: one(orders, {
            fields: [orderItems.orderId],
            references: [orders.id],
            relationName: 'order_item_order'
        }),
        product: one(products, {
            fields: [orderItems.productId],
            references: [products.id],
            relationName: 'order_item_product'
        }),
    }
})
