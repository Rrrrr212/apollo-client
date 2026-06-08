
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/mutations/login";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: () => {
      onLoginSuccess?.();
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    await login({
      variables: { email, password },
    });
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      {errorMessage &amp;&amp; (
        <div className="error-message" data-testid="error-message">
          {errorMessage}
        </div>
      )}
      {error &amp;&amp; !errorMessage &amp;&amp; (
        <div className="error-message" data-testid="error-message">
          {error.message}
        </div>
      )}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) =&gt; setEmail(e.target.value)}
          required
          data-testid="email-input"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) =&gt; setPassword(e.target.value)}
          required
          data-testid="password-input"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        data-testid="login-button"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

