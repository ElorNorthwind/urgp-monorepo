import { Controller, Get, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailBoxes } from 'imap';

@Controller('imap') // word 'email' is banned in our network :). (i'm not even kidding)
export class EmailController {
  constructor(private readonly email: EmailService) {}

  @Get('connect')
  Connect(): Promise<void> {
    return this.email.connect();
  }

  @Get('teletribe')
  async GetTeletribMail(): Promise<any> {
    return this.email.getTeletribeCode();
  }
}
