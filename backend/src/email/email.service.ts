import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import { AppConfig } from '../config/configuration';
import { IEmailService, SendEmailOptions } from './email.interface';

@Injectable()
export class NodemailerEmailService implements IEmailService {
  private readonly logger = new Logger(NodemailerEmailService.name);
  private readonly transporter: Transporter;
  private readonly senderEmail: string;

  constructor(configService: ConfigService<AppConfig, true>) {
    this.senderEmail =
      configService.get<string>('nodemailerEmail', { infer: true }) ?? '';
    const password =
      configService.get<string>('nodemailerPassword', { infer: true }) ?? '';

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.senderEmail,
        pass: password,
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    const { to, subject, text, html } = options;
    const recipients = Array.isArray(to) ? to.join(', ') : to;

    try {
      await this.transporter.sendMail({
        from: `"Snip" <${this.senderEmail}>`,
        to: recipients,
        subject,
        text,
        html,
      });

      this.logger.log(`Email sent successfully to: ${recipients}`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send email to ${recipients}: ${message}`);
      return false;
    }
  }
}
