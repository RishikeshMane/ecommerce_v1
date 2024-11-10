
export class PaymentGatewayList
{
    paymentGatewayDetail: PaymentGatewayDetail[]=[];
}

export class PaymentGatewayDetail
{
    paymentGatewayLinkId: number=0;
    paymentGatewayName: string='';
    activeNow: number=0;
}
