import { Link } from '@url-shortener/db/generated';
import React, { useState, useEffect } from 'react';
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
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  // Check slug availability when typing
  useEffect(() => {
    if (customSlug) {
      const timer = setTimeout(async () => {
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
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [customSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!originalUrl) {
      setError('Please enter a URL');
      return;
    }

    if (customSlug && !slugAvailable) {
      setError('This custom slug is not available');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      const { data } = await linkApi.createLink({
        originalUrl,
        slug: customSlug || undefined,
      });

      onLinkCreated(data);

      // Reset form
      setOriginalUrl('');
      setCustomSlug('');
      setSlugAvailable(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create short URL');
    } finally {
      setIsSubmitting(false);
    }
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
            <label htmlFor="originalUrl" style={styles.label}>
              Original URL
            </label>
            <Input
              id="originalUrl"
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="customSlug" style={styles.label}>
              Custom slug (optional)
            </label>
            <Input
              id="customSlug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="my-custom-slug"
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
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting || (customSlug !== '' && !slugAvailable)}
          >
            {isSubmitting ? 'Creating...' : 'Create Short URL'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
