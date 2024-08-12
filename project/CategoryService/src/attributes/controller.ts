import {
  Controller,
  Get,
  Route,
  Path,
} from 'tsoa';

import { Attributes } from '.';
import { AttributeService } from './service';

@Route('attribute')
export class AttributeController extends Controller {
  @Get("{subcategoryid}")
  public async getAttributes(
    @Path() subcategoryid: string,
  ): Promise<Attributes> {
    return new AttributeService().getAttributes(subcategoryid);
  }
}