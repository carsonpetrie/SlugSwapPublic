import {
  Controller,
  Get,
  Route,
  Path,
  Response,
  Post,
  SuccessResponse,
  Body,
} from 'tsoa';

import { SubCategory, DeleteSubCategory, EditSubCategory } from '.';
import { SubCategoryService } from './service';

@Route('subcategory')
export class SubCategoryController extends Controller {
  @Get("{categoryid}")
  public async getAll(
    @Path() categoryid: string,
  ): Promise<SubCategory[]> {
    return new SubCategoryService().getAll(categoryid);
  }
  
  @Post('create')
  @Response('409', 'Sub Category with name already exists or unauthorized.')
  @SuccessResponse('201', 'Sub Category created')
  public async create(@Body() subcategory: SubCategory) {
    return new SubCategoryService().create(subcategory.subcategoryid, subcategory.categoryid)
      .then(async (subcategory: SubCategory|undefined) => {
        return subcategory;
      }, () => {
        this.setStatus(409);
      });
  }

  @Post('delete')
  @Response('404', 'Error')
  public async delete(
    @Body() subcategoryID: DeleteSubCategory
  ): Promise<void|SubCategory|undefined> {
    return new SubCategoryService().delete(subcategoryID.subcategoryid)
      .then(async (subcategory: SubCategory|undefined): Promise<SubCategory|undefined> => {
        if(subcategory) {
          return subcategory;
        } else {
          this.setStatus(404);
        }
      });
  }

  // "Liam's Way"
  @Post('edit')
  @Response('404', 'Error')
  public async edit(
    @Body() editReq: EditSubCategory
  ): Promise<void|SubCategory|undefined> {
    return new SubCategoryService().edit(editReq.subcategoryid, editReq.newid)
      .then(async (subcategory: SubCategory) => {
        return subcategory;
      }, () => {
        this.setStatus(404);
      });
  }
}