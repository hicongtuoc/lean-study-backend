import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({ timestamps: true })
export class Lesson {
  @Prop()
  name: string;

  @Prop()
  id: number;
  @Prop()
  course_id: number;
  @Prop()
  image: string;
  @Prop()
  title: string;
  @Prop()
  en_title: string;
  @Prop()
  ja_title: string;
  @Prop()
  ko_title: string;
  @Prop()
  th_title: string;
  @Prop()
  description: string;
  @Prop()
  en_description: string;
  @Prop()
  ko_description: string;
  @Prop()
  ja_description: string;
  @Prop()
  th_description: string;
  @Prop()
  sort: number;
  @Prop()
  checked_feet: number;
  @Prop()
  open_course: number;
  @Prop()
  expired_day: string;

  @Prop()
  lessonId: number;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
