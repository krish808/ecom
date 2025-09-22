// src/tests/integration/userFlow.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import authReducer from "../../features/auth/authSlice";
import Signup from "../../pages/Signup";
import Login from "../../pages/Login";
import Dashboard from "../../pages/Dashboard";
import AuthRoute from "../../routes/AuthRoute";

// --- Helper: render with store + router ---
const renderWithStoreAndRouter = (
  ui,
  { route = "/", initialState = {} } = {}
) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: initialState,
  });
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    ),
    store,
  };
};

test("✅ full flow: signup → login → access protected route", async () => {
  const user = userEvent.setup();

  // --- Step 1: Signup ---
  const { unmount: unmountSignup } = renderWithStoreAndRouter(
    <Routes>
      <Route path="/" element={<Signup />} />
    </Routes>,
    { route: "/" }
  );

  await user.type(screen.getByRole("textbox", { name: /name/i }), "John");
  await user.type(
    screen.getByRole("textbox", { name: /email/i }),
    "john@example.com"
  );
  await user.type(screen.getByLabelText(/password/i), "123456");
  await user.click(screen.getByRole("button", { name: /signup/i }));

  await waitFor(() => screen.getByText(/signup successful/i));
  expect(screen.getByText(/signup successful/i)).toBeInTheDocument();

  unmountSignup();

  // --- Step 2: Login ---
  const { store: loginStore, unmount: unmountLogin } = renderWithStoreAndRouter(
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>,
    { route: "/login" }
  );

  await user.type(
    screen.getByRole("textbox", { name: /email/i }),
    "john@example.com"
  );
  await user.type(screen.getByLabelText(/password/i), "123456");
  await user.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => {
    const state = loginStore.getState();
    expect(state.auth.token).toBeTruthy();
    expect(state.auth.user).not.toBeNull();
  });

  const authenticatedState = loginStore.getState();
  unmountLogin();

  // --- Step 3: Access Protected Route ---
  renderWithStoreAndRouter(
    <Routes>
      <Route
        path="/dashboard"
        element={
          <AuthRoute type="private">
            <Dashboard />
          </AuthRoute>
        }
      />
    </Routes>,
    { route: "/dashboard", initialState: authenticatedState }
  );

  await waitFor(() => screen.getByText(/dashboard/i));
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});

test("❌ login fails with wrong password", async () => {
  const user = userEvent.setup();

  renderWithStoreAndRouter(
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>,
    { route: "/login" }
  );

  await user.type(
    screen.getByRole("textbox", { name: /email/i }),
    "john@example.com"
  );
  await user.type(screen.getByLabelText(/password/i), "wrong");
  await user.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => screen.getByText(/invalid credentials/i));
  expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
});
