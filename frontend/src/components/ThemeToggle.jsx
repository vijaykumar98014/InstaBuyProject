import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme as toggleThemeAction } from "../redux/themeSlice";

function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  const handleThemeToggle = useCallback(() => {
    dispatch(toggleThemeAction());
  }, [dispatch]);

  return (
    <button className="theme-toggle-btn" onClick={handleThemeToggle}>
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}

export default memo(ThemeToggle);