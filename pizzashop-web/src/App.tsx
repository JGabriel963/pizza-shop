import { RouterProvider } from "react-router-dom";
import { route } from "./routes";
import { Toaster } from 'sonner'


export function App() {
  return (
      <>
        <Toaster />
        <RouterProvider router={route} />
      </>
  );
}
