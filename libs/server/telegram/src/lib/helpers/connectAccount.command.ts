import { CommandContext, Context } from 'grammy';
import { TelegramService } from '../telegram.service';

export const connectAccount = async (
  ctx: CommandContext<Context>,
  parentThis: TelegramService,
) => {
  if (
    !ctx?.match ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      ctx.match,
    )
  ) {
    throw new Error(
      'Для привязки учетной записи нужен корректный токен... Пройдите по ссылке на сайте!',
    );
  }

  const user = await parentThis.dbService.db.renovationUsers.getUserByToken(
    ctx.match,
  );
  if (!user?.id || !ctx?.message?.chat?.id) {
    throw new Error('Не найден токен пользователя!');
  }
  await parentThis.dbService.db.renovationUsers.setUserChatId(
    user?.id,
    ctx.message.chat.id,
  );

  ctx.reply(`Добрый день! Учетная запись ${user?.fio} привязана.`);
};
