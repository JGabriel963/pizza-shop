import { RouterProvider } from "react-router-dom";
import { route } from "./routes";
import { Toaster } from "@/components/ui/sonner"

export function App() {
  return (
      <>
        <RouterProvider router={route} />
        <Toaster />
      </>
  );
}
