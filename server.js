//TODO 
        //comment everything at end
//statistics with iteration status and file count chart js;; 
//wenn im head stehen dann immer downloaden wenn im body dann evtl
//man muss noch zum array adden aber am besten mergen zwei for loops
//möglochkeoit plain download oder url exchange
// Try catch nur wenn erflorrieh. Runterg3ldam dann link taduchen
//onclikc da ist navigate function;; 
//remove hashes 
//maybe eigene ordner
var axios = require('axios');
var cors = require('cors');
var fs = require('fs');
var extractUrls = require('extract-urls');
var Url = require('url');
var Path = require('path');
const regexForUrlParsing = new RegExp(/((href|src)="((.|\n)*?)")/g);
var httpServer = require("http").createServer();
var io = require('socket.io')(httpServer, {
    cors: {
        origin: ["https://web-down-load.herokuapp.com", "http://localhost:3000"]
    }
});

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
                                    const nowExtension = extractExtension(nowUrlWithoutHttp);  
                                    //console.log(extractedUrl+" "+nowExtension)
                                    //console.log(extractedUrl+" "+nowFolderName+" "+nowFileName)
                                    if(nowExtension==="html"){
                                        try{
                                            const oldPhrase = potentialUrls[k].split("=")[1];
                                            pageContent = replaceString(pageContent, oldPhrase, "\""+getRelativePath(currentUrl, fullUrl)+"."+nowExtension+"\"");
                                        }catch(e){
                                            console.log(nowExtension)
                                        }
                                    }else{
                                        //console.log(nowExtension)
                                        try{
                                            const nowPageContent = await pageDownloadWithErrorThrow(fullUrl);
                                            sendFile(nowFolderName, nowFileName, nowExtension, nowPageContent);
                                        }catch(e){
                                            console.log("File could not be downloaded!")
                                        }
                                        
                                    }
                                }
                            }
                        }
                    }
                const extension = extractExtension(fileName);
                sendFile(folderName, fileName, extension, pageContent);
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
    function sendFile(folderName, fileName, extension, pageContent){
        //console.log(folderName+" "+fileName+" "+extension+" ")
        if(extension==="html" || extension==="css" || extension==="txt" || extension==="pdf"){
            socket.emit("text", folderName, fileName, extension, pageContent)
        }else if(extension==="png" || extension==="jpg" || extension==="svg" || extension==="ico" || extension==="tiff" || extension==="gif"){
            socket.emit("image", folderName, fileName, extension, pageContent)
        }else{
            socket.emit("text", folderName, fileName, extension, pageContent)
        }
    }
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
    const slashCount = getSlashCount(url)-1 ;
    console.log(url+" "+slashCount)
    if(slashCount===0){return url;}
    const lastPart = url.substring(url.lastIndexOf('/') + 1);
    const pointSeperation = lastPart.split(".");
    console.log(lastPart    +" "+pointSeperation[0])
    return pointSeperation[0];
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
        if(url.indexOf("/") === -1){return "html";}
        const tmp = removeUrlParameters(url);
        const slashSeperation = tmp.split("/");
        const lastPartAfterSlash = slashSeperation[slashSeperation.length-1];
        if(lastPartAfterSlash.indexOf(".") === -1){return "html";}
        const pointSeperation = lastPartAfterSlash.split(".");
        const lastPart = pointSeperation[pointSeperation.length-1];
        if(lastPart==="htm"){lastPart = "html";}
        return lastPart;
    }catch(e){
        return "html";
    } 
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
}

function getSlashCount(string){
    return string.split("/").length;
}

function getRelativePath(start, end){
    start = removeHttp(start);
    end = removeHttp(end);
    const count = getSlashCount(start)-1;
    //const res = "../".repeat(count)+extractFolderName(end)+extractFileName(end);
    const folderName = extractFolderName(end);
    const fileName = extractFileName(end);
    //if(getSlashCount(folderName)===0){folderName = removeLastSlashIfThere(folderName);}
    const res = folderName+fileName;
    //res = removeLastSlashIfThere(res);
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
        const pageContent = await response.data;
        return pageContent;
    } catch (e) {
        console.log(e);
        return "Error at page download";
    }
  }

  async function pageDownloadWithErrorThrow(link) {
    try {
        const response = await axios.get(link);
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
        }
        const pageContent = await response.data;
        return pageContent;
    } catch (e) {
        throw e;
    }
  }