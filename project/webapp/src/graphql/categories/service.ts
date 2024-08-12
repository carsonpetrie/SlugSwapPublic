import {Category, SubCategory, Attributes} from './schema';
import { 
  dbGetAttribute,
  dbGetCategory,
  dbGetSubCategory
} from './categoryDB';

export class CategoryService {
  public async getCategories(): Promise<Category[]> {
    return dbGetCategory(); 
  }

  public async getSubCategories(categoryid: string): Promise<SubCategory[]> {
    return dbGetSubCategory(categoryid);
  }

  public async getAttributes(subcategoryid: string): Promise<Attributes> {
    return dbGetAttribute(subcategoryid);
  }
}