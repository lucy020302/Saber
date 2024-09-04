export default (date, format = 'YYYY-MM-DD hh:mm:ss') => {
    if(date instanceof Date){
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0')

        return format.replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('hh', hours)
            .replace('mm', minutes)
            .replace('ss', seconds)
    }else{
        return date
    }
}