import { Link } from '@url-shortener/db/generated';
// src/components/url/UrlForm.tsx
import React, { useState } from 'react';
import { linkApi } from '../../services/api';
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

interface LinkFormProps {
  onLinkCreated: (link: Link) => void;
}

export function LinkForm({ onLinkCreated }: LinkFormProps) {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  // Check slug availability
  const checkSlugAvailability = async () => {
    if (!customSlug) {
      setSlugAvailable(null);
      return;
    }

    setIsCheckingSlug(true);
    try {
      const { data } = await linkApi.checkSlugAvailability({
        slug: customSlug,
      });
      setSlugAvailable(data.available);
    } catch (err) {
      setSlugAvailable(null);
    } finally {
      setIsCheckingSlug(false);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (customSlug) {
        checkSlugAvailability();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [customSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await linkApi.createLink({
        originalUrl: url,
        slug: customSlug || undefined,
      });

      const baseUrl = window.location.origin;
      setShortUrl(data.shortUrl);
      onLinkCreated(data);

      // Reset form
      setUrl('');
      setCustomSlug('');
      setSlugAvailable(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create URL');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('URL copied to clipboard!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Short URL</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.formGroup}>
            <label htmlFor="url" style={styles.label}>
              URL to shorten
            </label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="customSlug" style={styles.label}>
              Custom slug (optional)
            </label>
            <Input
              id="customSlug"
              placeholder="my-custom-slug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
            />
            {isCheckingSlug && (
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Checking availability...
              </div>
            )}
            {!isCheckingSlug && customSlug && slugAvailable !== null && (
              <div
                style={{
                  fontSize: '12px',
                  marginTop: '4px',
                  color: slugAvailable ? 'green' : 'red',
                }}
              >
                {slugAvailable ? 'Slug is available!' : 'Slug is not available'}
              </div>
            )}
          </div>

          {shortUrl && (
            <div style={styles.resultBox}>
              <p style={{ marginBottom: '8px' }}>Your shortened URL:</p>
              <div style={styles.flexRow}>
                <Input value={shortUrl} readOnly style={{ flex: 1 }} />
                <Button type="button" onClick={copyToClipboard}>
                  Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isLoading || (customSlug !== '' && !slugAvailable)}
            style={styles.fullWidth}
          >
            {isLoading ? 'Creating...' : 'Shorten URL'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
