/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 * @example "52907745-7672-470e-a803-a2f8feb52944"
 */
export type UUID = string;

export interface InitChat {
  listingID: UUID,
  inquirerID: UUID,
}

export interface ChatRequest {
  chatID: UUID,
  requesterID: UUID,
}

export interface Chat {
  chatid: UUID,
  listingid: UUID,
  ownerid: UUID,
  inquirerid: UUID,
  data: ChatData,
}

interface ChatData {
  createdAt: string,
  lastUsed: string,
}
