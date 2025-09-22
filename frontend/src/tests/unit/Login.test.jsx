import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../../pages/Login";
import authReducer from "../../features/auth/authSlice";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ✅ Mock react-redux useDispatch
const mockDispatch = vi.fn();
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

const renderWithStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  return store;
};

describe("Login Component", () => {
  beforeEach(() => {
    mockDispatch.mockClear(); // clear calls between tests
  });

  test("renders login form fields and submit button", () => {
    renderWithStore();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("updates form fields on input", () => {
    renderWithStore();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });
    expect(screen.getByLabelText(/email/i).value).toBe("test@example.com");
    expect(screen.getByLabelText(/password/i).value).toBe("123456");
  });

  test("dispatches loginUser thunk on form submit", () => {
    renderWithStore();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(typeof mockDispatch.mock.calls[0][0]).toBe("function"); // ✅ Check thunk
  });

  test("renders error message when error state exists", () => {
    renderWithStore({
      auth: { error: "Invalid credentials", loading: false, token: null },
    });
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
