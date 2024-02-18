import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import { Category } from '../src/book/schema/book.schema';

describe('Book & Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
    await mongoose.connection.db.dropDatabase();
  });
  afterAll(() => mongoose.disconnect());

  const user = {
    name: 'sahit-test',
    email: 'sahitest@gmail.com',
    password: '12345',
  };
  const newBook = {
    title: 'Book 11',
    description: 'This is a good book',
    author: 'sahithi',
    price: 100,
    category: Category.FANTASY,
  };
  let bookCreated;
  let jwtToken = '';
  describe('Auth', () => {
    it('(POST) - REGISTER', async () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
        });
    });
    it('(POST) - LOGIN', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
          jwtToken = res.body.token;
        });
    });
  });
  describe('Book', () => {
    it('(POST) - CREATE A BOOK', async () => {
      return request(app.getHttpServer())
        .post('/book')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(newBook)
        .expect(201)
        .then((res) => {
          expect(res.body._id).toBeDefined();
          expect(res.body.title).toEqual(newBook.title);
          bookCreated = res.body;
        });
    });
    it('(GET) - GET ALL BOOKS', async () => {
      return request(app.getHttpServer())
        .get('/book')
        .send(newBook)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(1);
        });
    });
    it('(GET) - GET A BOOK BY ID', async () => {
      return request(app.getHttpServer())
        .get(`/book/${bookCreated._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body._id).toEqual(bookCreated._id);
        });
    });
    it('(UPDATE) - UPDATE A BOOK BY ID', async () => {
      let book = { title: 'updated book' };
      return request(app.getHttpServer())
        .put(`/book/${bookCreated._id}`)
        .send(book)
        .expect(200)
        .then((res) => {
          expect(res.body.title).toEqual(book.title);
        });
    });
    it('(DELETE) - DELETE A BOOK BY ID', async () => {
      return request(app.getHttpServer())
        .get(`/book/${bookCreated._id}`)
        .expect(200)
        .set('Authorization', 'Bearer ' + jwtToken)
        .then((res) => {
          expect(res.body._id).toEqual(bookCreated._id);
        });
    });
  });
});
