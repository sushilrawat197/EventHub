
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "./reducers/store.ts";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthListener from "./auth/AuthListener";
import GlobalPopup from "./UI/Components/common/GlobalPopup.tsx";
import NetworkStatusMonitor from "./UI/Components/common/NetworkStatusMonitor.tsx";

// TanStack Query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <Provider store={store}>
      {/* <BrowserRouter basename="/ticketing"> */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        {/* TanStack Query Provider */}
        <QueryClientProvider client={queryClient}>
          <AuthListener />
          <App />

          <ToastContainer
            position="bottom-right"
            autoClose={1000}
            closeOnClick={false}
            theme="light"
            className={"px-2"}
          />
          <NetworkStatusMonitor />
          <GlobalPopup />
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  // </StrictMode> 
);
