import { saveAs } from "file-saver";
import getUrls from 'get-urls';
//import puppeteer from "puppeteer"

export default async function downloadWebpage(name, link, iterations){
    console.log("Download started!")
    try{
        // const response = await fetch(link, {mode: 'no-cors'});
        // const data = await response.text;
        // const blob = new Blob([data], {type: "text/html;charset=utf-8"});
        // saveAs(blob, name+".html");

        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link);
        await page.screenshot({ path: 'example.png' });
      

        const array = await getUrls("");
        // // await browser.close();


        console.log("Download finished!")
    }catch(e){
        console.log(e)
        console.log("Download finished!")
    }
}