import { Link } from '@url-shortener/db/generated';
import { useEffect, useState } from 'react';
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

interface EditLinkModalProps {
  link: Link;
  onClose: () => void;
  onSave: (updatedLink: Link) => void;
}

export function EditLinkModal({ link, onClose, onSave }: EditLinkModalProps) {
  const [newSlug, setNewSlug] = useState(link.slug);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  // Check slug availability when editing
  useEffect(() => {
    if (newSlug && newSlug !== link.slug) {
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

    if (newSlug === link.slug) {
      setSlugAvailable(null);
    }
  }, [newSlug, link.slug]);

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

  const handleSaveEdit = async () => {
    try {
      setEditError('');
      const { data } = await linkApi.updateLink(link.id, { slug: newSlug });
      setEditSuccess('URL updated successfully!');

      // Wait a short time to show the success message before closing modal
      setTimeout(() => {
        onSave(data);
      }, 1500);
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Failed to update URL');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${newSlug}`);
    alert('URL copied to clipboard!');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Card
        style={{
          width: '400px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'white',
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
              value={link.originalUrl}
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
              newSlug !== link.slug &&
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
            <div style={styles.flexRow}>
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            disabled={
              newSlug === '' ||
              (newSlug !== link.slug && !slugAvailable) ||
              isCheckingSlug
            }
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
