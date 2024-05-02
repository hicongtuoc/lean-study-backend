import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop()
  id: number;

  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  en_title: string;

  @Prop()
  th_title: string;

  @Prop()
  ko_title: string;

  @Prop()
  ja_title: string;

  @Prop()
  description: string;

  @Prop()
  en_description: string;

  @Prop()
  ko_description: string;

  @Prop()
  th_description: string;

  @Prop()
  ja_description: string;

  @Prop()
  outcome: string;

  @Prop()
  ja_outcome: string;

  @Prop()
  ko_outcome: string;

  @Prop()
  th_outcome: string;

  @Prop()
  active_language: string;

  @Prop()
  courseId: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
