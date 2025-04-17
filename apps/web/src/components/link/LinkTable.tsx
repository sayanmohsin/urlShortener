import { Link } from '@url-shortener/db/generated';
import React from 'react';
import { styles } from '../../styles/styles';
import { Button } from '../ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/Table';

interface LinkTableProps {
  links: Link[];
  onEditUrl: (link: Link) => void;
}

export function LinkTable({ links, onEditUrl }: LinkTableProps) {
  if (links.length === 0) {
    return (
      <p style={styles.centered}>You haven't created any short URLs yet.</p>
    );
  }

  const copyToClipboard = (slug: string) => {
    const fullUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    alert('URL copied to clipboard!');
  };

  return (
    <div style={styles.tableContainer}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Original URL</TableHead>
            <TableHead>Short URL</TableHead>
            <TableHead>Visits</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => {
            const fullShortUrl = `${window.location.origin}/${link.slug}`;
            return (
              <TableRow key={link.id}>
                <TableCell style={styles.truncate} title={link.originalUrl}>
                  {link.originalUrl}
                </TableCell>
                <TableCell>
                  <a
                    href={fullShortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    {link.slug}
                  </a>
                </TableCell>
                <TableCell>{link.visits}</TableCell>
                <TableCell>
                  {new Date(link.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div style={styles.flexRow}>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(link.slug)}
                      style={styles.smallButton}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onEditUrl(link)}
                      style={styles.smallButton}
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
