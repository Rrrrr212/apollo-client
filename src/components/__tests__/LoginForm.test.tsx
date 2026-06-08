
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing/react";
import { LoginForm } from "../LoginForm";
import { LOGIN_MUTATION } from "../../graphql/mutations/login";

describe("LoginForm", () => {
  const user = userEvent.setup();
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call onLoginSuccess when login is successful", async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: "test@example.com",
            password: "password123",
          },
        },
        result: {
          data: {
            login: {
              token: "fake-token",
              user: {
                id: "1",
                email: "test@example.com",
                name: "Test User",
                __typename: "User",
              },
              __typename: "LoginPayload",
            },
          },
        },
      },
    ];

    render(
      &lt;MockedProvider mocks={mocks}&gt;
        &lt;LoginForm onLoginSuccess={mockOnLoginSuccess} /&gt;
      &lt;/MockedProvider&gt;
    );

    await user.type(screen.getByTestId("email-input"), "test@example.com");
    await user.type(screen.getByTestId("password-input"), "password123");
    await user.click(screen.getByTestId("login-button"));

    await waitFor(() =&gt; {
      expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("should display error message when login fails", async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: "test@example.com",
            password: "wrong-password",
          },
        },
        error: new Error("Invalid credentials"),
      },
    ];

    render(
      &lt;MockedProvider mocks={mocks}&gt;
        &lt;LoginForm /&gt;
      &lt;/MockedProvider&gt;
    );

    await user.type(screen.getByTestId("email-input"), "test@example.com");
    await user.type(screen.getByTestId("password-input"), "wrong-password");
    await user.click(screen.getByTestId("login-button"));

    await waitFor(() =&gt; {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Invalid credentials"
      );
    });
  });

  it("should disable the login button while loading", async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: "test@example.com",
            password: "password123",
          },
        },
        result: {
          data: {
            login: {
              token: "fake-token",
              user: {
                id: "1",
                email: "test@example.com",
                name: "Test User",
                __typename: "User",
              },
              __typename: "LoginPayload",
            },
          },
        },
        delay: 100,
      },
    ];

    render(
      &lt;MockedProvider mocks={mocks}&gt;
        &lt;LoginForm /&gt;
      &lt;/MockedProvider&gt;
    );

    await user.type(screen.getByTestId("email-input"), "test@example.com");
    await user.type(screen.getByTestId("password-input"), "password123");
    await user.click(screen.getByTestId("login-button"));

    expect(screen.getByTestId("login-button")).toBeDisabled();
    expect(screen.getByTestId("login-button")).toHaveTextContent(
      "Logging in..."
    );

    await waitFor(() =&gt; {
      expect(screen.getByTestId("login-button")).not.toBeDisabled();
    });
  });
});

