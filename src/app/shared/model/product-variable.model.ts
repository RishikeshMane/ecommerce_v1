import { ColorDetail } from "./color-detail.model";
import { SizeDetail } from "./size-detail.model";

export class ProductVariable
{
    constructor(index: number){this.index = index;}
    
    index: number=0;
    sizeDetail: SizeDetail=new SizeDetail();
    colorDetail: ColorDetail=new ColorDetail();
    imageUrls: string[]=[];
    price: number=0;
    discount: number=0;
    inventory: number=0;
    imageShow: boolean=false;
}
