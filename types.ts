import { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  isNew?: boolean;
  isPopular?: boolean;
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