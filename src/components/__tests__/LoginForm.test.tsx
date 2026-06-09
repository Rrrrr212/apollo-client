import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../LoginForm';
import { LOGIN_MUTATION } from '../../graphql/mutations/login';

// 模拟 @apollo/client
jest.mock('@apollo/client', () => ({
  useMutation: jest.fn(),
}));

// 模拟 react-router-dom 的 useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// 模拟 GraphQL mutation
jest.mock('../../graphql/mutations/login', () => ({
  LOGIN_MUTATION: 'MOCK_LOGIN_MUTATION',
}));

// 模拟 LoginForm 组件中可能用到的子组件（视实际情况可略）

describe('LoginForm', () => {
  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    // 默认的 useMutation 返回值状态：未加载，无错误
    (useMutation as jest.Mock).mockReturnValue([
      mockLogin,
      { loading: false, error: null }
    ]);
  });

  it('1) 成功登录后调用路由跳转', async () => {
    // 模拟成功登录的返回值
    mockLogin.mockResolvedValueOnce({
      data: {
        login: {
          token: 'mock-jwt-token',
        },
      },
    });

    render(<LoginForm />);

    // 假设组件中存在对应的占位符或角色
    // 注意：如果组件中没有明确的 role/placeholder，可能需要根据实际情况使用 getByTestId 或其它查询
    const usernameInput = screen.getByPlaceholderText(/username|用户名|email|邮箱/i);
    const passwordInput = screen.getByPlaceholderText(/password|密码/i);
    const submitButton = screen.getByRole('button', { name: /login|登录|submit/i });

    // 模拟用户输入
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // 点击登录按钮
    fireEvent.click(submitButton);

    // 验证 mutation 是否被调用
    expect(mockLogin).toHaveBeenCalled();

    // 验证路由跳转是否发生
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('2) 失败时显示错误消息', async () => {
    const errorMessage = '用户名或密码错误';

    // 模拟发生错误的返回值状态
    (useMutation as jest.Mock).mockReturnValue([
      mockLogin,
      { loading: false, error: new Error(errorMessage) }
    ]);

    render(<LoginForm />);

    // 验证错误信息是否显示在页面上
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('3) loading 期间按钮禁用', () => {
    // 模拟正在加载的返回值状态
    (useMutation as jest.Mock).mockReturnValue([
      mockLogin,
      { loading: true, error: null }
    ]);

    render(<LoginForm />);

    // 获取提交按钮
    const submitButton = screen.getByRole('button', { name: /login|登录|submit/i });

    // 验证按钮是否处于禁用状态
    expect(submitButton).toBeDisabled();
  });
});
