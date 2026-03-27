import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useTheme } from "./hooks/useTheme.ts";
import { Toaster } from "./components/ui/sonner.tsx";

function App() {
  useTheme();
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-center"
        theme="system"
        richColors
        toastOptions={{
          className:
            "w-96 max-w-[90%] z-[9999] border border-border shadow-md rounded-lg",
        }}
      />
    </>
  );
}

export default App;
