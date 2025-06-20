import { integer, pgTable, varchar, uuid, text, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2'
import { relations } from "drizzle-orm";
import { orders } from "./orders";
import { restaurants } from "./restaurants";

export const userRoleEnum = pgEnum('user_role', ['manager', 'customer'])

export const users = pgTable("users", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role:userRoleEnum('role').default('customer').notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRelations = relations(users, ({ one, many }) => {
    return {
        managedRestaurant: one(restaurants, {
            fields: [users.id],
            references: [restaurants.managerId],
            relationName: 'restaurant_manager'
        }),
        orders: many(orders)
    }
})
