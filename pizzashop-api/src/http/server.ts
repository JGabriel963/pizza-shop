import Elysia, { t } from "elysia";
import swagger from "@elysiajs/swagger";
import { registerRestaurant } from "./routes/register-restaurant";
import { sendAuthLik } from "./routes/send-auth-link";
import { authenticateFromLink } from "./routes/authenticate-from-link";
import { signOut } from "./routes/sign-out";
import { getProfile } from "./routes/get-profile";
import { getManagedRestaurant } from "./routes/get-manager-restaurant";
import { getOrderDetails } from "./routes/get-order-details";
import { aproveOrder } from "./routes/approve-order";
import { cancelOrder } from "./routes/cancel-order";
import { dispatchOrder } from "./routes/dispatch-order";
import { deliverOrder } from "./routes/deliver-order";
import { getOrders } from "./routes/get-orders";
import { getMontRevenue } from "./routes/get-mount-revenue";
import { getDayOrdersAmount } from "./routes/get-day-orders-amount";

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLik)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(getOrderDetails)
  .use(aproveOrder)
  .use(aproveOrder)
  .use(cancelOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(getOrders)
  .use(getMontRevenue)
  .use(getDayOrdersAmount)
  .onError(({ code, error, set }) => {
    switch (code) {
      case "UNAUTHORIZED": {
        set.status = 400;
        return { code, message: "Validation failed", error };
      }
      case "VALIDATION": {
        set.status = error.status;

        return error.toResponse();
      }
      case "NOT_FOUND": {
        return new Response(null, { status: 404 });
      }
      default: {
        return new Response(null, { status: 500 });
      }
    }
  });

app.use(swagger()).listen(3333, () => {
  console.log("✨ HTTP server running");
});
