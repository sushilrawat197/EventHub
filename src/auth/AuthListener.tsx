import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onSessionExpired } from "./authEvents";
import { isPublicAppPath } from "../app/routes/publicRoutes";

export default function AuthListener() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return onSessionExpired(() => {
      // Stay inside SPA navigation (avoids MIME/type issues on some hosts after OAuth redirects)
      if (location.pathname === "/login" || isPublicAppPath(location.pathname)) return;
      navigate("/login", { replace: true, state: { from: location.pathname } });
    });
  }, [location.pathname, navigate]);

  return null;
}

