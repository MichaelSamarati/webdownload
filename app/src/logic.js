import { saveAs } from "file-saver";
import getUrls from 'get-urls';
//import puppeteer from "puppeteer"
import axios from 'axios';
import download from 'downloadjs';
import io from 'socket.io-client';


const socket = io("http://localhost:3080");

socket.on('connect', () => {
    console.log(socket.id);
    socket.emit("webdownload", "Test123");
})

socket.on("zip", function(msg){
    var bufView = new Uint8Array(msg);
    console.log("new Blob(msg), {type: application/zip}");
    saveAs(new Blob(msg), {type: "application/zip"});
 } )

export default async function downloadWebpage(name, link, iterations){
    console.log("Download started!")
    try{
        socket.emit("webdownload", link);
        // console.log("awdwad")
        // console.log(link)
        // const response = await axios.get("http://localhost:3080/webdownload", { 
        //     params: { 
        //         link: link,
        //         name: name,
        //         iterations: iterations
        //     }
        // });
        // await console.log(response);
        // if( response.status!==200){
        //     console.log('Looks like there was a problem. Status Code: ' + response.status);
        //     return;
        // }
        console.log("Download finished!")
    }catch(e){
        console.log(e)
        console.log("Download failed!")
    }
}