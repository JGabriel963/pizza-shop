import { createBrowserRouter } from "react-router-dom";
import { Dashboar } from "./pages/app/dashboard";
import { SignIn } from "./pages/auth/sign-in";

export const route = createBrowserRouter([
    {
        path: '/',
        element: <Dashboar />
    },
    {
        path: '/sign-in',
        element: <SignIn />
    }
])