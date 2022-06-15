import { saveAs } from "file-saver";

export default async function downloadWebpage(name, link, iterations){
    console.log("Download started!")
    link = "https://www.dict.cc/";
    try{
        const response = await fetch(link, {mode: 'no-cors'});
        const data = await response.text;
        const blob = new Blob([data], {type: "text/html;charset=utf-8"});
        saveAs(blob, name+".html");

        console.log("Download finished!")
    }catch(e){
        console.log(e)
        console.log("Download finished!")
    }
}