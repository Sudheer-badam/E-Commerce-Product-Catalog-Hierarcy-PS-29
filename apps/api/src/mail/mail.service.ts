import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'your.email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password',
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    if (!to || to === 'N/A' || !to.includes('@')) {
      this.logger.warn(`Skipping email, invalid address: ${to}`);
      return false;
    }
    
    try {
      const info = await this.transporter.sendMail({
        from: `"ShopSmart Admin" <${process.env.SMTP_USER || 'admin@shopsmart.com'}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Error sending email to ${to}: ${error.message}`);
      return false;
    }
  }
}
