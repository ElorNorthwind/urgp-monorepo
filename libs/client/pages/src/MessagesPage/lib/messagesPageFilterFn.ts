import { Row } from '@tanstack/react-table';
import { MessagesPageSearch, UnansweredMessage } from '@urgp/shared/entities';

export function renovationMessagesFilterFn(
  row: Row<UnansweredMessage>,
  columnId: string,
  filterValue: MessagesPageSearch,
): boolean {
  const { author } = filterValue;

  if (
    author &&
    !((row.original?.author || '') + (row.original?.lastMessageAuthor || ''))
      ?.toLowerCase()
      .replace('ё', 'е')
      .includes(author.toLowerCase().replace('ё', 'е'))
  ) {
    return false;
  }

  return true;
}
