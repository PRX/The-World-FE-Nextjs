import { Maybe } from '@interfaces';

/**
 * Wrap lines then do not have HTML tag wrapper with <p> tags.
 * @param content Content string to add paragraph tags to.
 * @returns Paragraph wrapped content string.
 */
const wrapLineBreaksWithParagraphs = (content?: Maybe<string>) =>
  content
    ?.split(/(?:\n|(?:\\r)?\\n)+/g)
    .map((p) => (/^(?!\s*<).+/.test(p) ? `<p>${p}</p>` : p))
    .join('');

export default wrapLineBreaksWithParagraphs;
