import { Link } from '@url-shortener/db/generated';
import React, { useState } from 'react';
import { styles } from '../../styles/styles';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface LinkTableProps {
  links: Link[];
  onEditUrl: (url: Link) => void;
}

export function LinkTable({ links, onEditUrl }: LinkTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (link: Link) => {
    const shortUrl = `${window.location.origin}/${link.slug}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(link.id);

    // Reset the "Copied" status after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  if (links.length === 0) {
    return (
      <Card style={{ padding: '20px', textAlign: 'center' }}>
        You haven't created any short URLs yet.
      </Card>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Created</th>
            <th>Visits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id}>
              <td>
                <a
                  href={`${window.location.origin}/${link.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 'bold' }}
                >
                  /{link.slug}
                </a>
              </td>
              <td
                style={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <a
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.originalUrl}
                >
                  {link.originalUrl}
                </a>
              </td>
              <td>{new Date(link.createdAt).toLocaleDateString()}</td>
              <td>{link.visits}</td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(link)}
                  >
                    {copiedId === link.id ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button onClick={() => onEditUrl(link)}>Edit</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
