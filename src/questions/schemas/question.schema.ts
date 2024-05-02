import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
  @Prop()
  id: number;
  @Prop()
  question_id: string;
  @Prop()
  code: string;
  @Prop()
  audio: string;
  @Prop()
  picture: string;
  @Prop()
  status: string;
  @Prop()
  content: string;
  @Prop()
  trans: string;
  @Prop()
  phonetic: string;
  @Prop()
  hint: string;
  @Prop()
  correct: string;
  @Prop()
  kanji: string;
  @Prop()
  hiragana: string;
  @Prop()
  sentence_en: string;
  @Prop()
  sentence_vi: string;
  @Prop()
  correct_extend: string;
  @Prop()
  en_trans: string;
  @Prop()
  en_hint: string;
  @Prop()
  vi_hint: string;
  @Prop()
  multi_answer: string;
  @Prop()
  created_at: Date;
  @Prop()
  updated_at: Date;
  @Prop()
  ko_trans: string;
  @Prop()
  th_trans: string;
  @Prop()
  ja_trans: string;
  @Prop()
  ko_hint: string;
  @Prop()
  th_hint: string;
  @Prop()
  ja_hint: string;
  @Prop()
  wm_id: number;
  @Prop()
  review: number;
  @Prop()
  position: string;
  @Prop()
  lesson_id: string;
  @Prop()
  course_id: number;
  @Prop()
  answer: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
