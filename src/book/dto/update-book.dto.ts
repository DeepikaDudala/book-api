import {
  IsEAN,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../schema/book.schema';
import { User } from '../../auth/schema/user.schema';

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

  @IsEmpty({ message: 'user doesnot require infprmation' })
  user: User;
}
