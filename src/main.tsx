
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store/store.ts";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import AuthListener from "./auth/AuthListener";
import GlobalPopup from "./shared/components/common/GlobalPopup.tsx";
import NetworkStatusMonitor from "./shared/components/common/NetworkStatusMonitor.tsx";
import { getRouterBasename } from "./lib/basePath";

// TanStack Query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={getRouterBasename()}>
        {/* TanStack Query Provider */}
        <QueryClientProvider client={queryClient}>
          <AuthListener />
          <App />

          <Toaster
            position="bottom-right"
            toastOptions={{ duration: 3000, className: "px-2" }}
          />
          <NetworkStatusMonitor />
          <GlobalPopup />
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  // </StrictMode> 
);
