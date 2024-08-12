import {
  Query, 
  Resolver, 
  Arg,
} from "type-graphql"
// import type { NextApiRequest } from 'next'

import {Attributes, Category, CategoryID, SubCategory, SubCategoryID} from "./schema"
import { CategoryService } from "./service";

@Resolver()
export class CategoryResolver {
  // List categories
  @Query(() => [Category])
  async GetCategories(
  ): Promise<Category[]> {
    return new CategoryService().getCategories();
  }

  // List subcategories
  @Query(() => [SubCategory])
  async GetSubCategories(
    @Arg("categoryid") categoryid: CategoryID,
  ): Promise<SubCategory[]> {
    return new CategoryService().getSubCategories(categoryid.categoryid);
  }

  @Query(() => Attributes)
  async GetAttributes(
    @Arg("subcategoryid") subcategoryid: SubCategoryID,
  ): Promise<Attributes> {
    return new CategoryService().getAttributes(subcategoryid.subcategoryid);
  }
}