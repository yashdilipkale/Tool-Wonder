import { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
  creditCost?: number;
}

export type ToolCategory = 
  | 'image' 
  | 'document' 
  | 'calculator' 
  | 'text' 
  | 'developer' 
  | 'color' 
  | 'seo' 
  | 'utility';

export interface CategoryDefinition {
  id: ToolCategory;
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string; // Tailwind class
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  description?: string;
  popular?: boolean;
  credits?: number; // Credits included with this plan
}

export interface UserCredits {
  current: number;
  totalEarned: number;
  plan: 'free' | 'pro' | 'enterprise';
  lastReset: Date;
}
