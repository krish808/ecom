import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";

export const server = setupServer(
  rest.post("http://localhost:5000/auth/signup", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ token: "fake-signup-token", user: req.body })
    );
  }),

  rest.post("http://localhost:5000/auth/login", (req, res, ctx) => {
    const { email, password } = req.body;
    if (password === "wrong") {
      return res(ctx.status(400), ctx.json({ message: "Invalid credentials" }));
    }
    return res(
      ctx.status(200),
      ctx.json({ token: "fake-login-token", user: { name: "John Doe", email } })
    );
  })
);

// Lifecycle hooks
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
