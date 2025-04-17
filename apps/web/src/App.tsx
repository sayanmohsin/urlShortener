import { Link, User } from '@url-shortener/db/generated';
// src/App.tsx
import React, { useEffect, useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { LinkForm } from './components/link/LinkForm';
import { LinkTable } from './components/link/LinkTable';
import { TopLinkCard } from './components/link/TopLinkCard';
import { Button } from './components/ui/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/Card';
import { Input } from './components/ui/Input';
import { authApi, linkApi } from './services/api';
import { styles } from './styles/styles';

export default function App() {
  // States
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [view, setView] = useState<
    'landing' | 'login' | 'register' | 'dashboard'
  >('landing');
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [newSlug, setNewSlug] = useState('');
  const [editError, setEditError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Find most visited URL
  const getMostVisitedLink = () => {
    if (links.length === 0) return null;
    return links.reduce((prev, current) =>
      prev.visits > current.visits ? prev : current
    );
  };

  // API Calls
  const fetchUser = async () => {
    try {
      const { data } = await authApi.getProfile();
      setUser(data);
      fetchUrls();
    } catch (err) {
      localStorage.removeItem('token');
      setIsLoading(false);
    }
  };

  const fetchUrls = async () => {
    try {
      const { data } = await linkApi.getMyUrls();
      setLinks(data);
    } catch (err) {
      console.error('Failed to fetch URLs');
    } finally {
      setIsLoading(false);
    }
  };

  // Event Handlers
  const handleUrlCreated = (newUrl: Link) => {
    setLinks([newUrl, ...links]);
    setView('dashboard');
  };

  const handleLoginSuccess = async () => {
    await fetchUser();
    setView('dashboard');
  };

  const handleEditUrl = (url: Link) => {
    setEditingLink(url);
    setNewSlug(url.slug);
    setEditError('');
  };

  const handleSaveEdit = async () => {
    if (!editingLink) return;

    try {
      setEditError('');
      // API endpoint not provided, but would be something like:
      await linkApi.updateLink(editingLink.id, { slug: newSlug });
      fetchUrls(); // Refetch to get updated data
      setEditingLink(null);
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Failed to update URL');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLinks([]);
    setView('landing');
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <h1
          style={{ cursor: 'pointer', margin: 0 }}
          onClick={() => setView('landing')}
        >
          URL Shortener
        </h1>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Hello, {user.name}</span>
            {view !== 'dashboard' && (
              <Button variant="outline" onClick={() => setView('dashboard')}>
                Dashboard
              </Button>
            )}
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <div>
            <Button
              variant="outline"
              onClick={() => setView('login')}
              style={{ marginRight: '8px' }}
            >
              Login
            </Button>
            <Button onClick={() => setView('register')}>Register</Button>
          </div>
        )}
      </header>

      <main style={styles.main}>
        {/* Landing Page */}
        {view === 'landing' && (
          <div>
            <p style={{ textAlign: 'center', margin: '20px 0' }}>
              Create short, memorable links with our easy-to-use URL shortener.
            </p>

            {user ? (
              <LinkForm onUrlCreated={handleUrlCreated} />
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
                    <Button onClick={() => setView('login')}>Login</Button>
                    <Button
                      variant="outline"
                      onClick={() => setView('register')}
                    >
                      Register
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div>
            {/* Most visited URL */}
            {getMostVisitedLink() && (
              <div style={{ marginBottom: '20px' }}>
                <TopLinkCard link={getMostVisitedLink()!} />
              </div>
            )}

            {/* URL Creation Form */}
            <div style={{ marginBottom: '20px' }}>
              <LinkForm onUrlCreated={handleUrlCreated} />
            </div>

            {/* URL Table */}
            <h2 style={{ marginBottom: '12px' }}>Your URLs</h2>
            <LinkTable links={links} onEditUrl={handleEditUrl} />
          </div>
        )}

        {/* Login View */}
        {view === 'login' && (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onRegisterClick={() => setView('register')}
          />
        )}

        {/* Register View */}
        {view === 'register' && (
          <RegisterForm
            onSuccess={handleLoginSuccess}
            onLoginClick={() => setView('login')}
          />
        )}

        {/* Edit URL Modal */}
        {editingLink && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <Card style={{ width: '300px' }}>
              <CardHeader>
                <CardTitle>Edit Short URL</CardTitle>
              </CardHeader>
              <CardContent>
                {editError && <div style={styles.error}>{editError}</div>}
                <div style={styles.formGroup}>
                  <label htmlFor="newSlug" style={styles.label}>
                    Custom slug
                  </label>
                  <Input
                    id="newSlug"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter style={{ justifyContent: 'space-between' }}>
                <Button variant="outline" onClick={() => setEditingLink(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save</Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
