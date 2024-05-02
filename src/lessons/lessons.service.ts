import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from 'src/courses/schemas/course.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Lesson, LessonDocument } from './schemas/lesson.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: SoftDeleteModel<CourseDocument>,
    @InjectModel(Lesson.name)
    private lessonModel: SoftDeleteModel<LessonDocument>,
    private readonly httpService: HttpService,
  ) {}

  create(createLessonDto: CreateLessonDto) {
    return 'This action adds a new lesson';
  }

  waitforme(millisec) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('');
      }, millisec);
    });
  }

  async findAll() {
    const data = await this.courseModel.find().exec();
    const idsCourse = data.map((course) => course.courseId);
    let countLesson = 0;
    for (let i = idsCourse.length - 1; i >= 0; i--) {
      await this.waitforme(1000);
      try {
        // TODO
        const dataLesson = await firstValueFrom(
          this.httpService.get(
            `https://mochien-server.mochidemy.com/v3.0/mobile/lesson-ios?course_id=${idsCourse[i]}&page=1&offset=350&user_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxNDk4NDI5LCJ0b2tlbiI6IjY2MGFlYWJhMDI3YWUiLCJpcCI6IjQyLjExOC40OS4yMjAifQ._oi9Jqa49fUZUwc2qfvNODucM8yeyv4g-do2t8BR4B0`,
            {
              headers: {
                accept: 'application/json, text/plain, */*',
                'accept-language':
                  'vi,vi-VN;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                authorization:
                  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxNDk4NDI5LCJ0b2tlbiI6IjY2MGFlYWJhMDI3YWUiLCJpcCI6IjQyLjExOC40OS4yMjAifQ._oi9Jqa49fUZUwc2qfvNODucM8yeyv4g-do2t8BR4B0',
                'cache-control': 'no-cache',
                pragma: 'no-cache',
                privatekey: 'M0ch1M0ch1_En_$ecret_k3y',
                'sec-ch-ua':
                  '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                Referer: 'https://learn.mochidemy.com/',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
              },
              method: 'GET',
            },
          ),
        );
        const convertData = dataLesson.data.data.map((lesson) => {
          return {
            ...lesson,
            lessonId: lesson.id,
          };
        });
        // await this.lessonModel.insertMany(convertData);
        countLesson = countLesson + dataLesson.data.pagination.total;
      } catch {}
    }
    return 'countLesson: ' + countLesson;
  }

  findOne(id: number) {
    return `This action returns a #${id} lesson`;
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} lesson`;
  }
}
