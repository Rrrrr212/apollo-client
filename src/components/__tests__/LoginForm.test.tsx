import React from "react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { LOGIN_MUTATION } from "../../graphql/mutations/login.js";
import LoginForm from "../LoginForm.js";

const mockUseMutation = jest.fn();
const mockLogin = jest.fn();
const mockRouteChange = jest.fn();

jest.mock("@apollo/client/react", () => ({
  ...jest.requireActual("@apollo/client/react"),
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
}));

jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
}));

jest.mock(
  "react-router-dom",
  () => ({
    useNavigate: () => mockRouteChange,
  }),
  { virtual: true }
);

jest.mock(
  "next/router",
  () => ({
    useRouter: () => ({
      push: mockRouteChange,
      replace: mockRouteChange,
    }),
  }),
  { virtual: true }
);

jest.mock(
  "next/navigation",
  () => ({
    useRouter: () => ({
      push: mockRouteChange,
      replace: mockRouteChange,
    }),
  }),
  { virtual: true }
);

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function buildMutationState(options?: {
    called?: boolean;
    data?: unknown;
    error?: Error;
    loading?: boolean;
  }) {
    return [
      mockLogin,
      {
        called: options?.called ?? false,
        client: {} as never,
        data: options?.data,
        error: options?.error,
        loading: options?.loading ?? false,
        reset: jest.fn(),
      },
    ] as const;
  }

  function getEmailInput() {
    return (
      screen.queryByLabelText(/email|邮箱/i) ??
      screen.queryByPlaceholderText(/email|邮箱/i) ??
      screen.getAllByRole("textbox")[0]
    );
  }

  function getPasswordInput() {
    return (
      screen.queryByLabelText(/password|密码/i) ??
      screen.queryByPlaceholderText(/password|密码/i) ??
      (document.querySelector('input[type="password"]') as HTMLInputElement)
    );
  }

  function getSubmitButton() {
    return (
      screen.queryByRole("button", { name: /登录|login|sign in/i }) ??
      (document.querySelector('button[type="submit"]') as HTMLButtonElement)
    );
  }

  async function submitForm() {
    const user = userEvent.setup();

    await user.type(getEmailInput(), "demo@example.com");
    await user.type(getPasswordInput(), "password123");
    await user.click(getSubmitButton());
  }

  it("成功登录后调用路由跳转", async () => {
    const successData = {
      login: {
        token: "token",
        user: {
          id: "1",
        },
      },
    };

    mockLogin.mockResolvedValue({ data: successData });
    mockUseMutation
      .mockReturnValueOnce(buildMutationState())
      .mockReturnValueOnce(
        buildMutationState({ called: true, data: successData })
      );

    const { rerender } = render(<LoginForm />);

    await submitForm();

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    expect(mockUseMutation).toHaveBeenCalledWith(LOGIN_MUTATION);

    rerender(<LoginForm />);

    await waitFor(() => {
      expect(mockRouteChange).toHaveBeenCalledTimes(1);
    });
  });

  it("登录失败时显示错误消息", async () => {
    const loginError = new Error("邮箱或密码错误");

    mockLogin.mockRejectedValue(loginError);
    mockUseMutation
      .mockReturnValueOnce(buildMutationState())
      .mockReturnValueOnce(buildMutationState({ called: true, error: loginError }));

    const { rerender } = render(<LoginForm />);

    await submitForm();

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    rerender(<LoginForm />);

    expect(await screen.findByText("邮箱或密码错误")).toBeInTheDocument();
    expect(mockRouteChange).not.toHaveBeenCalled();
  });

  it("loading 期间按钮禁用", () => {
    mockUseMutation.mockReturnValue(buildMutationState({ loading: true }));

    render(<LoginForm />);

    expect(getSubmitButton()).toBeDisabled();
  });
});
