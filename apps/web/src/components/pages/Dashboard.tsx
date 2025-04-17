import { Link } from '@url-shortener/db/generated';
import React, { useState } from 'react';
import { EditLinkModal } from '../link/EditLinkModal';
import { LinkForm } from '../link/LinkForm';
import { LinkTable } from '../link/LinkTable';
import { TopLinkCard } from '../link/TopLinkCard';

interface DashboardProps {
  links: Link[];
  onLinkCreated: (link: Link) => void;
  onLinksUpdated: (links: Link[]) => void;
}

export function Dashboard({
  links,
  onLinkCreated,
  onLinksUpdated,
}: DashboardProps) {
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const handleEditUrl = (link: Link) => {
    setEditingLink(link);
  };

  const handleSaveLink = (updatedLink: Link) => {
    // Update links in parent component
    const updatedLinks = links.map((link) =>
      link.id === updatedLink.id ? updatedLink : link
    );
    onLinksUpdated(updatedLinks);
    setEditingLink(null);
  };

  return (
    <div>
      {/* Most visited URL */}
      <div style={{ marginBottom: '20px' }}>
        <TopLinkCard />
      </div>

      {/* URL Creation Form */}
      <div style={{ marginBottom: '20px' }}>
        <LinkForm onLinkCreated={onLinkCreated} />
      </div>

      {/* URL Table */}
      <h2 style={{ marginBottom: '12px' }}>Your URLs</h2>
      <LinkTable links={links} onEditUrl={handleEditUrl} />

      {/* Edit Modal */}
      {editingLink && (
        <EditLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          onSave={handleSaveLink}
        />
      )}
    </div>
  );
}
