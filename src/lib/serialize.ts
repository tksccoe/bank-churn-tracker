import type { Account, Offer } from '@/types';

type PlainObject = Record<string, unknown> & {
  _id?: { toString(): string };
  userId?: { toString(): string };
};

/** Convert a Mongoose document (or a plain object) into a plain object. */
function toPlain(doc: object): PlainObject {
  if ('toObject' in doc && typeof doc.toObject === 'function') {
    return doc.toObject() as PlainObject;
  }
  return { ...doc } as PlainObject;
}

/** Shape an Offer document for JSON / client consumption (`_id` → `id`). */
export function serializeOffer(doc: object): Offer {
  const obj = toPlain(doc);
  return {
    ...obj,
    id: obj._id?.toString(),
    _id: undefined,
    __v: undefined,
  } as unknown as Offer;
}

/** Shape an Account document for JSON / client consumption (`_id` → `id`, Map → object). */
export function serializeAccount(doc: object): Account {
  const obj = toPlain(doc);
  return {
    ...obj,
    id: obj._id?.toString(),
    userId: obj.userId?.toString(),
    monthlyFeeFreeMet:
      obj.monthlyFeeFreeMet instanceof Map
        ? Object.fromEntries(obj.monthlyFeeFreeMet)
        : obj.monthlyFeeFreeMet ?? {},
    _id: undefined,
    __v: undefined,
  } as unknown as Account;
}
