// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { authApi } from '../../services/api';
import { styles } from '../../styles/styles';
import { Button } from '../ui/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/Card';
import { Input } from '../ui/Input';

interface LoginFormProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
}

export function LoginForm({ onSuccess, onRegisterClick }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('token', data.accessToken);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={styles.formCard}>
      <CardHeader>
        <CardTitle>Login to continue</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter style={{ flexDirection: 'column' }}>
          <Button type="submit" disabled={isLoading} style={styles.fullWidth}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <p style={{ textAlign: 'center', marginTop: '12px' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onRegisterClick}
              style={styles.buttonLink}
            >
              Register
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
