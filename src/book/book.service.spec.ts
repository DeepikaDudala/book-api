import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from './schema/book.schema';
import mongoose, { Document, Model, ObjectId } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { User } from '../auth/schema/user.schema';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookService', () => {
  let bookService: BookService;
  let model: Model<Book>;

  let mockBook = {
    title: 'Book 11',
    description: 'This is a good book',
    author: 'sahithi',
    price: 100,
    category: 'FANTASY',
    user: '65ccb6a5c1dac304a00e2751',
    _id: '65cf58c6753e980a90ab1c65',
    createdAt: '2024-02-16T12:44:54.428Z',
    updatedAt: '2024-02-16T12:44:54.428Z',
    __v: 0,
  };
  let mockUser = {
    _id: '65cf58c6753e980a90ab1c65',
    email: 'sahisu@gmail.com',
    password: '12345',
  };
  const mockBookService = {
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('findAll', () => {
    it(`should return array of Books`, async () => {
      const query = { page: '1', keyword: 'test' };
      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockBook]),
            }),
          }) as any,
      );
      const result = await bookService.findAll(query);

      expect(model.find).toHaveBeenCalledWith({
        title: { $regex: 'test', $options: 'i' },
      });
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findById', () => {
    it('should find and return a book by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);

      const result = await bookService.findById(mockBook._id);

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });

    it(`should throw BadRequestException if Invalid ID is Provided`, async () => {
      const id = 'invalid-id';

      const isValidObjectIdMoock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(bookService.findById(id)).rejects.toThrow(
        BadRequestException,
      );

      isValidObjectIdMoock.mockRestore();
    });

    it(`should throw NotFoundException if Book not Found`, async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(bookService.findById(mockBook._id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(`create`, () => {
    it(`should create a book`, async () => {
      const mockBook: (Document<unknown, {}, Book> &
        Book & { _id: ObjectId })[] = [];
      jest.spyOn(model, 'create').mockResolvedValue(mockBook);
      const newBook = {
        title: 'Book 11',
        description: 'This is a good book',
        author: 'sahithi',
        price: 100,
        category: 'FANTASY',
      };
      const result = await bookService.create(
        newBook as CreateBookDto,
        mockUser as User,
      );

      expect(result).toEqual(mockBook);
    });
  });

  describe('updateId', () => {
    it(`should update a book`, async () => {
      const mockUpdatedBook = { ...mockBook, title: `updated book` };
      const book = { title: `updated book` };
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedBook);

      const result = await bookService.updateById(
        mockBook._id,
        book as UpdateBookDto,
      );
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, book, {
        new: true,
      });
      expect(result).toEqual(mockUpdatedBook);
    });

    it(`should throw BadRequestException if Invalid Id is Provided`, async () => {
      const id = `invalud_id`;
      const book = { title: `updated book` };

      const isValidObjectId = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);
      await expect(
        bookService.updateById(id, book as UpdateBookDto),
      ).rejects.toThrow(BadRequestException);
      isValidObjectId.mockRestore();
    });
  });

  describe('deleteById', () => {
    it(`should delete a Book`, async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook);

      const result = await bookService.deleteById(mockBook._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook);
      expect(result).toEqual(mockBook);
    });
  });
});
