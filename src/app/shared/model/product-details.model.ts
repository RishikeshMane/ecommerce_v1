import { ProductVariable } from "./product-variable.model";
import { ProductComments } from "./product-comments.model";

export class ProductDetails
{
    userProductId: string='';
    supplierMobileno: number=0;
    title: string='';
    description: string='';
    productVariables: ProductVariable[]=[];
    category: string='';
    subCategory: string='';
    categoryLinkId: number=0;
    subCategoryLinkId: number=0;
    comments: ProductComments[]=[];
}
