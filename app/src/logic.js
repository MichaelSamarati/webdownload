import { saveAs } from "file-saver";
import getUrls from 'get-urls';
import JSZip from 'jszip'; 
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


export default async function downloadWebpage(name, link, iterations, extend) {
    console.log("Process started!")
    try {
        const socket = io("http://localhost:5000");

//parameter liste textdatei 
        socket.on('connect', () => {
            //console.log("Connected with server!");
        })
        socket.on('disconnect', () => {
            //console.log("Disconnected!");
        })
        socket.on("text", async function (folder, fileName, msg) {
            const blob = new Blob([msg], { type: "text/plain" });
            zip.folder(folder).file(fileName + ".html", msg);
        })
        socket.on("jpg", async function (folder, fileName, msg) {
            const blob = new Blob([msg]);
            zip.folder(folder).file(fileName + ".jpg", msg, {binary: true});
            //oder zip.folder(folder).file(fileName + ".jpg", blob);
            saveAs(msg, "towplane.jpg");

        })
        socket.on("png", async function (folder, fileName, msg) {
            const blob = new Blob([msg]);
            zip.folder(folder).file(fileName + ".png", msg, {binary: true});
            //oder zip.folder(folder).file(fileName + ".png", blob);
            saveAs(msg, "ms.png");
        })

        socket.on("end", async function (msg) {
            //Generate zip file
            const content = await zip.generateAsync({ type: "blob" });
            //Download zip in browser
            saveAs(content, name+".zip");
            //Save end time and print time difference
            const end = await Date.now();
            await console.log("Process finished!")
            await console.log("Process took "+((end-start)/1000)+" seconds");
            socket.disconnect();
        })
        // socket.on("text", async function (folder, filename, msg) {
        //     const blob = new Blob([msg], { type: "text/plain" });
        //     console.log(blob.size + "  text")
        //     saveAs(blob, "new.txt");

        // })
        // socket.on("jpg", async function (folder, filename, msg) {
        //     const blob = new Blob([msg]);
        //     console.log(blob.size + "  jpg")
        //     saveAs(msg, "towplane.jpg");

        // })
        // socket.on("png", async function (folder, filename, msg) {
        //     const blob = new Blob([msg]);
        //     console.log(blob.size + "  png")
        //     saveAs(msg, "ms.png");

        // })
        socket.on("error", async function (error) {
            console.log(error)
        })
        //Save start time
        const start = Date.now();
        //Initiate website download
        socket.emit("webdownload", {link: link, iterations: iterations, extend: extend});
        //Initilize zip file
        const zip = new JSZip();
        ////Test
        //zip.file("test.txt", "Just to see if zip works");
        
    } catch (e) {
        console.log(e)
        console.log("Process failed!")
    }
}