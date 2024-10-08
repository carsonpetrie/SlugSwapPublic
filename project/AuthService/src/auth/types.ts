/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 * @example "52907745-7672-470e-a803-a2f8feb52944"
 */
export type UUID = string;

/**
 * Taken from here https://regexr.com/3e48o
 * @pattern ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
 * @example "user@example.com"
 */
export type email = string;

export interface Credentials {
  email: email,
  password: string,
}

export interface AuthCheck {
  encryptedToken: string,
  roles: string[],
}

export interface User {
  userid: string,
  name: string,
  roles: string[],
  accessToken: string
}

export interface Account {
  userid: UUID,
  name: string,
  roles: string[],
}

export type SessionUser = {
  userid: string,
  name: string,
  roles: string[],
}
