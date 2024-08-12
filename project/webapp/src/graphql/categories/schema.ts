/* 
#######################################################################
#
# Copyright (C) 2022-2023 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import {Field, ObjectType, InputType, } from "type-graphql"
import {Length} from "class-validator";

@ObjectType({ description: "Category info"})
@InputType("add_category_input")
export class Category {
  @Field()
  @Length(3, 20)
    categoryid!: string;
}

@ObjectType({ description: "SubCategory info"})
export class SubCategory {
  @Field()
  @Length(3, 20)
    subcategoryid!: string;
  @Field()
  @Length(3, 20)
    categoryid!: string;
}

@ObjectType({ description: "SubCategory attributes"})
export class Attributes {
  @Field()
    attributes!: string;
}

@InputType()
export class CategoryID {
  @Field()
  @Length(3, 20)
    categoryid!: string
}

@InputType()
export class SubCategoryID {
  @Field()
  @Length(3, 20)
    subcategoryid!: string
}