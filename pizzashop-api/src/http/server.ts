import Elysia, { t } from "elysia";
import swagger from "@elysiajs/swagger";
import { registerRestaurant } from "./routes/register-restaurant";
import { sendAuthLik } from "./routes/send-auth-link";
import { authenticateFromLink } from "./routes/authenticate-from-link";

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLik)
  .use(authenticateFromLink)

app.use(swagger()).listen(3333, () => {
  console.log("✨ HTTP server running");
});
