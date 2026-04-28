import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Imap, { MailBoxes } from 'imap';
import PostalMime from 'postal-mime';

type ParsedEmail = {
  subject: string;
  from: {
    address: string;
    name: string;
  };
  to: {
    address: string;
    name: string;
  }[];
  date: string;
  text: string;
  html: string;
  attachments: any[];
  uid: number;
  flags: string[];
};

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private imap: Imap;

  constructor(private configService: ConfigService) {
    this.initializeImap();
  }

  onModuleInit() {
    // Optional: Connect automatically when module initializes
    // this.connect();
  }

  private initializeImap() {
    // TODO: move Login\Pass settings to BD layer (changes too often)
    const user = this.configService.get<string>('EMAIL_USER');
    const password = this.configService.get<string>('EMAIL_PASSWORD');
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT');

    if (!user || !password || !host || !port) {
      throw new Error('Email configuration is missing');
    }

    this.imap = new Imap({
      user,
      password,
      host,
      port,
      tls: true,
      // tls: true,
      tlsOptions: { rejectUnauthorized: false },
      // authTimeout: 3000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    this.imap.on('ready', () => {
      isDev && this.logger.log('IMAP connection ready');
    });

    this.imap.on('error', (err) => {
      this.logger.error(`IMAP error: ${err.message}`);
    });

    this.imap.on('end', () => {
      isDev && this.logger.log('IMAP connection ended');
    });
  }

  /**
   * Connect to IMAP server
   */
  connect(): Promise<void> {
    this.logger.log('Connecting to IMAP server...');

    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        resolve();
      });

      this.imap.once('error', (err) => {
        reject(err);
      });

      this.imap.connect();
    });
  }

  /**
   * Disconnect from IMAP server
   */
  disconnect(): void {
    if (this.imap && this.imap.state === 'authenticated') {
      this.imap.end();
    }
  }

  /**
   * Get all mailboxes/folders
   */
  async getMailboxes(): Promise<MailBoxes> {
    return new Promise((resolve, reject) => {
      this.imap.getBoxes((err, boxes) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(boxes);
      });
    });
  }

  /**
   * Open a mailbox
   */
  async openMailbox(
    mailboxName: string,
    readonly: boolean = true,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(mailboxName, readonly, (err, box) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(box);
      });
    });
  }

  /**
   * Search for emails with criteria
   */
  async searchEmails(criteria: any[]): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.imap.search(criteria, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  /**
   * Fetch emails by UIDs
   */
  async fetchEmails(uids: number[]): Promise<any[]> {
    type EmailContents = {
      seqno: number;
      attributes: Imap.ImapMessageAttributes | null;
      body: string;
    };

    return new Promise((resolve, reject) => {
      const emails: EmailContents[] = [];
      const fetch = this.imap.fetch(uids, {
        bodies: '',
        struct: true,
      });

      fetch.on('message', (msg, seqno) => {
        const email: EmailContents = {
          seqno,
          attributes: null,
          body: '',
        };

        msg.on('attributes', (attrs) => {
          email.attributes = attrs;
        });

        msg.on('body', (stream, info) => {
          let buffer = '';

          stream.on('data', (chunk) => {
            buffer += chunk.toString('utf8');
          });

          stream.on('end', () => {
            email.body = buffer;
          });
        });

        msg.on('end', () => {
          emails.push(email);
        });
      });

      fetch.on('error', (err) => {
        reject(err);
      });

      fetch.on('end', () => {
        resolve(emails);
      });
    });
  }

  /**
   * Mark emails as read
   */
  async markAsRead(uids: number[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.addFlags(uids, '\\Seen', (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  /**
   * Parse raw email data
   */
  async parseEmail(rawEmail: string): Promise<any> {
    try {
      const parsed = await PostalMime.parse(rawEmail);
      return {
        subject: parsed.subject,
        from: parsed.from,
        to: parsed.to,
        date: parsed.date,
        text: parsed.text,
        html: parsed.html,
        attachments: parsed.attachments,
      };
    } catch (error: any) {
      this.logger.error(
        `Error getting unread emails: ${error?.message ?? error ?? 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Get unread emails from inbox
   */
  async getUnreadTeletribeEmails(
    limit: number = 10,
    markAsRead: boolean = true,
  ): Promise<ParsedEmail[]> {
    try {
      await this.connect();

      // Open mailbox
      await this.openMailbox('Teletribe', !markAsRead);

      // Search for unread emails
      const uids = await this.searchEmails(['UNSEEN']); //(['UNSEEN']);

      // Limit results
      const limitedUids = uids.slice(-limit);

      if (limitedUids.length === 0) {
        this.disconnect();
        return [];
      }

      // Fetch emails
      const emails = await this.fetchEmails(limitedUids);

      // Parse each email
      const parsedEmails = await Promise.all(
        emails.map(async (email) => {
          const parsed = await this.parseEmail(email.body);
          return {
            ...parsed,
            uid: email.attributes?.uid,
            flags: email.attributes?.flags,
            date: email.attributes?.date,
          };
        }),
      );

      // Mark as seen if requested
      if (markAsRead && limitedUids.length > 0) {
        await this.markAsRead(limitedUids);
      }

      this.disconnect();
      return parsedEmails;
    } catch (error: any) {
      this.logger.error(
        `Error getting unread emails: ${error?.message ?? error ?? 'Unknown error'}`,
      );
      this.disconnect();
      throw error;
    }
  }

  async getTeletribeCode(): Promise<number | null> {
    try {
      const email = await this.getUnreadTeletribeEmails(1, true).then(
        (e) => e?.[0],
      );
      if (!email) return null;
      const match = email.text.match(
        /Ваш\sкод\sдля\sвхода\sв\sРС\:\n(\d{4})\n/,
      );
      if (!match || !match[1]) return null;
      return parseInt(match[1]);
    } catch (error: any) {
      this.logger.error(
        `Error getting unread emails: ${error?.message ?? error ?? 'Unknown error'}`,
      );
      return null;
    }
  }
}
