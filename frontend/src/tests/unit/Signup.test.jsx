import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Signup from "../../pages/Signup";
import authReducer from "../../features/auth/authSlice";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ✅ Mock react-redux useDispatch once
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
        <Signup />
      </MemoryRouter>
    </Provider>
  );

  return store;
};

describe("Signup Component", () => {
  beforeEach(() => {
    mockDispatch.mockClear(); // reset between tests
  });

  test("renders form fields and submit button", () => {
    renderWithStore();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
  });

  test("updates form fields on input", () => {
    renderWithStore();
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });

    expect(screen.getByLabelText(/name/i).value).toBe("John");
    expect(screen.getByLabelText(/email/i).value).toBe("test@example.com");
    expect(screen.getByLabelText(/password/i).value).toBe("123456");
  });

  test("dispatches signupUser thunk on form submit", () => {
    renderWithStore();
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(typeof mockDispatch.mock.calls[0][0]).toBe("function"); // ✅ thunk dispatched
  });

  test("renders success message when success state exists", () => {
    renderWithStore({
      auth: { success: "Signup successful!", loading: false, error: null },
    });
    expect(screen.getByText(/signup successful!/i)).toBeInTheDocument();
  });

  test("renders error message when error state exists", () => {
    renderWithStore({
      auth: { error: "Email already exists", loading: false, success: null },
    });
    expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
  });
});
