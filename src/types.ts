/**
 * TrueTone AI Type Definitions
 */

export interface Profile {
  id: string;
  fullName: string;
  avatarUrl: string;
  theme: 'light' | 'dark' | 'system';
  notifEmail: boolean;
  notifProduct: boolean;
  onboardingCompleted?: boolean;
}

export type SubscriptionPlan = 'trial' | 'early_bird' | 'pro' | 'custom';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';

export interface Subscription {
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string; // ISO string
  historyRetentionDays: number; // 7, 30, 90, 0 (unlimited)
}

export interface CreditWallet {
  userId: string;
  balance: number;
  lifetimePurchased: number;
  lifetimeSpent: number;
}

export type CreditReason = 'signup_bonus' | 'topup' | 'subscription_grant' | 'generation' | 'refund';

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  delta: number;
  reason: CreditReason;
  refId?: string; // e.g. project/generation id
  balanceAfter: number;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  lastGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SourceImage {
  id: string;
  projectId: string;
  storagePath: string; // Base64 or local URL representation
  width?: number;
  height?: number;
  mime: string;
  createdAt: string;
}

export type GenerationStatus = 'queued' | 'processing' | 'done' | 'failed';

export interface Generation {
  id: string;
  projectId: string;
  sourceImageId: string;
  promptText: string;
  stylePreset: string; // 'contemporary' | 'minimal' | 'scandinavian' | 'coastal' | 'terracotta'
  layoutType: string;  // 'full_wall' | 'accent_wall' | 'two_tone' | 'comparison'
  status: GenerationStatus;
  resultImageUrls: string[]; // 1..N images
  creditsCost: number;
  meta?: {
    geminiRequestId?: string;
    paletteUsed?: string[];
    timings?: {
      start: number;
      end: number;
    };
    error?: string;
  };
  createdAt: string;
}

export interface ExtractedColor {
  id: string;
  generationId: string;
  hex: string;
  rgb: string;
  name: string;
  brandMatch: string;
  swatchOrder: number;
}

export interface UsageEvent {
  id: string;
  userId?: string;
  event: string;
  props: Record<string, any>;
  createdAt: string;
}

export interface DatabaseSchema {
  profiles: Record<string, Profile>;
  subscriptions: Record<string, Subscription>;
  creditWallets: Record<string, CreditWallet>;
  creditLedger: CreditLedgerEntry[];
  projects: Record<string, Project>;
  sourceImages: Record<string, SourceImage>;
  generations: Record<string, Generation>;
  extractedColors: ExtractedColor[];
  usageEvents: UsageEvent[];
}
