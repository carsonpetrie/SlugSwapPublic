import { Field, ObjectType, InputType, ID } from "type-graphql";
import { Matches, Length, ArrayMaxSize, Min, Max } from "class-validator";

@InputType()
export class ListingID {
  @Field(() => ID)
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    listingid!: string
}

@ObjectType()
export class ListingData {
  @Field()
    title!: string
  @Field(()=> [String])
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}\.webp$/, { each: true })
  @ArrayMaxSize(5)
    imgs!: string[]
  @Field()
  @Length(0, 1000)
    description!: string
  @Field()
    dateCreated!: string
  @Field()
  @Min(0)
  @Max(999999.99)
    price!: number
}

@ObjectType()
export class Listing {
  @Field(() => ID)
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    listingid!: string
  @Field(() => ID)
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    posterid!: string
  @Field()
  @Length(1, 128)
    categoryid!: string
  @Field()
    data!: ListingData
}
