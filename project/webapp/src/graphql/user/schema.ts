import { Field, ObjectType, InputType, ID, ArgsType } from "type-graphql"
import { Matches, Length } from "class-validator";

@InputType()
export class UserInput {
  @Field()
  @Matches(/^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    email!: string
  @Field()
  @Length(8, 24)
    password!: string
  @Field()
  @Length(1, 20)
    name!: string
}

@InputType()
export class UserDataInput {
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    userid!: string
  @Field()
    description!: string
}

@ArgsType()
export class UserID {
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    userid!: string
}

@ObjectType()
export class UserData {
  @Field()
    name!: string
  @Field({nullable: true})
    avatar?: string
  @Field(()=>[String], {nullable: "itemsAndList"})
    roles!: string[]
  @Field()
    timestamp!: string
  @Field()
    description!: string
}

@ObjectType()
export class User {
  @Field(() => ID)
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    userid!: string
  @Field()
    data!: UserData
}

@InputType()
export class deleteUser {
  @Field(() => ID)
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    userid!: string

}
