import { describe, test, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, {
  signupUser,
  loginUser,
} from "../../features/auth/authSlice";
import api from "../../services/api";

// Mock the axios instance
vi.mock("../../services/api");

describe("authSlice async thunks", () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { auth: authReducer } });
    vi.clearAllMocks();
  });

  test("signupUser - successful signup", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        token: "fake-token",
        user: { name: "John", email: "john@example.com" },
      },
    });

    await store.dispatch(
      signupUser({
        name: "John",
        email: "john@example.com",
        password: "123456",
      })
    );

    const state = store.getState().auth;
    expect(state.user).toEqual({ name: "John", email: "john@example.com" });
    expect(state.token).toBe("fake-token");
    expect(state.success).toBe("Signup successful!");
    expect(state.error).toBeNull();
  });

  test("signupUser - failed signup", async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: "User exists" } },
    });

    await store.dispatch(
      signupUser({
        name: "John",
        email: "john@example.com",
        password: "123456",
      })
    );

    const state = store.getState().auth;
    expect(state.error).toBe("User exists");
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  test("loginUser - successful login", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        token: "login-token",
        user: { name: "John", email: "john@example.com" },
      },
    });

    await store.dispatch(
      loginUser({ email: "john@example.com", password: "123456" })
    );

    const state = store.getState().auth;
    expect(state.user).toEqual({ name: "John", email: "john@example.com" });
    expect(state.token).toBe("login-token");
    expect(state.error).toBeNull();
  });

  test("loginUser - failed login", async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    await store.dispatch(
      loginUser({ email: "john@example.com", password: "wrongpass" })
    );

    const state = store.getState().auth;
    expect(state.error).toBe("Invalid credentials");
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
