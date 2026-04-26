export type ProductCopyRequest = {
  name: string;
  category?: string;
  features?: string[];
};

export type ProductCopyResponse = {
  short_description: string;
  bullet_points: string[];
  seo_title: string;
};