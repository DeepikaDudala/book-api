import { IsEAN, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../schema/book.schema';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsEnum(Category)
  category: Category;
}
