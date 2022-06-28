import { saveAs } from "file-saver";
import JSZip from 'jszip'; 
//import puppeteer from "puppeteer"
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


export default async function downloadWebpage(incrementFileCount, name, link, iterations, extend, adjustPage) {
    console.log("Process started!")
    try {
        //Save start time
        const start = Date.now();

        const socket = io("http://localhost:5000");
        var currentIteration;
        socket.on('connect', () => {
            //console.log("Connected with server!");
        })
        socket.on('disconnect', () => {
            //console.log("Disconnected!");
        })
        socket.on("text", async function (folder, fileName, extension, msg) {
            incrementFileCount(currentIteration);
            //const blob = new Blob([msg], { type: "text/plain" });
            zip.folder(folder).file(fileName + "."+extension, msg);
            //saveAs(blob, fileName + "."+extension)
        })
        socket.on("image", async function (folder, fileName, extension, msg) {
            incrementFileCount(currentIteration);
            //const blob = new Blob([msg]);
            //saveAs(msg, fileName+"."+extension);
            zip.folder(folder).file(fileName + "."+extension, msg, {binary: true});
            //oder zip.folder(folder).file(fileName + ".jpg", blob);
        })
        socket.on("status", async function (iteration) {
            currentIteration = iteration;
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
        socket.on("error", async function (error) {
            console.log(error)
        })
        

        //Initiate website download
        socket.emit("webdownload", {link: link, iterations: iterations, extend: extend, adjustPage: adjustPage});
        //Initilize zip file
        const zip = new JSZip();
        
    } catch (e) {
        console.log(e)
        console.log("Process failed!")
    }
}