import { ProductVariable } from "./product-variable.model";

export class ProductDetail
{
    userMobileNo: number=0;
    addUpdate: string='';
    userProductId: string='';
    title: string='';
    description: string='';
    productVariables: ProductVariable[]=[];
    categoryLinkId: number=0;
    subCategoryLinkId: number=0;
    ////files: FormData = new FormData;
    ///files: File[] = [];
    ///files: File|undefined;
}
