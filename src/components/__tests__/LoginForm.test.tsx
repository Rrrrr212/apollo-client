import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { gql } from 'graphql-tag';
import React from 'react';

import { MockedProvider } from '@apollo/client/testing/react';

import { LoginForm } from '../LoginForm';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

const LOGIN_SUCCESS_RESULT = {
  login: {
    token: 'test-token-123',
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      __typename: 'User',
    },
    __typename: 'LoginPayload',
  },
};

describe('LoginForm', () => {
  const defaultProps = {
    onSuccess: jest.fn(),
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call route navigation on successful login', async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: 'test@example.com',
            password: 'password123',
          },
        },
        result: { data: LOGIN_SUCCESS_RESULT },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <LoginForm {...defaultProps} />
      </MockedProvider>
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.navigate).toHaveBeenCalledWith('/dashboard');
    });

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          login: expect.objectContaining({
            token: 'test-token-123',
          }),
        })
      );
    });
  });

  it('should display error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: 'test@example.com',
            password: 'wrong-password',
          },
        },
        error: new Error(errorMessage),
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <LoginForm {...defaultProps} />
      </MockedProvider>
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong-password' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByTestId('error-message');
      expect(errorElement).toHaveTextContent(errorMessage);
    });

    expect(defaultProps.navigate).not.toHaveBeenCalled();
    expect(defaultProps.onSuccess).not.toHaveBeenCalled();
  });

  it('should disable button during loading state', async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: 'test@example.com',
            password: 'password123',
          },
        },
        result: { data: LOGIN_SUCCESS_RESULT },
        delay: 100,
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <LoginForm {...defaultProps} />
      </MockedProvider>
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Logging in...');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Login');
    });
  });
});
