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
  const [editSuccess, setEditSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Check slug availability when editing
  useEffect(() => {
    if (editingLink && newSlug && newSlug !== editingLink.slug) {
      const timer = setTimeout(async () => {
        setIsCheckingSlug(true);
        try {
          const { data } = await linkApi.checkSlugAvailability({
            slug: newSlug,
          });
          setSlugAvailable(data.available);
        } catch (err) {
          setSlugAvailable(null);
        } finally {
          setIsCheckingSlug(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
    if (editingLink && newSlug === editingLink.slug) {
      setSlugAvailable(null); // No need to check if unchanged
    }
  }, [newSlug, editingLink]);

  // Clear success message after 3 seconds
  useEffect(() => {
    let timer: number;
    if (editSuccess) {
      timer = window.setTimeout(() => {
        setEditSuccess('');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [editSuccess]);

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
    setEditSuccess('');
    setSlugAvailable(null);
  };

  const handleSaveEdit = async () => {
    if (!editingLink) return;

    try {
      setEditError('');
      await linkApi.updateLink(editingLink.id, { slug: newSlug });
      setEditSuccess('URL updated successfully!');

      // Wait a short time to show the success message before closing modal
      setTimeout(() => {
        fetchUrls(); // Refetch to get updated data
        setEditingLink(null);
      }, 1500);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${newSlug}`);
    alert('URL copied to clipboard!');
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
              <LinkForm onLinkCreated={handleUrlCreated} />
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
            <div style={{ marginBottom: '20px' }}>
              <TopLinkCard />
            </div>

            {/* URL Creation Form */}
            <div style={{ marginBottom: '20px' }}>
              <LinkForm onLinkCreated={handleUrlCreated} />
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
              backgroundColor: 'rgba(0, 0, 0, 0.75)', // Darker background
              backdropFilter: 'blur(4px)', // Add blur effect
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <Card
              style={{
                width: '400px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)', // Stronger shadow
                border: '1px solid rgba(0, 0, 0, 0.1)', // Add border
                background: 'white', // Solid background
              }}
            >
              <CardHeader style={{ borderBottom: '1px solid #eee' }}>
                <CardTitle>Edit Short URL</CardTitle>
              </CardHeader>
              <CardContent>
                {editError && <div style={styles.error}>{editError}</div>}
                {editSuccess && (
                  <div
                    style={{
                      color: 'green',
                      marginBottom: '16px',
                      padding: '8px',
                      backgroundColor: '#e6f7e6',
                      borderRadius: '4px',
                      border: '1px solid #c3e6cb',
                    }}
                  >
                    {editSuccess}
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label htmlFor="originalUrl" style={styles.label}>
                    Original URL
                  </label>
                  <Input
                    id="originalUrl"
                    value={editingLink.originalUrl}
                    readOnly
                    disabled
                  />
                </div>

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
                  {isCheckingSlug && (
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      Checking availability...
                    </div>
                  )}
                  {!isCheckingSlug &&
                    newSlug &&
                    newSlug !== editingLink.slug &&
                    slugAvailable !== null && (
                      <div
                        style={{
                          fontSize: '12px',
                          marginTop: '4px',
                          color: slugAvailable ? 'green' : 'red',
                        }}
                      >
                        {slugAvailable
                          ? 'Slug is available!'
                          : 'Slug is not available'}
                      </div>
                    )}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="shortUrl" style={styles.label}>
                    Short URL
                  </label>
                  <div
                    style={styles.flexRow || { display: 'flex', gap: '8px' }}
                  >
                    <Input
                      id="shortUrl"
                      value={`${window.location.origin}/${newSlug}`}
                      readOnly
                      style={{ flex: 1 }}
                    />
                    <Button type="button" onClick={copyToClipboard}>
                      Copy
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter
                style={{
                  justifyContent: 'space-between',
                  borderTop: '1px solid #eee',
                  padding: '16px',
                }}
              >
                <Button variant="outline" onClick={() => setEditingLink(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={
                    newSlug === '' ||
                    (newSlug !== editingLink.slug && !slugAvailable) ||
                    isCheckingSlug
                  }
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
