import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  location: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const serviceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon: z.string().optional(),
  image: z.string().optional(),
  features: z.string().default('[]'), // JSON string array
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  location: z.string().optional(),
  client: z.string().optional(),
  images: z.string().default('[]'), // JSON string array
  services: z.string().default('[]'), // JSON string array
  completedAt: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const settingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  tagline: z.string().optional(),
  address: z.string().optional(),
  phones: z.string().default('[]'), // JSON string array
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  workingHours: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  
  // SMTP Settings
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  smtpFrom: z.string().optional(),
  
  // Quotation Settings
  quotationPrefix: z.string().optional(),
  quotationValidity: z.number().optional(),
  defaultTaxRate: z.number().optional(),
  defaultTerms: z.string().optional(),
  currency: z.string().optional(),
  
  heroHeadline: z.string().optional(),
  heroSubheadline: z.string().optional(),
  heroCta: z.string().optional(),
  heroCtaSecondary: z.string().optional(),
  aboutText: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
