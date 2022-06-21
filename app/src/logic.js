import { saveAs } from "file-saver";
import getUrls from 'get-urls';
//import puppeteer from "puppeteer"
import axios from 'axios';
import download from 'downloadjs';
import io from 'socket.io-client';
//import ss from 'socket.io-stream';
//import fs from 'fs';

/*

            //console.log(buffer.length+" awdw ads");
            //onsole.log("new Blob(buffer), {type: application/zip}");
            //const bytes = Buffer.from(buffer);
function b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t+=String.fromCharCode(n[i])}return window.btoa(t)}
            //console.log(buffer.length+" awdw ads");
            //onsole.log("new Blob(buffer), {type: application/zip}");
            //const bytes = Buffer.from(buffer);
            //const reader = new FileReader();

                        // const blob = await new Blob([msg], {type: "image/jpeg;base64"});
            //const blob = reader.readAsDataURL(new Blob([msg], {type: "image/jpeg;base64"}));


            //console.log(buffer.length+" awdw ads");
            //onsole.log("new Blob(buffer), {type: application/zip}");
            //const bytes = Buffer.from(buffer);

                        //const blob = await new Blob([msg], {type: "image/png;base64"});
            //const reader = new FileReader();
            //const blob = reader.readAsDataURL(new Blob([msg], {type: "image/png;base64"}));


        //  ss(socket).on('zip', function(stream) {
        //     stream.pipe(fs.createWriteStream(filename)); 
        //     stream.on('end', function (file) {
        //       console.log('file received');
        //       saveAs(file, "new.zip");
        //     });
        //   });


                
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
*/


export default async function downloadWebpage(name, link, iterations) {
    console.log("Download started!")
    try {
        const socket = io("http://localhost:3080");

        socket.on('connect', () => {
            console.log(socket.id);
            socket.emit("webdownload", "Test123");
        })

        socket.on("text", async function (path, msg) {
            const blob = new Blob([msg], { type: "text/plain" });
            console.log(blob.size + "  text")
            saveAs(blob, "new.txt");

        })
        socket.on("jpg", async function (msg) {
            const blob = new Blob([msg]);
            console.log(blob.size + "  jpg")
            saveAs(msg, "towplane.jpg");

        })
        socket.on("png", async function (msg) {
            const blob = new Blob([msg]);
            console.log(blob.size + "  png")
            saveAs(msg, "ms.png");

        })

        socket.emit("webdownload", link);

        console.log("Download finished!")
    } catch (e) {
        console.log(e)
        console.log("Download failed!")
    }
}