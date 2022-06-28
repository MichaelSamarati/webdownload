 
//comment everything at end

// Try catch nur wenn erflorrieh. Runterg3ldam dann link taduchen
//onclikc da ist navigate function;; 
//remove hashes 
//maybe eigene ordner
//Nur wenn HTML in extracted set und rletive Pfade leiht problrm
//Dneke doch alle URLs relativ emachen nicht nur http
//schauen das nicht css und s omehrmals runtergeladen werden
// bem letgztenn ichtm ehr ausstaischen iteration;; 
// fix cancel


// var cors = require('cors');
// var fs = require('fs');
// var extractUrls = require('extract-urls');
// var Url = require('url');
// var Path = require('path');
var axios = require('axios');
const regexForUrlParsing = new RegExp(/((href|src)="((.|\n)*?)")/g);
var httpServer = require("http").createServer();
var io = require('socket.io')(httpServer, {
    cors: {
        origin: ["https://web-down-load.herokuapp.com", "http://localhost:3000"]
    }
});

io.listen((process.env.PORT || 5000));

io.on("connection", socket => {
    var start;
    socket.on("disconnect", function () {

    })

    socket.on("webdownload", async ({ link, iterations, extend, adjustPage }) => {
        console.log("webdownload intitiated...")
        try {
            //Save start time
            start = Date.now();
            var currentIteration = 1;
            
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
            while (currentIteration<=iterations) {
                socket.emit("status", currentIteration)
                //Goes every url in this level of deepness through
                for (let i = 0; i < urls.length; i++) {
                    //Get Data from url
                    var pageContent = await pageDownload(urls[i]);
                    if (typeof pageContent !== 'string') {
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
                    if (Array.isArray(potentialUrls)) {
                        for (let k = 0; k < potentialUrls.length; k++) {
                            if (!visitedUrlSet.has(potentialUrls[k])) {
                                extractedUrl = potentialUrls[k].split("\"")[1];
                                var fullUrl;
                                if (isStartMatching(extractedUrl, "http")) {
                                    fullUrl = extractedUrl;
                                } else {
                                    fullUrl = pageRootWithHttp + extractedUrl;
                                }
                                const nowUrlWithoutHttp = removeHttp(fullUrl);
                                if (extend === "Stay On Root" && !isStartMatching(nowUrlWithoutHttp, linkRoot)) { continue; }
                                else if (extend === "Stay On Path" && !isStartMatching(nowUrlWithoutHttp, linkPath)) { continue; }
                                extractedUrls.add(fullUrl);
                                const nowFileName = extractFileName(nowUrlWithoutHttp);
                                const nowFolderName = extractFolderName(nowUrlWithoutHttp);
                                const nowExtension = extractExtension(nowUrlWithoutHttp);
                                //console.log(extractedUrl+" "+nowExtension)
                                //console.log(extractedUrl+" "+nowFolderName+" "+nowFileName)
                                if (nowExtension === "html") {
                                    if (adjustPage) {
                                            try {
                                            
                                            const oldPhrase = potentialUrls[k].split("=")[1];
                                            pageContent = replaceString(pageContent, oldPhrase, "\"" + getRelativePath(currentUrl, fullUrl) + "." + nowExtension + "\"");
                                            console.log(fullUrl)
                                            
                                            // var urlsToExchangeInPageArray = [...urlsToExchangeInPage];
                                            // for(let j = 0; j<urlsToExchangeInPageArray.length; j++){
                                            //     //const attirbuteUrl = urlsToExchangeInPageArray[j].attribute;
                                            //     // const oldPhrase = potentialUrls[k].split("=")[1];
                                            //     // pageContent = replaceString(pageContent, oldPhrase, "\"" + getRelativePath(currentUrl, fullUrl) + "." + nowExtension + "\"");
                                            //     // extractedUrls.add(fullUrl);
                                            //     const oldPhrase = urlsToExchangeInPageArray[j].attribute.split("=")[1];
                                            //     pageContent = replaceString(pageContent, oldPhrase, "\"" + getRelativePath(currentUrl, urlsToExchangeInPageArray[j].url) + "." + nowExtension + "\"");
                                            //     extractedUrls.add(urlsToExchangeInPageArray[j].url);
                                            // }
                                        } catch (e) {
                                            console.log(nowExtension)
                                        }
                                        
                                        
                                    }
                                } else {
                                    //console.log(nowExtension)
                                    try {
                                        const nowPageContent = await pageDownloadWithErrorThrow(fullUrl);
                                        sendFile(nowFolderName, nowFileName, nowExtension, nowPageContent);
                                        visitedUrlSet.add(fullUrl);
                                    } catch (e) {
                                        console.log("File could not be downloaded!")
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
                currentIteration++;
            }
            // function finish(){
            //     socket.emit("end", "Process got cancelled!");
            //     socket.disconnect();
            //     const end = Date.now();
    
            //     console.log("Process finished!");
            //     console.log("Process took " + ((end - start) / 1000) + " seconds");
            // }
            function finish(){
                currentIteration = iterations;
                socket.emit("end", "Process got cancelled!");
                socket.disconnect();
                const end = Date.now();
        
                console.log("Process finished!");
                console.log("Process took " + ((end - start) / 1000) + " seconds");
            }
        
            socket.on("cancel", function (){
                console.log("Herere  aw daw da dddddddddddddddddddwwwwwwww")
                finish();
            })
            finish();
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

    });
    
    function sendFile(folderName, fileName, extension, pageContent) {
        if (extension === "html" || extension === "css" || extension === "txt" || extension === "pdf") {
            socket.emit("text", folderName, fileName, extension, pageContent)
        } else if (extension === "png" || extension === "jpg" || extension === "svg" || extension === "ico" || extension === "tiff" || extension === "gif") {
            socket.emit("image", folderName, fileName, extension, pageContent)
        } else {
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

function extractFileName(url) {
    const slashCount = getSlashCount(url) - 1;
    if (slashCount === 0) { return url; }
    const lastPart = url.substring(url.lastIndexOf('/') + 1);
    const pointSeperation = lastPart.split(".");
    return pointSeperation[0];
}

function extractFolderName(url) {
    return url.substring(url.lastIndexOf('/') + 1, '\0');
}

function extractRoot(link) {
    link = removeHttp(link);
    return link.split("/")[0];
}
function extractRootWithHttp(link) {
    const tmp = link.split("/")
    return tmp[0] + "/" + tmp[1] + "/" + tmp[2];
}

function extractPathWithHttp(link) {
    link = removeLastSlashIfThere(link);
    return link + "/";
}

function extractPath(link) {
    link = removeHttp(link);
    //return link.substring(link.lastIndexOf('/') + 1, '\0');
    //link = link.substring(link.indexOf("?")+1, '\0');
    link = removeLastSlashIfThere(link);
    return link;
}

function extractExtension(url) {
    try {
        if (url.indexOf("/") === -1) { return "html"; }
        const tmp = removeUrlParameters(url);
        const slashSeperation = tmp.split("/");
        const lastPartAfterSlash = slashSeperation[slashSeperation.length - 1];
        if (lastPartAfterSlash.indexOf(".") === -1) { return "html"; }
        const pointSeperation = lastPartAfterSlash.split(".");
        const lastPart = pointSeperation[pointSeperation.length - 1];
        if (lastPart === "htm") { lastPart = "html"; }
        return lastPart;
    } catch (e) {
        return "html";
    }
}

function isStartMatching(string, startString) {
    try {
        const tmp = string.substring(0, startString.length);
        return tmp === startString;
    } catch (e) {
        return false;
    }
}


function replaceString(string, oldPhrase, newPhrase) {
    var regex = RegExp(oldPhrase, "g");
    return string.replaceAll(regex, newPhrase);
}

function getSlashCount(string) {
    return string.split("/").length;
}

function getRelativePath(start, end) {
    start = removeHttp(start);
    end = removeHttp(end);
    const count = getSlashCount(start) - 1;
    //const res = "../".repeat(count)+extractFolderName(end)+extractFileName(end);
    const folderName = extractFolderName(end);
    const fileName = extractFileName(end);
    //if(getSlashCount(folderName)===0){folderName = removeLastSlashIfThere(folderName);}
    const res = folderName + fileName;
    //res = removeLastSlashIfThere(res);
    return res;
}

function removeLastSlashIfThere(string) {
    if (string.charAt(string.length - 1) === "/") {
        string = string.substring(string.length - 1, '\0');
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