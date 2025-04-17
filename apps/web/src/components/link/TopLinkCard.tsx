import { Link } from '@url-shortener/db/generated';
import React, { useEffect, useState } from 'react';
import { linkApi } from '../../services/api';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export function TopLinkCard() {
  const [topLink, setTopLink] = useState<Link | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopLink = async () => {
      try {
        const { data } = await linkApi.getMyMostVisited();
        setTopLink(data);
      } catch (err) {
        console.error('Failed to fetch top URL');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopLink();
  }, []);

  const copyToClipboard = () => {
    if (!topLink) return;

    const shortUrl = `${window.location.origin}/${topLink.slug}`;
    navigator.clipboard.writeText(shortUrl);
    alert('URL copied to clipboard!');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Most Visited URL</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  if (!topLink) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Most Visited URL</CardTitle>
        </CardHeader>
        <CardContent>No URLs created yet.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Visited URL</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            Short URL:
          </div>
          <a
            href={`${window.location.origin}/${topLink.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {window.location.origin}/{topLink.slug}
          </a>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            Original URL:
          </div>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <a
              href={topLink.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={topLink.originalUrl}
            >
              {topLink.originalUrl}
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
          }}
        >
          <div>
            <strong>{topLink.visits}</strong> total visits
          </div>
          <Button onClick={copyToClipboard}>Copy URL</Button>
        </div>
      </CardContent>
    </Card>
  );
}
