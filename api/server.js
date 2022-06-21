//TODO fileextension if known default html
        //files without http at start search in href and src tags; 
        // stay on root
        //communication with client
        //make sure dont block each other aysnc await
        //evtl file limit or so
        //comment everything at end
        //do permanently updates so probably websocket with client ;; 


import getUrls from 'get-urls';
import axios from 'axios';
import cors from 'cors';
import JSZip from 'jszip';
import fs from 'fs';
import extractUrls from 'extract-urls';
import { Server } from 'socket.io';
//import ss from 'socket.io-stream'
//import { Stream } from 'stream';

const io = new Server({
    cors: {
        origin: ["http://localhost:3000"]
    }
  });
  
  io.on("connection", socket => {
    console.log("Connected with socket id: "+socket.id);

    // socket.on('webdownload', function () {
    //   var stream = ss.createStream();
    //   stream.on('end', function () {
    //       console.log('file sent');
    //   });
    //   ss(socket).emit('zip', stream); 
    //   fs.createReadStream("tile.zip").pipe(stream);
    // });  

    socket.on("webdownload",  (arg) => {
        console.log("link"+arg);

        const zip = new JSZip();
        zip.file("test.txt", "Just to see if zip works");
        zip.generateAsync({ type: "base64", compression: 'DEFLATE' });
        //fs.writeFile('test10.zip', zip.generate({ type: "nodebuffer" }), 'binary', function (error) {});
        //     console.log('wrote test1.zip', error);
        // });
        //var bufArr = new ArrayBuffer(zip);
        //socket.binaryType = 'arraybuffer';
        //console.log(f.length+ "length send")
        //stream.pipe(fs.createWriteStream('test10.zip'));
        //socket.emit("zip", {'file':zip.toString('base64')});
        //socket.emit("zip", fs.createReadStream('file.jpg'))
        socket.emit("zip", {'file':zip.toString('base64')});
        //socket.emit(fs.createReadStream(zip.generate({ type: "nodebuffer" })));

    });
    socket.on("status",  () => {
        console.log("status");

    });
  });
  io.listen(3080);

  

// var app = express();
// var port = 3080;

// app.use(cors());

// app.get('/', function (req, res) {
//     res.send('Hello World!');
// });

// app.get('/webdownload', function async(req, res) {
//     console.log(req.query.link + " was the request");
//     (async function () {
//         const d = await download(req.query.link, req.query.name, req.query.iterations);
//         res.set({
//             'Content-Type': 'application/zip',
//         });
//         res.status(200).send(d);
//     })();

// });

// app.listen(port, function () {
//     console.log('Webdownload api listening on port ' + port + '!');
// });





// async function download(link, name, iterations) {
//     console.log("Process started!")
//     try {
//         const start = Date.now();


//         //Initilize zip file
//         const zip = new JSZip();
//         //Set to uniquely save the visited urls 
//         const urlVisitedSet = new Set();
//         //Array to hold current urls of level
//         var urls = new Array();
//         //Add starting url to array
//         urls.push(link);
//         //Set to save urls extracted from current level
//         const extractedUrls = new Set();

//         //Test
//         zip.file("test.txt", "Just to see if zip works");

//         //Goes iterations deep in new pages
//         while(iterations>0){
//             //Goes every url in this level of deepness through
//             for(let i = 0; i<urls.length; i++){
//                 //Get Data from url
//                 const pageHtml = await pageDownload(urls[i]);
//                 if(typeof pageHtml !== 'string'){
//                     //JSON.stringify(pageHtml);
//                     continue;
//                 }
//                 //Parse foldername and filename for file in zip
//                 const urlWithoutHttps = await removeHttp(urls[i]);
//                 await console.log("urlWithoutHttps="+urlWithoutHttps);
//                 const fileName = await urlWithoutHttps.substring(urlWithoutHttps.lastIndexOf('/') + 1);
//                 //await console.log("fileName="+fileName);
//                 const folderName = await urlWithoutHttps.substring(urlWithoutHttps.lastIndexOf('/') + 1, '\0');
//                 //await console.log("folderName="+folderName);
//                 //Add file in correct folder of zip
//                 const folder = await zip.folder(folderName);
//                 await folder.file(fileName + ".html", pageHtml);
//                 //Mark url visited
//                 await urlVisitedSet.add(fileName);
//                 //Extract potential urls for next level 
//                 const potentialUrls = await extractUrls(pageHtml);
                
//                 //Save urls which are not visited
//                 if(typeof potentialUrls !== 'undefined'){
//                     for(let k = 0; k<potentialUrls.length; k++){
//                         if(!urlVisitedSet.has(potentialUrls[k])){
//                              extractedUrls.add(potentialUrls[k]);
//                         }
//                     }
//                 }
//             }


//             //Save extracted urls to array and reset the set for next level
//             urls = await [...extractedUrls];
//             await extractedUrls.clear();
//             //Lower the level of deepness by one
//             await iterations--;
//             console.log(iterations);
//         }
//         //Generate zip file
//         const content = await zip.generateAsync({ type: "nodebuffer" });

//         const end = await Date.now();
        
//         await console.log("Process finished!");
//         await console.log("Process took "+((end-start)/1000)+" seconds");
//         return content;
//     } catch (e) {
//         console.log(e);
//         console.log("Process failed!");
//         return "Error";
//     }

// }

// function removeHttp(url) {
//     const withoutHttp = url.replace(/^https?:\/\//, '');
//     return withoutHttp;
// }

// async function pageDownload(link) {
//     try {
//         const response = await axios.get(link);
//         if (response.status !== 200) {
//             console.log('Looks like there was a problem. Status Code: ' + response.status);
//         }
//         const pageHtml = await response.data;
//         return pageHtml;
//     } catch (e) {
//         console.log(e);
//         return "Error";
//     }

// }
















// async function doUrl(urlVisitedSet, url, zip, iterations) {
//     if (iterations <= 0) { return; }
//     zip.file("test.txt", "Just to see if zip works");
//     try {
//         console.log(url);
//         const pageHtml = await pageDownload(url);

//         const urlWithoutHttps = await removeHttp(url);
//         await console.log("urlWithoutHttps="+urlWithoutHttps);
//         const fileName = await urlWithoutHttps.substring(urlWithoutHttps.lastIndexOf('/') + 1);
//         await console.log("fileName="+fileName);
//         const folderName = await urlWithoutHttps.substring(urlWithoutHttps.lastIndexOf('/') + 1, '\0');
//         await console.log("folderName="+folderName);
//         const folder = await zip.folder(folderName);
//         await folder.file(fileName + ".html", pageHtml);
//         await urlVisitedSet.add(fileName);
//         const potentialUrls = await extractUrls(pageHtml);
//         await console.log(potentialUrls);
//         // await potentialUrls.forEach(potentialUrl => {
//         //     if (!urlVisitedSet.has(potentialUrl)) {
//         //         (async function () {
//         //             await doUrl(urlVisitedSet, potentialUrl, zip, iterations - 1);
//         //         })();
//         //     }
//         // })
//         const retUrls = [];
//         for (let i = 0; i<potentialUrls.length; i++) {
//             if (!urlVisitedSet.has(potentialUrl)) {
//                 retUrls.push(potentialUrls[i])
//             }
            
//         }
//         return retUrls;

//     } catch (e) {
//         console.log(e);
//     }

// }



