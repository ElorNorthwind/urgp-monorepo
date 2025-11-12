import {
  TelegramMessageRecord,
  TelegramMessageRecordUpsert,
  UnchangedResolution,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { letters } from './sql/sql';
import { Logger } from '@nestjs/common';

// @Injectable()
export class LettersRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  upsertTelegramMessageRecord(q: TelegramMessageRecordUpsert) {
    const sql = this.pgp.as.format(
      `INSERT INTO public.telegram_messages 
    (chat_id, message_id, case_id, message_type, reply_user_id, reply_user_name, reply_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7::timestamp(0) with time zone) 
    ON CONFLICT (id) DO UPDATE 
    SET message_type = excluded.message_type, 
    chat_id = excluded.chat_id,
    message_id = excluded.message_id,
    case_id = excluded.case_id,
    reply_user_id = excluded.reply_user_id, 
    reply_user_name = excluded.reply_user_name, 
    reply_date = excluded.reply_date;`,
      [
        q?.chatId || null,
        q?.messageId || null,
        q?.caseId || null,
        q?.messageType || null,
        q?.replyUserId || null,
        q?.replyUserName || null,
        q?.replyDate || null,
      ],
    );
    // Logger.debug(sql);
    return this.db.none(sql);
  }

  getTelegramMessageRecord(id: number) {
    const sql = `SELECT id, 
    chat_id as "chatId",
    message_id as "messageId",
    case_id as "caseId",
    created_at as "createdAt", 
    message_type as "messageType", 
    reply_user_id as "replyUserId", 
    reply_user_name as "replyUserName", 
    reply_date as "replyDate" 
    FROM public.telegram_messages 
    WHERE id = $1;`;
    return this.db.oneOrNone(sql, [id]);
  }

  getUnchangedResolutions(): Promise<UnchangedResolution[]> {
    return this.db.any(letters.getUnchangedResolutions);
  }

  updateCaseNotificationDate(ids: number[]): Promise<number> {
    if (!ids || !ids.length) {
      return Promise.resolve(0);
    }

    const sql = this.pgp.as.format(
      `UPDATE public.cases c
SET need_resolution_change_notification_date = (CURRENT_TIMESTAMP)::timestamp(0) without time zone
WHERE c."CaseID" = ANY(ARRAY[$1:list]::bigint[]);`,
      [ids],
    );
    return this.db
      .none(sql)
      .then(() => 1)
      .catch(() => 0);
  }
}
