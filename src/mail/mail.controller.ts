import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
  ) {}

  @Get()
  @Public()
  @ResponseMessage('Mail sent successfully')
  async sendMailTest() {
    await this.mailerService.sendMail({
      to: 'hicongtuoc@gmail.com',
      from: '"Support Team" <support@example.com>',
      subject: 'Testing Nest MailerModule ✔',
      html: '<b>Welcome to Nest MailerModule LONGLD</b>',
    });
  }
}
