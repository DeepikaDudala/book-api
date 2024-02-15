import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schema/book.schema';
import mongoose, { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from 'src/auth/schema/user.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private BookModel: Model<Book>) {}

  async findAll(query: Query): Promise<Book[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const books = await this.BookModel.find(keyword)
      .limit(resPerPage)
      .skip(skip);
    return books;
  }

  async findById(id: string): Promise<Book> {
    this.isValidId(id);
    const book = await this.BookModel.findById(id);
    if (!book) throw new NotFoundException(`Book not Found`);
    return book;
  }

  async create(book: CreateBookDto, user: User): Promise<Book> {
    const res = await this.BookModel.create({ ...book, user: user._id });
    return res;
  }

  async updateById(id: string, book: UpdateBookDto): Promise<Book> {
    this.isValidId(id);
    return await this.BookModel.findByIdAndUpdate(id, book, { new: true });
  }

  async deleteById(id: string): Promise<Book> {
    this.isValidId(id);
    return await this.BookModel.findByIdAndDelete(id);
  }

  isValidId(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new BadRequestException(`Invalid Id`);
  }
}
