import Elysia, { t } from "elysia";
import swagger from "@elysiajs/swagger";
import { registerRestaurant } from "./routes/register-restaurant";
import { sendAuthLik } from "./routes/send-auth-link";
import { authenticateFromLink } from "./routes/authenticate-from-link";
import { signOut } from "./routes/sign-out";
import { getProfile } from "./routes/get-profile";
import { getManagedRestaurant } from "./routes/get-manager-restaurant";

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLik)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'UNAUTHORIZED': {
        set.status = 400
        return { code, message: 'Validation failed', error}
      }
      default: {
        return new Response(null, { status: 500 })
      }
    }
  })

app.use(swagger()).listen(3333, () => {
  console.log("✨ HTTP server running");
});
