import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/themeSlice";

function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode || "dark");
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      return localStorage.getItem("instabuy-theme") || theme || "dark";
    } catch {
      return theme || "dark";
    }
  });

  useEffect(() => {
    setCurrentTheme(theme || "dark");
  }, [theme]);

  const applyTheme = useCallback((nextTheme) => {
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.body.setAttribute("data-theme", nextTheme);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(nextTheme);
    try {
      localStorage.setItem("instabuy-theme", nextTheme);
    } catch {
      // no-op
    }
    applyTheme(nextTheme);
    dispatch(setTheme(nextTheme));
  }, [applyTheme, currentTheme, dispatch]);

  return (
    <button
      className="theme-toggle-btn"
      onClick={handleThemeToggle}
      aria-label={currentTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={currentTheme === "dark" ? "Light mode" : "Dark mode"}
    >
      {currentTheme === "dark" ? "☀" : "🌙"}
    </button>
  );
}

export default memo(ThemeToggle);