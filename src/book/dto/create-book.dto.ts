import { Category } from '../schema/book.schema';

export class CreateBookDto {
  title: string;
  description: string;
  author: string;
  price: number;
  category: Category;
}
