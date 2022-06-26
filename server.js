//TODO fileextension if known default html
        //files without http at start search in href and src tags; 
        //make sure dont block each other aysnc await
        //evtl file limit or so
        //comment everything at end
//statistics with iteration status and file count chart js;; 
//wenn im head stehen dann immer downloaden wenn im body dann evtl
//man muss noch zum array adden aber am besten mergen zwei for loops
//möglochkeoit plain download oder url exchange
// Try catch nur wenn erflorrieh. Runterg3ldam dann link taduchen
//onclikc da ist navigate function;; 
// import axios from 'axios';
// import cors from 'cors';
// import fs from 'fs';
// import extractUrls from 'extract-urls';
// import { Server } from 'socket.io';
var axios = require('axios');
var cors = require('cors');
var fs = require('fs');
var extractUrls = require('extract-urls');
var Url = require('url');
var Path = require('path');
var httpServer = require("http").createServer();
var io = require('socket.io')(httpServer, {
    cors: {
        origin: ["https://web-down-load.herokuapp.com", "http://localhost:3000"]
    }
});
const regexForUrlParsing = new RegExp(/((href|src)="((.|\n)*?)")/g);

io.listen((process.env.PORT || 5000));

io.on("connection", socket => { 
    socket.on("disconnect", function() {

    })
      
    socket.on("webdownload", async ({link, iterations, extend, adjustPage}) => {
      console.log("webdownload intitiated...")
      try {
        //Save start time
        const start = Date.now();
        //Remove last slash if there
        link = removeLastSlashIfThere(link);
        //Save root and path of link
        const linkRoot = extractRoot(link);
        const linkPath = extractPath(link);
        //Set to uniquely save the visited urls 
        const visitedUrlSet = new Set();
        //Array to hold current urls of level
        var urls = new Array();
        //Add starting url to array
        urls.push(link);
        
        //Set to save urls extracted from current level
        const extractedUrls = new Set();

        //Goes iterations deep in new pages
        while(iterations>0){
            //Goes every url in this level of deepness through
            for(let i = 0; i<urls.length; i++){
                //Get Data from url
                //console.log("now is urls[i] turn "+urls[i])
                var pageContent = await pageDownload(urls[i]);
                if(typeof pageContent !== 'string'){
                    continue;
                }
                //Parse foldername and filename
                const currentUrl = removeHttp(urls[i]);
                const fileName = extractFileName(currentUrl);
                const folderName = extractFolderName(currentUrl);
                
                //Mark url visited
                visitedUrlSet.add(currentUrl);

                
                    //Extract potential urls for next level 
                    var potentialUrls = Array.from(pageContent.matchAll(regexForUrlParsing), m => m[0])
                    const pageRootWithHttp = extractRootWithHttp(urls[i]);
                    //const pagePathWithHttp = extractPathWithHttp(urls[i]);
                    if(Array.isArray(potentialUrls)){
                        for(let k = 0; k<potentialUrls.length; k++){
                            if(!visitedUrlSet.has(potentialUrls[k])){
                                //const nowUrl = removeHttp(potentialUrls[k]);
                                //console.log("nowUrl"+nowUrl+"linkRoot"+linkRoot)
                                
                                extractedUrl = potentialUrls[k].split("\"")[1];
                                //console.log(extractedUrl+"  ghhghghgh")
                                var fullUrl;
                                if(isStartMatching(extractedUrl, "http")){
                                    fullUrl = extractedUrl;
                                }else{
                                    fullUrl = pageRootWithHttp+extractedUrl;
                                }
                                const nowUrlWithoutHttp = removeHttp(fullUrl);
                                if(extend==="Stay On Root" && !isStartMatching(nowUrlWithoutHttp, linkRoot)){continue;}
                                else if(extend==="Stay On Path" && !isStartMatching(nowUrlWithoutHttp, linkPath)){continue;}
                                extractedUrls.add(fullUrl);
                                if(adjustPage){
                                const nowFileName = extractFileName(nowUrlWithoutHttp);
                                const nowFolderName = extractFolderName(nowUrlWithoutHttp);
                                const nowExtension = extractExtension(nowFileName);  
                                //console.log(extractedUrl+" "+nowFolderName+" "+nowFileName)
                                if(nowExtension==="html"){
                                    try{
                                        //pageContent = replaceString(pageContent, extractedUrl, nowFolderName+nowFileName);//getRelativePath(currentUrl, fullUrl));
                                        pageContent = replaceString(pageContent, extractedUrl, getRelativePath(currentUrl, fullUrl));
                                    }catch(e){
                                        console.log(nowExtension)
                                    }
                                }
                            }
                            }
                        }
                    }
                const extension = extractExtension(fileName);
                if(extension==="png" || extension==="jpg" || extension==="svg" || extension==="ico" || extension==="tiff" || extension==="gif"){
                    socket.emit("image", folderName, fileName, extension, pageContent)
                }
                socket.emit("text", folderName, fileName, extension, pageContent)
            }

            //Save extracted urls to array and reset the set for next level
            urls = [...extractedUrls];
            extractedUrls.clear();
            //Lower the level of deepness by one
            iterations--;
        }
        socket.emit("end", "Every demanded file was send!");
        const end = Date.now();
        
        console.log("Process finished!");
        console.log("Process took "+((end-start)/1000)+" seconds");
    } catch (e) {
        console.log(e);
        console.log("Process failed!");
        console.log("error", "An error occured on the server!")
    }

/**
 * 
<div>((.|\n)*?)<\/div>
(href|src)="((.|\n)*?)"
<([^>])+(href|src)="((.|\n)*?)"([^<])+>(.)*<\/([^<])+>


 * var urlStuff = async () => {
                        if(typeof potentialUrls !== 'undefined'){
                            for(let k = 0; k<potentialUrls.length; k++){
                                if(!visitedUrlSet.has(potentialUrls[k])){
                                    const nowUrl = removeHttp(potentialUrls[k]);
                                    if(extend==="Stay On Root" && !isStartMatching(nowUrl, linkRoot)){continue;}
                                    else if(extend==="Stay On Path" && !isStartMatching(nowUrl, linkPath)){continue;}
                                    extractedUrls.add(potentialUrls[k]);
                                    if(iterations>1){
                                        pageHtml = replaceString(pageHtml, potentialUrls[k], getRelativePath(currentUrl, potentialUrls[k])+".html");
                                    }
                                }
                            }
                        }
                    }
                    await urlStuff();
 */
        //socket.emit("text", "Path", "Test")
      
        // fs.readFile('ms.png', function(err, data){
        //   socket.emit('png', "data:image/png;base64,"+ data.toString("base64"));
        // });        
        // fs.readFile('towplane.jpg', function(err, data){
        //   socket.emit('jpg', "data:image/jpg;base64,"+ data.toString("base64"));
        // });
      
    });
  });


function removeHttp(url) {
    const withoutHttp = url.replace(/^https?:\/\//, '');
    return withoutHttp;
}

function removeUrlParameters(url) {
    const tmp = url.split("?");
    return tmp[0];
}

function extractFileName(url){
    return url.substring(url.lastIndexOf('/') + 1);
}

function extractFolderName(url){
    return url.substring(url.lastIndexOf('/') + 1 , '\0');
}

function extractRoot(link){
    link = removeHttp(link);
    return link.split("/")[0];
}
function extractRootWithHttp(link){
    const tmp = link.split("/")
    return tmp[0]+"/"+tmp[1]+"/"+tmp[2];
}

function extractPathWithHttp(link){
    link = removeLastSlashIfThere(link);
    return link+"/";
}

function extractPath(link){
    link = removeHttp(link);
    //return link.substring(link.lastIndexOf('/') + 1, '\0');
    //link = link.substring(link.indexOf("?")+1, '\0');
    link = removeLastSlashIfThere(link);
    return link;
}

function extractExtension(url){
    try{
        if(lastPartAfterSlash.indexOf("/") === -1){return "html";}
        const tmp = removeUrlParameters(url);
        const slashSeperation = tmp.split("/");
        const lastPartAfterSlash = slashSeperation[slashSeperation.length-1];
        if(lastPartAfterSlash.indexOf(".") === -1){return "html";}
        const pointSeperation = lastPartAfterSlash.split(".");
        const lastPart = pointSeperation[pointSeperation.length-1];
        return lastPart;
    }catch(e){
        return "html";
    }
    
    //return Path.extname(Url.parse(url).pathname); 
}

function isStartMatching(string, startString){
    try{
        const tmp = string.substring(0, startString.length);
        return tmp===startString;
    }catch(e){
        return false;
    }
}


function replaceString(string, oldPhrase, newPhrase){
    var regex = RegExp(oldPhrase, "g");
    return string.replaceAll(regex, newPhrase);
    //return string;
}

function getSlashCount(string){
    return string.split("/").length-1;
}

function getRelativePath(start, end){
    start = removeHttp(start);
    end = removeHttp(end);
    const count = getSlashCount(start);
    //const res = "../".repeat(count)+extractFolderName(end)+extractFileName(end);
    const res = extractFolderName(end)+extractFileName(end);
    return res;
}

function removeLastSlashIfThere(string){
    if(string.charAt(string.length-1)==="/"){
        string = string.substring(string.length-1, '\0');
    }
    return string;
}

async function pageDownload(link) {
    try {
        const response = await axios.get(link);
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
        }
        const pageHtml = await response.data;
        return pageHtml;
    } catch (e) {
        console.log(e);
        return "Error at page download";
    }
  }



/*
  async function download(link, name, iterations) {
        console.log("Process started!")
        try {
            //Save start time
            const start = Date.now();

            //Set to uniquely save the visited urls 
            const urlVisitedSet = new Set();
            //Array to hold current urls of level
            var urls = new Array();
            //Add starting url to array
            urls.push(link);
            //Set to save urls extracted from current level
            const extractedUrls = new Set();
    
            //Test
            zip.file("test.txt", "Just to see if zip works");
    
            //Goes iterations deep in new pages
            while(iterations>0){
                //Goes every url in this level of deepness through
                for(let i = 0; i<urls.length; i++){
                    //Get Data from url
                    const pageHtml = await pageDownload(urls[i]);
                    if(typeof pageHtml !== 'string'){
                        //JSON.stringify(pageHtml);
                        continue;
                    }
                    //Parse foldername and filename for file in zip
                    const urlWithoutHttps = await removeHttp(urls[i]);
                    await console.log("urlWithoutHttps="+urlWithoutHttps);
                    const fileName = await urlWithoutHttps.substring(urlWithoutHttps.lastIndexOf('/') + 1);
                    //await console.log("fileName="+fileName);
                    const folderName = await urlWithoutHttps.substring(urlWithoutHttps.lastIndexOf('/') + 1, '\0');
                    //await console.log("folderName="+folderName);
                    //Add file in correct folder of zip
                    const folder = await zip.folder(folderName);
                    await folder.file(fileName + ".html", pageHtml);
                    //Mark url visited
                    await urlVisitedSet.add(fileName);
                    //Extract potential urls for next level 
                    const potentialUrls = await extractUrls(pageHtml);
                    
                    //Save urls which are not visited
                    if(typeof potentialUrls !== 'undefined'){
                        for(let k = 0; k<potentialUrls.length; k++){
                            if(!urlVisitedSet.has(potentialUrls[k])){
                                 extractedUrls.add(potentialUrls[k]);
                            }
                        }
                    }
                }
    
    
                //Save extracted urls to array and reset the set for next level
                urls = await [...extractedUrls];
                await extractedUrls.clear();
                //Lower the level of deepness by one
                await iterations--;
                console.log(iterations);
            }
            //Generate zip file
            const content = await zip.generateAsync({ type: "nodebuffer" });
    
            const end = await Date.now();
            
            await console.log("Process finished!");
            await console.log("Process took "+((end-start)/1000)+" seconds");
            return content;
        } catch (e) {
            console.log(e);
            console.log("Process failed!");
            return "Error";
        }
    
    }
    

*/

//https://gist.github.com/companje/b95e735650f1cd2e2a41
/*

console.log(fs.readFileSync("towplane.jpg").toString('base64').length+ " dwa da dw")
        //fs.writeFile('test10.zip', zip.generate({ type: "base64" }), 'binary', function (error) {});
        //     console.log('wrote test1.zip', error);
        // });
        //var bufArr = new ArrayBuffer(zip);
        //socket.binaryType = 'arraybuffer';
        //console.log(f.length+ "length send")
        //stream.pipe(fs.createWriteStream('test10.zip'));
        //socket.emit("zip", {'file':zip.toString('base64')});
        //socket.emit("zip", fs.createReadStream('file.jpg'))

 //socket.emit("png", fs.readFileSync("ms.png", {encoding: 'base64'})) // , { image: true, buffer: data }

        //socket.emit("jpg", fs.readFileSync('towplane.jpg', {encoding: 'base64'})) // , { image: true, buffer: data }
        

        //socket.emit("jpg", { image: true, buffer: (fs.readFileSync('towplane.jpg', 'base64').toString())})
        //const buf = fs.readFileSync("towplane.jpg");
        //socket.emit("jpg", "Path", { image: true, buffer: buf });


        //socket.emit("zip", {'file':fs.readFile("test10.zip", 'utf8').toString('base64')});
        //const bytes = new Uint8Array(zip);
        //console.log(zip)
        //socket.emit("zip", new Blob(["awdwaawd"]));
        //socket.emit(fs.createReadStream(zip.generate({ type: "nodebuffer" })));
*/ 






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



