import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schema/book.schema';
import { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';

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
    const book = await this.BookModel.findById(id);
    if (!book) throw new NotFoundException(`Book not Found`);
    return book;
  }

  async create(book: Book): Promise<Book> {
    const res = await this.BookModel.create(book);
    return res;
  }

  async updateById(id: string, book: Book): Promise<Book> {
    return await this.BookModel.findByIdAndUpdate(id, book, { new: true });
  }

  async deleteById(id: string): Promise<Book> {
    return await this.BookModel.findByIdAndDelete(id);
  }
}
