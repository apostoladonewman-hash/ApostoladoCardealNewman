export interface Testimonial {
  slug: string;
  person: string;
  denomination_from: string;
  excerpt: string;
  content: string;
  date: string;
}

export interface Post {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
}
