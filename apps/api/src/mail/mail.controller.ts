import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendEmail(@Body() body: { to: string; subject: string; html: string }) {
    const success = await this.mailService.sendMail(body.to, body.subject, body.html);
    return { success };
  }
}
