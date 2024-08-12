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

@ObjectType({ description: "Edit Category info"})
@InputType("edit_category_input")
export class EditCategory {
  @Field()
  @Length(3, 20)
    categoryid!: string;

  @Field()
  @Length(3, 20)
    newid!: string;
}

@ObjectType({ description: "Edit Category info results"})
@InputType("edit_category_input")
export class EditCategoryResult {
  @Field()
  @Length(3, 20)
    categoryid?: string;
}

@ObjectType({ description: "SubCategory info"})
@InputType("subcategory_input")
export class SubCategory {
  @Field()
  @Length(3, 20)
    subcategoryid!: string;
  @Field()
  @Length(3, 20)
    categoryid!: string;
}

@ObjectType({ description: "DeleteSubCategory info"})
@InputType("delete_subcategory_input")
export class DeleteSubCategory {
  @Field()
  @Length(3, 20)
    subcategoryid!: string;
}

@ObjectType({ description: "Edit Category info"})
@InputType("edit_subcategory_input")
export class EditSubCategory {
  @Field()
  @Length(3, 20)
    subcategoryid!: string;

  @Field()
  @Length(3, 20)
    newid!: string;
}

@InputType()
export class CategoryID {
  @Field()
  @Length(3, 20)
    categoryid!: string
}