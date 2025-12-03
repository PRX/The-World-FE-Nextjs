/**
 * @file setCtaCookie.ts
 */

import cookie from 'react-cookies';
import { getCookieKey } from './getCookieKey';

/**
 * Set cookie for a CTA region message.
 *
 * @param region
 *    Region the message was shown in.
 * @param id
 *    Identifier of the message.
 * @param hash
 *    Content hash to use as cookie value.
 * @param maxAgeDays
 *    Number of hours cookie should be expired for.
 */
export const setCtaCookie = (id: string, hash: string, maxAgeDays?: number) => {
  const key = getCookieKey(id);
  const maxAge = (maxAgeDays || 0) * 24 * 60 * 60 * 1000;
  const expires = new Date(Date.now() + maxAge);
  const options = {
    ...(maxAge && { maxAge, expires }),
    path: '/'
  };
  cookie.save(key, hash, options);
};
