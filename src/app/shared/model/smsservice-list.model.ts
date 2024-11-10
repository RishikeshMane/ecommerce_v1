
export class SMSServiceList
{
    smsServiceDetail: SMSServiceDetail[]=[];
}

export class SMSServiceDetail
{
    smsServiceLinkId: number=0;
    smsServiceName: string='';
    activeNow: number=0;
}
