import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PassportModule } from '@nestjs/passport';
import { CreateBookDto } from './dto/create-book.dto';
import { Category } from './schema/book.schema';

describe('BookController', () => {
  let bookService: BookService;
  let bookController: BookController;

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
    findAll: jest.fn().mockResolvedValue([mockBook]),
    findById: jest.fn().mockResolvedValue(mockBook),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn().mockResolvedValue(mockBook),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [BookController],
      providers: [
        BookService,
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();
    bookController = module.get<BookController>(BookController);
    bookService = module.get<BookService>(BookService);
  });
  it(`should be defined`, () => {
    expect(BookController).toBeDefined();
  });
  describe('getAllBooks', () => {
    it(`should get all books`, async () => {
      const result = await bookController.getAllBooks({
        page: '1',
        keyword: 'test',
      });
      expect(bookService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });
  describe('getBook', () => {
    it(`should return a book`, async () => {
      const result = await bookController.getBook(mockBook._id);
      expect(bookService.findById).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });
  describe('createBook', () => {
    it('should create a book', async () => {
      jest.spyOn(bookService, 'create').mockResolvedValue(mockBook as any);
      const newBook = {
        title: 'Book 11',
        description: 'This is a good book',
        author: 'sahithi',
        price: 100,
        category: Category.FANTASY,
      };
      const result = await bookController.createBook(
        newBook as CreateBookDto,
        mockUser,
      );
      expect(bookService.create).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });
  describe('updateBook', () => {
    it('should update a book', async () => {
      const mockUpdatedBook = { ...mockBook, title: `updated book` };
      const book = { title: `updated book` };
      jest
        .spyOn(bookService, 'updateById')
        .mockResolvedValue(mockUpdatedBook as any);

      const result = await bookController.updateBook(mockBook._id, book as any);
      expect(bookService.updateById).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedBook);
    });
  });
  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const result = await bookController.deleteBook(mockBook._id);

      expect(bookService.deleteById).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });
});
