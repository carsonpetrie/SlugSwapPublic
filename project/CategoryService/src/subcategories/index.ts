export interface Category {
  categoryid: string;
}

export interface SubCategory {
  subcategoryid: string;
  categoryid: string;
}

export interface DeleteSubCategory {
  subcategoryid: string;
}

export interface EditSubCategory {
  subcategoryid: string;
  newid: string;
}