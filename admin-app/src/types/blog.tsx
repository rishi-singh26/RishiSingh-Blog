import { Author } from "./author";

export type Blog = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  draft: boolean;
  html: string;
  views: number;
  canonicalUrl: string;
  User: Author,
  tags: string;
  createdAt: string,
  updatedAt: string,
}