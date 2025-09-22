import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import AuthRoute from "../../routes/AuthRoute";

const renderWithStore = (ui, { preloadedState } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("AuthRoute", () => {
  test("redirects to /login if private route and no token", () => {
    renderWithStore(
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute type="private">
              <div>Private Content</div>
            </AuthRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { preloadedState: { auth: { token: null } } }
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("renders private content if token exists", () => {
    renderWithStore(
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute type="private">
              <div>Private Content</div>
            </AuthRoute>
          }
        />
      </Routes>,
      { preloadedState: { auth: { token: "123abc" } } }
    );

    expect(screen.getByText("Private Content")).toBeInTheDocument();
  });

  test("redirects to /dashboard if public route and token exists", () => {
    renderWithStore(
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute type="public">
              <div>Login Form</div>
            </AuthRoute>
          }
        />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
      { preloadedState: { auth: { token: "123abc" } } }
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("renders public content if no token", () => {
    renderWithStore(
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute type="public">
              <div>Signup Form</div>
            </AuthRoute>
          }
        />
      </Routes>,
      { preloadedState: { auth: { token: null } } }
    );

    expect(screen.getByText("Signup Form")).toBeInTheDocument();
  });
});
