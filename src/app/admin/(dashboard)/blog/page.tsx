'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/blog?all=true');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, slug: string) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    setDeleting(id);
    try {
      await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
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
          <h1 className="text-2xl font-bold text-navy-900">Blog Posts</h1>
          <p className="text-navy-500 mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="admin-card text-center py-12">
          <p className="text-navy-500 mb-4">No blog posts yet</p>
          <Link href="/admin/blog/new">
            <Button>Create your first post</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="admin-card">
              <div className="flex items-start gap-4">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-navy-100 flex items-center justify-center">
                    <span className="text-navy-400 text-sm">No image</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-navy-900">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {post.category && (
                          <span className="text-xs bg-navy-100 text-navy-600 px-2 py-0.5 rounded">
                            {post.category}
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            post.isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {post.isFeatured && (
                          <span className="text-xs bg-solar-100 text-solar-700 px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.isPublished && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/blog/${post.slug}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id, post.slug)}
                        disabled={deleting === post.id}
                        className="text-red-600 hover:bg-red-50"
                      >
                        {deleting === post.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {post.excerpt && (
                    <p className="text-navy-500 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2 text-xs text-navy-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
