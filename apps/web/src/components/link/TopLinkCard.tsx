import { Link } from '@url-shortener/db/generated';
import React from 'react';
import { styles } from '../../styles/styles';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface TopLinkCardProps {
  link: Link;
}

export function TopLinkCard({ link }: TopLinkCardProps) {
  const copyToClipboard = () => {
    const fullUrl = `${window.location.origin}/${link.slug}`;
    navigator.clipboard.writeText(fullUrl);
    alert('URL copied to clipboard!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Visited URL</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p style={{ marginBottom: '8px' }}>
            <strong>Original URL:</strong>{' '}
            <span style={styles.truncate} title={link.originalUrl}>
              {link.originalUrl}
            </span>
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Short URL:</strong>{' '}
            <a
              href={`${window.location.origin}/${link.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              {window.location.origin}/{link.slug}
            </a>
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Visits:</strong> {link.visits}
          </p>
          <Button
            variant="outline"
            onClick={copyToClipboard}
            style={{ marginTop: '8px' }}
          >
            Copy URL
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
