import { Field, ObjectType, InputType, ID, } from "type-graphql";
import { Matches, Length, ArrayMaxSize, Min, Max } from "class-validator";
import { GraphQLScalarType } from "graphql";

@InputType()
export class ListingInput {
  @Field()
  @Length(1, 128)
    categoryid!: string
  @Field()
  @Length(1, 128)
    subcategoryid!: string
  @Field()
  @Length(1, 200)
    title!: string
  @Field()
  @Length(0, 1000)
    description!: string
  @Field()
    price!: number
  @Field(() => [FileScalar])
    images!: File[]
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
  @Field()
    pending!: string
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

@InputType()
export class ListingID {
  @Field(() => ID)
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    listingid!: string
}

@InputType()
export class ListingTitle {
  @Field({nullable: true})
  @Length(1, 200)
    title?: string
}

@InputType()
export class ListingPoster {
  @Field()
  @Matches(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/)
    posterid!: string
}

const FileScalar = new GraphQLScalarType({
  name: 'File',
  description: 'The `File` scalar type represents a file upload.',
})
 
@InputType()
export class ListingCategory {
  @Field({nullable: true})
  @Length(1, 200)
    category?: string
}

@InputType()
export class ListingSubCategory {
  @Field({nullable: true})
  @Length(1, 200)
    subcategory?: string
}

@InputType()
export class ListingAttributes {
  @Field({nullable: true})
  @Length(1, 350)
    attributes?: string
}