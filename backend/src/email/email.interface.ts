export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export interface IEmailService {
  sendEmail(options: SendEmailOptions): Promise<boolean>;
}
