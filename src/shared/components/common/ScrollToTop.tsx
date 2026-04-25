import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // page top pe le jao
  }, [pathname]); // jab bhi route change ho

  return null;
};

export default ScrollToTop;
