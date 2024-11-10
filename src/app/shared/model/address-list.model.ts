
export class AddressList
{
    addresses: AddressDetail[]=[];
}

export class AddressDetail
{
    country: string='';
    state: string='';
    city: string='';
    pincode: string='';
    address: string='';
    isDeliveryAddress: number=0;
    flagCode: string='in';
}
