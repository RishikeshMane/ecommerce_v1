export class ShoppingCartDetails
{
    mobileNo: string='';
    shoppingAddressIndex:number=0;
    orderId: string='';
    paymentId: string='';
    clearShoppingCart:number=1;
    productDetail: ShoppingProductDetail[]=[];
}

export class ShoppingProductDetail
{
    supplierMobileNo: string='';
    userProductId: string='';
    title: string='';
    description: string='';
    sizeLinkId: number=0;
    sizeCode: string='';
    colorLinkId: number=0;
    colorName: string='';
    index: number=0;
    image: string='';
    count: number=0;
    price: number=0;
}