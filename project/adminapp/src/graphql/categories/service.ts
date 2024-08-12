// import { WorkspaceService } from '../workspace/service';
import {
  Category,
  EditCategory, 
  SubCategory,
  DeleteSubCategory,
  EditSubCategory,
} from './schema';

import { 
  dbCreateCategory, 
  dbDeleteCategory,
  dbEditCategory, 
  dbGetCategory,
  dbGetSubCategory,
  dbCreateSubCategory,
  dbDeleteSubCategory,
  dbEditSubCategory,
} from './categoryDB';

export class CategoryService {
  // GET all categories
  public async getCategories(): Promise<Category[]> {
    return dbGetCategory(); 
  }

  // CREATE category
  public async create(category: Category): Promise<Category> {
    return dbCreateCategory(category.categoryid);
  }

  // DELETE category
  public async delete(category: Category): Promise<Category> {
    return dbDeleteCategory(category.categoryid);
  }

  // EDIT category
  public async edit(category: EditCategory): Promise<Category> {
    return dbEditCategory(category.categoryid, category.newid);
  }

  // Get all subcategories of a category
  public async getSubCategories(categoryid: string): Promise<SubCategory[]> {
    return dbGetSubCategory(categoryid);
  }

  // CREATE subcategory
  public async createSubCategory(subcategory: SubCategory): Promise<SubCategory> {
    return dbCreateSubCategory(subcategory.categoryid, subcategory.subcategoryid);
  }

  // DELETE subcategory
  public async deleteSubCategory(subcategory: DeleteSubCategory): Promise<SubCategory> {
    return dbDeleteSubCategory(subcategory.subcategoryid);
  }

  // EDIT category
  public async editSubCategory(subcategory: EditSubCategory): Promise<SubCategory> {
    return dbEditSubCategory(subcategory.subcategoryid, subcategory.newid);
  }
}