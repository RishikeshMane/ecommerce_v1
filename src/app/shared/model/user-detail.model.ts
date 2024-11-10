import { AddressList } from "./address-list.model";

export class UserDetail
{
    firstName: string='';
    lastName: string='';
    phone: string='';
    email: string='';
    password: string='';
    country: string='';
    state: string='';
    city: string='';
    pincode: number=0;
    address1: string='';
    address2: string='';
    store: string='';
    userRole: string='Buyer';
    subscribe: boolean=false;
    deliveryPinCodes: string[]=[];
    moreAddressCount:number=0;
    flagCode: string='in';
    address: AddressList = new AddressList;
}