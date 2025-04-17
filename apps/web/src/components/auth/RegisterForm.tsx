// src/components/auth/RegisterForm.tsx
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

interface RegisterFormProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

export function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await authApi.register({ name, email, password });
      localStorage.setItem('token', data.accessToken);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={styles.formCard}>
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
          <p style={{ textAlign: 'center', marginTop: '12px' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              style={styles.buttonLink}
            >
              Login
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
