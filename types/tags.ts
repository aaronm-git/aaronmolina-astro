export interface Tag {
  title: string;
  slug: string;
  description: string;
  color: string;
  category?: TagCategory;
}

export type TagCategory = 
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'cms'
  | 'tools'
  | 'design';

export type Tags = Tag[]; 