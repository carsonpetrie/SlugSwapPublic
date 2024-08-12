import {
  Query, 
  Resolver, 
  Arg,
  Authorized,
  Mutation,
} from "type-graphql"
// import type { NextApiRequest } from 'next'

import {
  Category, 
  CategoryID, 
  EditCategory, 
  SubCategory,
  DeleteSubCategory,
  EditSubCategory,
} from "./schema"
import { CategoryService } from "./service";

@Resolver()
export class CategoryResolver {
  // List categories
  @Query(() => [Category])
  async GetCategories(
  ): Promise<Category[]> {
    return new CategoryService().getCategories();
  }

  // Creates a new category
  @Authorized("admin")
  @Mutation(() => Category)
  async CreateCategory(
    @Arg("input") categoryInput: Category,
  ): Promise<Category> {
    return new CategoryService().create(categoryInput);
  }

  // Deletes a category
  @Authorized("admin")
  @Mutation(() => Category)
  async DeleteCategory(
    @Arg("input") categoryInput: Category,
  ): Promise<Category> {
    return new CategoryService().delete(categoryInput);
  }

  // Edits a category
  @Authorized("admin")
  @Mutation(() => Category)
  async EditCategory(
    @Arg("input") categoryInput: EditCategory,
  ): Promise<Category> {
    return new CategoryService().edit(categoryInput);
  }

  // List subcategories
  @Query(() => [SubCategory])
  async GetSubCategories(
    @Arg("categoryid") categoryid: CategoryID,
  ): Promise<SubCategory[]> {
    return new CategoryService().getSubCategories(categoryid.categoryid);
  }

  // Creates a new subcategory
  @Authorized("admin")
  @Mutation(() => SubCategory)
  async CreateSubCategory(
    @Arg("input") subcategoryInput: SubCategory,
  ): Promise<SubCategory> {
    return new CategoryService().createSubCategory(subcategoryInput);
  }

  // Deletes a subcategory
  @Authorized("admin")
  @Mutation(() => SubCategory)
  async DeleteSubCategory(
    @Arg("input") categoryInput: DeleteSubCategory,
  ): Promise<SubCategory> {
    console.log(categoryInput);
    return new CategoryService().deleteSubCategory(categoryInput);
  }

  // Edits a subcategory
  @Authorized("admin")
  @Mutation(() => SubCategory)
  async EditSubCategory(
    @Arg("input") categoryInput: EditSubCategory,
  ): Promise<SubCategory> {
    return new CategoryService().editSubCategory(categoryInput);
  }
}