/**
 * Paths that should remain viewable without an active session.
 * Used to avoid redirecting guests to /login after a failed token refresh.
 */
export function isPublicAppPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "/events") return true;

  if (/^\/events\/[^/]+\/\d+\/?$/.test(pathname)) return true;

  if (/^\/events\/[^/]+\/\d+\/marathon-registration\/?$/.test(pathname)) return true;

  const openAuth =
    /^\/(login|signup|forgetpassword|verifyforgototp|change-password|otpverification|setpassword|varifylgoinotp|passwordreset|passwordresetsuccess)\/?$/.test(
      pathname
    );
  if (openAuth) return true;

  return false;
}
