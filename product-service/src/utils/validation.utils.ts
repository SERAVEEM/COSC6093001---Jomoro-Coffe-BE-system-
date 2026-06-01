export function isValidProductName(name:string) : boolean {
    if (!name) return false;
    // trim untuk mnghapus spasi di awal dan akhir, split untuk memisahkan kata, filter untuk membuang kata yang kosong
    const words = name.trim().split(' ').filter(word => word.length > 0); 
    return words.length >=3;
}

export function isValidProductDescription (description:string) : boolean {
    if (!description) return false;
    return description.length >= 20;
}

export function isValidProductPrice (price:any):boolean { //karena browser biasanya ngirim di kirim dalam bentuk raw JSON  jadi lebih aman kalau pakai type any
    if (!price) return false;

    const num = Number(price);
    //ini untuk ngecek harus number, an integer, dan >=1
    return !isNaN(num) && Number.isInteger(num) && num >=1;
}

export function isValidProductStock(stock:any): boolean {
    if(stock == null || stock == undefined) return false;
    const num = Number(stock);
    return !isNaN(num) && Number.isInteger(num) && num >=0 && num <=999;
}