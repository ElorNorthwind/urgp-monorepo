import { CellContext } from '@tanstack/react-table';
import { UnansweredMessage } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { MessageCircleQuestion, MessageCircleReply } from 'lucide-react';

function MessageCell(
  props: CellContext<UnansweredMessage, string>,
): JSX.Element {
  const message = props.row.original;

  return (
    <div className="flex w-full flex-col items-stretch justify-start gap-1">
      <div className="flex flex-row items-center justify-start gap-1 truncate rounded border border-emerald-200 bg-emerald-50 px-2 py-1">
        <p className="whitespace-nowrap opacity-50">
          {format(new Date(message.createdAt), 'dd.MM.yyyy')}
        </p>
        <b className="whitespace-nowrap">{message.author + ': '}:</b>

        <p className="truncate">{message.messageContent}</p>
        <MessageCircleQuestion className="ml-auto h-4 w-4 flex-shrink-0 opacity-40" />
      </div>

      <div className="flex flex-row items-center justify-start gap-1 truncate rounded border border-slate-200 bg-slate-50 px-2 py-1">
        {message.lastMessageId && message.lastMessageId !== message.id ? (
          <>
            <p className="whitespace-nowrap  opacity-50">
              {format(
                new Date(message.lastMessageCreatedAt || ''),
                'dd.MM.yyyy',
              )}
            </p>
            <b className="whitespace-nowrap">
              {message.lastMessageAuthor + ': '}:
            </b>
            <p className="truncate">{message.lastMessageContent}</p>
            <MessageCircleReply className="ml-auto h-4 w-4 flex-shrink-0 opacity-40" />
          </>
        ) : (
          <p className="w-full whitespace-nowrap text-center opacity-20">
            ожидает решения
          </p>
        )}
      </div>
    </div>
  );
}

export { MessageCell };
