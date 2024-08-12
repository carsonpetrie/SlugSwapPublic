import { Field, ObjectType, ArgsType } from "type-graphql";
import { Matches } from "class-validator";

@ObjectType()
export class chatID {
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    chatid!: string
}

@ArgsType()
export class InitChat {
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    listingID!: string
}

@ObjectType()
export class ChatData {
  @Field()
    createdAt!: string
  @Field()
    lastUsed!: string
}

@ObjectType()
export class Chat {
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    chatid!: string
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    listingid!: string
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    ownerid!: string
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    inquirerid!: string
  @Field()
    data!: ChatData
}

@ArgsType()
export class ChatRequest {
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    chatID!: string
}

@ArgsType()
export class MessageInput extends ChatRequest {
  @Field()
    message!: string
}

@ObjectType()
export class MessageData {
  @Field()
    sentAt!: string
  @Field()
    message!: string
}

@ObjectType()
export class Message {
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    chatid!: string
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    messageid!: string
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    senderid!: string
  @Field()
    data!: MessageData
}
