import { createSlice } from "@reduxjs/toolkit";

const initialUser = (() => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState = {
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || initialUser?.role || "USER",
  userId: localStorage.getItem("userId") || initialUser?.userId || null,
  userName: localStorage.getItem("userName") || initialUser?.userName || "",
  wallet: Number(localStorage.getItem("wallet") || initialUser?.wallet || 0),
  email: localUserEmail(),
};

function localUserEmail() {
  try {
    return localStorage.getItem("email") || initialUser?.email || "";
  } catch {
    return initialUser?.email || "";
  }
}

function syncUserStorage(state) {
  const userPayload = {
    token: state.token,
    role: state.role,
    userId: state.userId,
    userName: state.userName,
    wallet: state.wallet,
    email: state.email,
  };

  localStorage.setItem("token", state.token || "");
  localStorage.setItem("role", state.role || "USER");
  localStorage.setItem("userId", state.userId || "");
  localStorage.setItem("userName", state.userName || "");
  localStorage.setItem("wallet", String(state.wallet ?? 0));
  localStorage.setItem("email", state.email || "");
  localStorage.setItem("user", JSON.stringify(userPayload));
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const payload = action.payload || {};
      state.token = payload.token || null;
      state.role = payload.role || "USER";
      state.userId = payload.userId || null;
      state.userName = payload.userName || "";
      state.wallet = Number(payload.wallet ?? 0);
      state.email = payload.email || "";
      syncUserStorage(state);
    },
    updateWallet: (state, action) => {
      state.wallet = Number(action.payload ?? 0);
      syncUserStorage(state);
    },
    clearUser: (state) => {
      state.token = null;
      state.role = "USER";
      state.userId = null;
      state.userName = "";
      state.wallet = 0;
      state.email = "";

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("wallet");
      localStorage.removeItem("email");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, updateWallet, clearUser } = userSlice.actions;
export default userSlice.reducer;