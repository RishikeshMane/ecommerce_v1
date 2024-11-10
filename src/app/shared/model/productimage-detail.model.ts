export class ProductImageDetail
{
    constructor(imageName: string, showHide: boolean){
        this.imageName = imageName;
        this.showHide = showHide;
    };
    
    imageName: string='';
    showHide: boolean=false;
}
