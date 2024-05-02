import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Lesson, LessonDocument } from 'src/lessons/schemas/lesson.schema';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private questionModel: SoftDeleteModel<QuestionDocument>,
    @InjectModel(Lesson.name)
    private lessonModel: SoftDeleteModel<LessonDocument>,
    private readonly httpService: HttpService,
  ) {}
  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question';
  }

  waitforme(millisec) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('');
      }, millisec);
    });
  }

  async findAll() {
    const data = await this.lessonModel.find().exec();
    const idsLesson = data.map((course) => course.lessonId);
    let countQuestion = 0;
    for (let i = idsLesson.length - 1; i >= 0; i--) {
      console.log('idsLesson[i]: ', idsLesson[i]);
      await this.waitforme(1000);
      try {
        // TODO
        const dataQuestion = await firstValueFrom(
          this.httpService.get(
            `https://mochien-server.mochidemy.com/v3.0/mobile/question?lesson_id=${84}&user_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxNDk4NDI5LCJ0b2tlbiI6IjY2MGFlYWJhMDI3YWUiLCJpcCI6IjQyLjExOC40OS4yMjAifQ._oi9Jqa49fUZUwc2qfvNODucM8yeyv4g-do2t8BR4B0`,
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
        // const convertData = dataQuestion.data.data.map((question) => {
        //   return {
        //     ...question,
        //     lessonId: idsLesson[i],
        //   };
        // });
        await this.questionModel.insertMany(dataQuestion.data.data);

        countQuestion = countQuestion + dataQuestion.data.data.length;
      } catch (err) {
        console.log('err: ', err);
      }
    }
    return 'countQuestion: ' + countQuestion;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
