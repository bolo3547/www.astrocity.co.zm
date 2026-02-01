import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog & News - AstroCity',
  description: 'Latest news, tips, and insights about solar energy, water solutions, and sustainable living.',
};

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });
    return posts;
  } catch {
    return [];
  }
}

function formatDate(date: Date | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function estimateReadTime(content: string) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featuredPost = posts.find(p => p.isFeatured) || posts[0];
  const otherPosts = posts.filter(p => p.id !== featuredPost?.id);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-50 to-white py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
              Blog & News
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Insights & Updates
            </h1>
            <p className="text-lg text-navy-600">
              Stay informed with the latest news, tips, and insights about solar energy, 
              water solutions, and sustainable living.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-16">
                  <Link href={`/blog/${featuredPost.slug}`} className="group block">
                    <div className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      {featuredPost.coverImage ? (
                        <div className="aspect-video lg:aspect-auto lg:h-full overflow-hidden">
                          <img
                            src={featuredPost.coverImage}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video lg:aspect-auto lg:h-full bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center">
                          <span className="text-6xl text-navy-300">📝</span>
                        </div>
                      )}
                      <div className="p-8 lg:p-12">
                        {featuredPost.category && (
                          <span className="inline-block px-3 py-1 bg-solar-100 text-solar-700 text-sm font-medium rounded-full mb-4">
                            {featuredPost.category}
                          </span>
                        )}
                        <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4 group-hover:text-solar-600 transition-colors">
                          {featuredPost.title}
                        </h2>
                        {featuredPost.excerpt && (
                          <p className="text-navy-600 text-lg mb-6 line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-navy-500 mb-6">
                          {featuredPost.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(featuredPost.publishedAt)}
                            </span>
                          )}
                          {featuredPost.author && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {featuredPost.author}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {estimateReadTime(featuredPost.content)}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-2 text-solar-600 font-semibold group-hover:gap-3 transition-all">
                          Read Article <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Other Posts Grid */}
              {otherPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                        {post.coverImage ? (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center">
                            <span className="text-4xl text-navy-300">📝</span>
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          {post.category && (
                            <span className="inline-block self-start px-2 py-0.5 bg-solar-100 text-solar-700 text-xs font-medium rounded-full mb-3">
                              {post.category}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-solar-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-navy-600 text-sm mb-4 line-clamp-2 flex-1">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-navy-500 mt-auto">
                            {post.publishedAt && (
                              <span>{formatDate(post.publishedAt)}</span>
                            )}
                            <span>•</span>
                            <span>{estimateReadTime(post.content)}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">📝</span>
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Coming Soon</h2>
              <p className="text-navy-500 text-lg">
                We're working on bringing you valuable content. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
