import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import { useMutation } from "@apollo/client/react";
import LoginForm from "../LoginForm.js";

jest.mock("@apollo/client/react", () => {
  const actual = jest.requireActual<
    typeof import("@apollo/client/react")
  >("@apollo/client/react");
  return {
    ...actual,
    useMutation: jest.fn(),
  };
});

const mockUseMutation = useMutation as jest.Mock;

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call onLoginSuccess with token on successful login", async () => {
    const onLoginSuccess = jest.fn();

    mockUseMutation.mockImplementation((_mutation: unknown, options?: any) => {
      const loginFn = jest.fn().mockImplementation(async () => {
        options?.onCompleted?.({ login: { token: "test-token" } });
      });
      return [loginFn, { loading: false }];
    });

    render(<LoginForm onLoginSuccess={onLoginSuccess} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledWith("test-token");
    });
  });

  it("should display error message when login fails", async () => {
    mockUseMutation.mockImplementation((_mutation: unknown, options?: any) => {
      const loginFn = jest.fn().mockImplementation(async () => {
        options?.onError?.({ message: "Invalid credentials" });
      });
      return [loginFn, { loading: false }];
    });

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid credentials"
      );
    });
  });

  it("should disable the submit button while loading", () => {
    mockUseMutation.mockReturnValue([jest.fn(), { loading: true }]);

    render(<LoginForm />);

    const button = screen.getByRole("button", { name: "Logging in..." });

    expect(button).toBeDisabled();
  });
});