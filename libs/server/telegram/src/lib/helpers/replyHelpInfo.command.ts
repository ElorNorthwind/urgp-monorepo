import { CommandContext, Context } from 'grammy';

export const replyHelpInfo = async (ctx: CommandContext<Context>) => {
  ctx.reply(
    `Это бот оповещений для сервиса [Кон\\(троль\\)](http://10.9.96.230/control)\\.
Для проверки статуса поручений используйте команду /status\\.`,
    {
      parse_mode: 'MarkdownV2',
    },
  );
};
