import { RouterProvider } from "react-router-dom";
import { route } from "./routes";

export function App() {
  return (
    <RouterProvider router={route} />
  );
}
