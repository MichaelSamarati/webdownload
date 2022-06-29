import { saveAs } from "file-saver";
import JSZip from 'jszip';
import io from 'socket.io-client';

export default async function downloadWebpage(isDownload, incrementFileCount, name, link, iterations, extend, adjustPage) {
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
            zip.folder(folder).file(fileName + "." + extension, msg);
            //saveAs(blob, fileName + "."+extension)
        })
        socket.on("image", async function (folder, fileName, extension, msg) {
            incrementFileCount(currentIteration);
            //const blob = new Blob([msg]);
            //saveAs(msg, fileName+"."+extension);
            zip.folder(folder).file(fileName + "." + extension, msg, { binary: true });
            //oder zip.folder(folder).file(fileName + ".jpg", blob);
        })
        socket.on("status", async function (iteration) {
            currentIteration = iteration;
        })

        socket.on("end", async function (msg) {
            isDownload.current = false;
        })
        socket.on("error", async function (error) {
            console.log(error)
        })

        //Initilize zip file
        const zip = new JSZip();

        //Initiate website download
        socket.emit("webdownload", { link: link, iterations: iterations, extend: extend, adjustPage: adjustPage });

        async function finish() {
            //Generate zip file
            const content = await zip.generateAsync({ type: "blob" });
            //Download zip in browser
            saveAs(content, name + ".zip");
            //Save end time and print time difference
            const end = Date.now();
            console.log("Process finished!")
            console.log("Process took " + ((end - start) / 1000) + " seconds");
            try {
                socket.disconnect();
            } catch (e) {

            }
        }
        let intervalCheck;
        function checkForCancel() {
            if (!isDownload.current) {
                clearInterval(intervalCheck);
                socket.emit("cancel", "Cancel process!")
                finish();
            }
        }
        intervalCheck = setInterval(() => checkForCancel(), 50)
    } catch (e) {
        console.log(e)
        console.log("Process failed!")
    }
}