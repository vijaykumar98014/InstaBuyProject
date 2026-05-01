import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  try {
    return localStorage.getItem("instabuy-theme") || localStorage.getItem("theme") || "dark";
  } catch {
    return "dark";
  }
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload || "dark";
      localStorage.setItem("instabuy-theme", state.mode);
      localStorage.setItem("theme", state.mode);
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("instabuy-theme", state.mode);
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;