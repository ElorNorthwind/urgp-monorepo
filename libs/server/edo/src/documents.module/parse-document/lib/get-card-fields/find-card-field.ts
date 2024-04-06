import { type HTMLElement } from 'node-html-parser';
import {
  EdoDocLink,
  EdoLinkType,
  EdoUserInfo,
} from '../../../model/types/edo-document';
import {
  getDate,
  getLinks,
  getText,
  getUser,
  getUsers,
} from '../util/parse-edo-field-helpers';

// Стандартизированные искалки нод в карточке документа
export class FindCardField {
  private readonly card: HTMLElement;

  constructor(card: HTMLElement) {
    this.card = card;
  }

  byDataTour(num: number): ParseCardField {
    const node =
      this.card?.querySelector(`[class^='b'][data-tour='${num}']`) || undefined;
    return new ParseCardField(node);
  }

  byTitle(title: string): ParseCardField {
    const titleNodeList =
      this.card?.querySelectorAll(`[class^='titles'], [class*=' titles']`) ||
      [];
    const titleNode = Array.from(titleNodeList).find(
      (titleNode) =>
        new RegExp(`${title}`, 'i').test(titleNode.rawText) &&
        titleNode?.nextElementSibling,
    );
    return new ParseCardField(titleNode?.nextElementSibling);
  }

  byQuery(query: string): ParseCardField {
    const node = this.card?.querySelector(query) || undefined;
    return new ParseCardField(node);
  }

  recepients(): EdoUserInfo[] {
    const firstRecepientNode = this.card
      ?.querySelectorAll(`[class^='titles'], [class*=' titles']`)
      ?.find(
        (titleNode) =>
          new RegExp(`кому:`, 'i').test(titleNode.rawText) &&
          titleNode?.nextElementSibling,
      )?.nextElementSibling;

    const recepientNodes = [
      firstRecepientNode,
      ...this.card?.querySelectorAll('tr.recipient'),
    ];

    return recepientNodes
      .map((node) => {
        const user = new ParseCardField(node).getUser();
        return user;
      })
      .filter((user) => !!user) as EdoUserInfo[];
  }
}

// Рефакторнуть нафиг в абстрактный класс из папки util?
class ParseCardField {
  node: HTMLElement | undefined;

  constructor(node: HTMLElement | undefined) {
    this.node = node || undefined;
  }

  getText(): string | undefined {
    return getText(this?.node);
  }

  getDate(): Date | undefined {
    return getDate(this?.node);
  }

  getUsers(): EdoUserInfo[] {
    return getUsers(this?.node);
  }

  getUser(): EdoUserInfo | undefined {
    return getUser(this?.node);
  }

  getLinks(type: EdoLinkType): EdoDocLink[] {
    return getLinks(this?.node, type);
  }
}
