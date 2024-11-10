
export class PaymentRangeList
{
    paymentRangeDetail: PaymentRangeDetail[]=[];
}

export class PaymentRangeDetail
{
    paymentRangeLinkId: number=0;
    minimumValue: number=0;
    maximumValue: number=0;
    percentageFees: number=0;
}
