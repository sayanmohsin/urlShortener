import { Link, User } from '@url-shortener/db/generated';
import React from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface LandingProps {
  user: User | null;
  onLinkCreated: (link: Link) => void;
  onNavigate: (view: 'login' | 'register') => void;
}

export function Landing({ user, onLinkCreated, onNavigate }: LandingProps) {
  return (
    <div>
      <p style={{ textAlign: 'center', margin: '20px 0' }}>
        Create short, memorable links with our easy-to-use URL shortener.
      </p>

      {user ? (
        <LinkForm onLinkCreated={onLinkCreated} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create Short URL</CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ marginBottom: '16px' }}>
              Please login or register to shorten URLs.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              <Button onClick={() => onNavigate('login')}>Login</Button>
              <Button variant="outline" onClick={() => onNavigate('register')}>
                Register
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
