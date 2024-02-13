import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Category {
  ADVENTURE = 'ADVENTURE',
  CLASSICS = 'CLASSICS',
  CRIME = 'CRIME',
  FANTASY = 'FANTASY',
}

@Schema({
  timestamps: true,
})
export class Book {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: Category;
}

export const BookSchema = SchemaFactory.createForClass(Book);
