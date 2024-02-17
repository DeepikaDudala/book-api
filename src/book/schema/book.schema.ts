import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../auth/schema/user.schema';
export enum Category {
  ADVENTURE = 'ADVENTURE',
  CLASSICS = 'CLASSICS',
  CRIME = 'CRIME',
  FANTASY = 'FANTASY',
}

@Schema({
  timestamps: true,
})
export class Book extends Document {
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;
}

export const BookSchema = SchemaFactory.createForClass(Book);
