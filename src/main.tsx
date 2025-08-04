import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "./reducers/store.ts";
// import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/ticketing">
        <App />
        <ToastContainer 
        position="bottom-right" 
        autoClose={1000} 
        closeOnClick={false}
        theme="light"
        className={"px-2"}
        />        
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
