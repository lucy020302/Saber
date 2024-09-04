import * as XLSX from 'xlsx'

export function Download(data,fileName){
    console.log('文件导出');
    const bookSheet=XLSX.utils.json_to_sheet(data);
    //工作簿
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,bookSheet,fileName);
    //写入
    XLSX.writeFile(wb,`${fileName}.xlsx`)
}

export function Upload(){
    console.log('文件导入')
}

export function fileDownload(url,fileName){
    console.log('模板下载');
    const link=document.createElement('a');
    link.href=url;
    link.download=fileName;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 100);
}
