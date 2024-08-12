import {
  Body,
  Controller,
  Post,
  Get,
  Route,
  Response,
  SuccessResponse,
} from 'tsoa';

import { 
  EditCategory, 
  Category,
} from '.';
import { CategoryService } from './service';

@Route('category')
export class CategoryController extends Controller {
  @Get('')
  public async getAll(): Promise<Category[]> {
    return new CategoryService().getAll();
  }

  // How do we secure this endpoint from the backend?
  @Post('create')
  @Response('409', 'Category with name already exists or unauthorized.')
  @SuccessResponse('201', 'Category created')
  public async create(@Body() category: Category): Promise<Category|undefined> {
    return new CategoryService().create(category.categoryid)
      .then(async (created: Category|undefined): Promise<Category|undefined> => {
        if(!created) {
          this.setStatus(409);
        } else {
          return created;
        }
      });
  }

  @Post('delete')
  @Response('404', 'Error')
  public async delete(
    @Body() categoryID: Category
  ): Promise<void|Category|undefined> {
    return new CategoryService().delete(categoryID.categoryid)
      .then(async (category: Category|undefined): Promise<Category|undefined> => {
        if(category) {
          return category;
        } else {
          this.setStatus(404);
        }
      });
  }

  // "Liam's Way"
  @Post('edit')
  @Response('404', 'Error')
  public async edit(
    @Body() editReq: EditCategory
  ): Promise<void|Category|undefined> {
    return new CategoryService().edit(editReq.categoryid, editReq.newid)
      .then(async (category: Category) => {
        return category;
      }, () => {
        this.setStatus(404);
      });
  }
}