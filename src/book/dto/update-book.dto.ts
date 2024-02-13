import { Category } from '../schema/book.schema';

export class UpdateBookDto {
  title: string;
  description: string;
  author: string;
  price: number;
  category: Category;
}
