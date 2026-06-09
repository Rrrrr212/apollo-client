import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations/login';

interface LoginFormProps {
  onSuccess?: (data: { login: { token: string; user: { id: string; email: string; name: string } } }) => void;
  navigate?: (path: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      onSuccess?.(data);
      navigate?.('/dashboard');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ variables: { email, password } });
    } catch {
      // Error is handled by the hook's error state
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="password-input"
          required
        />
      </div>
      {error && <div data-testid="error-message">{error.message}</div>}
      <button type="submit" disabled={loading} data-testid="submit-button">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
