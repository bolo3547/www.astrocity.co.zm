'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';

interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  isActive: boolean;
  order: number;
}

export default function ClientLogosPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchLogos();
  }, []);

  async function fetchLogos() {
    try {
      const res = await fetch('/api/client-logos');
      const data = await res.json();
      setLogos(data);
    } catch (error) {
      console.error('Failed to fetch logos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this logo?')) return;
    
    setDeleting(id);
    try {
      await fetch(`/api/client-logos/${id}`, { method: 'DELETE' });
      setLogos(logos.filter(l => l.id !== id));
    } catch (error) {
      console.error('Failed to delete logo:', error);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-solar-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Client Logos</h1>
          <p className="text-navy-500 mt-1">Showcase your clients and partners</p>
        </div>
        <Link href="/admin/client-logos/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Logo
          </Button>
        </Link>
      </div>

      {logos.length === 0 ? (
        <div className="admin-card text-center py-12">
          <p className="text-navy-500 mb-4">No client logos yet</p>
          <Link href="/admin/client-logos/new">
            <Button>Add your first client logo</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {logos.map((logo) => (
            <div key={logo.id} className="admin-card p-4 text-center">
              <div className="h-20 flex items-center justify-center mb-3">
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-sm font-medium text-navy-900 truncate">{logo.name}</p>
              <span
                className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                  logo.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {logo.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Link href={`/admin/client-logos/${logo.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(logo.id)}
                  disabled={deleting === logo.id}
                  className="text-red-600 hover:bg-red-50"
                >
                  {deleting === logo.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
