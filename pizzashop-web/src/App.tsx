import { RouterProvider } from "react-router-dom";
import { route } from "./routes";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme/theme-provider";

export function App() {
  return (
    <>
      <ThemeProvider storageKey="pizzashop-theme" defaultTheme="dark">
        <Toaster />
        <RouterProvider router={route} />
      </ThemeProvider>
    </>
  );
}
