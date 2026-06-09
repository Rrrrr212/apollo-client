import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { LOGIN_MUTATION } from "../../graphql/mutations/login";
import { LoginForm } from "../LoginForm";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const navigate = jest.fn();
(useNavigate as jest.Mock).mockReturnValue(navigate);

type MutationResult =
  | { data: { login: { token: string; user: { id: string; email: string; name: string } } } }
  | { errors: readonly [{ message: string }] };

interface MutationMock {
  request: { query: typeof LOGIN_MUTATION; variables: { email: string; password: string } };
  result?: MutationResult;
  error?: Error;
  delay?: number;
  newData?: () => MutationResult;
}

const renderLoginForm = (mocks: MutationMock[] = []) =>
  render(
    <MockedProvider mocks={mocks as any} addTypename={false}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </MockedProvider>
  );

describe("LoginForm", () => {
  const validVariables = { email: "user@example.com", password: "password123" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("navigates to dashboard after a successful login", async () => {
    const successMock: MutationMock = {
      request: { query: LOGIN_MUTATION, variables: validVariables },
      result: {
        data: {
          login: {
            token: "fake-token",
            user: { id: "1", email: validVariables.email, name: "Test User" },
          },
        },
      },
    };

    renderLoginForm([successMock]);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: validVariables.email },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: validVariables.password },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("displays an error message when login fails", async () => {
    const errorMock: MutationMock = {
      request: { query: LOGIN_MUTATION, variables: validVariables },
      error: new Error("Invalid email or password"),
    };

    renderLoginForm([errorMock]);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: validVariables.email },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: validVariables.password },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByTestId("login-error")).toHaveTextContent(
        "Invalid email or password"
      );
    });
    expect(navigate).not.toHaveBeenCalled();
  });

  test("disables the submit button while the mutation is loading", async () => {
    const pendingMock: MutationMock = {
      request: { query: LOGIN_MUTATION, variables: validVariables },
      result: {
        data: {
          login: {
            token: "fake-token",
            user: { id: "1", email: validVariables.email, name: "Test User" },
          },
        },
      },
      delay: Infinity,
    };

    renderLoginForm([pendingMock]);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: validVariables.email },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: validVariables.password },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    const button = screen.getByRole("button", { name: /logging in/i });
    expect(button).toBeDisabled();
  });
});
