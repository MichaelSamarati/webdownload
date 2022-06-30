
//comment everything at end

// Try catch nur wenn erflorrieh. Runterg3ldam dann link taduchen
//remove hashes 
// fix cancel
//requestparaemter evtl noch in namen
// hashes weg und dann am ende wieder hin denke
// action= tags auch parsen
// onclick='navigate()'
//replacesteoin undf oldphrase auslagern nach oben
// bei catch muss man dann halt gesamte url rein schreiben
//if adjuust page consitent machen 
var superagent = require('superagent').agent();
var axios = require('axios');
const regexForUrlParsing = new RegExp(/((href|src|onclick)="((.|\n)*?)")/g);
var httpServer = require("http").createServer();
var io = require('socket.io')(httpServer, {
    cors: {
        origin: ["https://web-down-load.herokuapp.com", "http://localhost:3000"]
    }
});

console.log("here1")
const login = async() => {
    console.log("here5")
    let dashboard = await superagent
    .post('https://moodle.htl-donaustadt.at/login/index.php')
    .send({username: '190182', passwords: ''})
    .set('Content-Type', 'text/html; charset=utf-8').end((err, res) => {
        // Calling the end function will send the request
      })
    
    .catch(console.error)
    //console.log(dashboard)

    let my = await superagent
    .get('https://moodle.htl-donaustadt.at/my/').end((err, res) => {
        // Calling the end function will send the request
      })
    .catch(console.error)
    //console.log(my)
    console.log("here8")
}
 login();
console.log("here2")

io.listen((process.env.PORT || 5000));

io.on("connection", socket => {
    //Save start time
    var start = Date.now();
    socket.on("disconnect", function () {
        //Get end time and log difference
        const end = Date.now();
        console.log("Process finished!");
        console.log("Process took " + ((end - start) / 1000) + " seconds");
    })

    socket.on("webdownload", async ({ link, iterations, extend, adjustPage }) => {
        console.log("webdownload intitiated...")
        try {

            

            //CurrentIteration keeps track of the current level
            var currentIteration = 1;

            //Remove last slash if there
            link = removeLastSlashIfThere(link); //e.g. https://example.com/ -> https://example.com

            //Save root and path of link
            const linkRoot = extractRoot(link); //e.g. https://example.com/nice/path -> example.com
            const linkPath = extractPath(link); //e.g. https://example.com/nice/path -> example.com/nice/path

            //Set to uniquely save the visited urls 
            const visitedUrlSet = new Set();

            //Array to hold current urls of level
            var urls = new Array();

            //Add starting url to array
            urls.push(link);

            //Set to save urls extracted from current level
            const extractedUrls = new Set();

            //Until level from client is reached
            while (currentIteration <= iterations) {
                //Inform client about current level
                socket.emit("status", currentIteration)

                //Goes every url in this level through
                for (let i = 0; i < urls.length; i++) {
                    //Fetch content from url
                    var pageContent = await pageDownload(urls[i]);

                    //Go to next url if unclear content
                    if (typeof pageContent !== 'string') {
                        continue;
                    }

                    //Parse foldername and filename
                    const currentUrl = removeHttp(urls[i]);
                    const fileName = extractFileName(currentUrl);
                    const folderName = extractFolderName(currentUrl);

                    //Mark url as visited
                    visitedUrlSet.add(currentUrl);

                    //Extract potential urls for next level 
                    var potentialUrls = Array.from(pageContent.matchAll(regexForUrlParsing), m => m[0])

                    //Extract root with http/https in case of relative links in page content
                    const pageRootWithHttp = extractRootWithHttp(urls[i]); //e.g. https://example.com/nice/path -> https://example.com

                    //If page has urls, then iterate through every url
                    if (Array.isArray(potentialUrls)) {
                        for (let k = 0; k < potentialUrls.length; k++) {
                            //Check if url was not already visited
                            if (!visitedUrlSet.has(potentialUrls[k])) {
                                //Extract link from 
                                extractedUrl = potentialUrls[k].split("\"")[1]; //e.g. href="https://example.com" -> https://example.com
                                let leftSideUrl = "\"";
                                let middleUrl = extractedUrl;
                                let rightSideUrl = "\"";
                                if(extractedUrl.indexOf("'")!==-1){
                                    let singleQuotationMarkSeperation = extractedUrl.split("'");
                                    leftSideUrl = leftSideUrl+singleQuotationMarkSeperation[0]+"'";
                                    middleUrl = singleQuotationMarkSeperation[1];
                                    rightSideUrl = "'"+singleQuotationMarkSeperation[2]+rightSideUrl;
                                }
                                
                                  
                                //Check if link is uncomplete
                                var fullUrl;
                                if (isStartMatching(middleUrl, "http")) {
                                    fullUrl = middleUrl; //e.g. https://example.com -> https://example.com
                                } else {
                                    fullUrl = pageRootWithHttp + middleUrl; //e.g. /images/mountain.jpg -> https://example.com/images/mountain.jpg
                                }
                                                                
                                //Get rid of chapter stuff and last slash if there
                                fullUrl = fullUrl.split("#")[0];
                                fullUrl = removeLastSlashIfThere(fullUrl);

                                //Remove url http/https
                                const nowUrlWithoutHttp = removeHttp(fullUrl);

                                
                                
                                //
                                
                                const nowFileName = extractFileName(nowUrlWithoutHttp);
                                const nowFolderName = extractFolderName(nowUrlWithoutHttp);
                                const nowExtension = extractExtension(nowUrlWithoutHttp);
                                //const oldPhrase = potentialUrls[k].split("=")[1];
                                const oldPhrase = leftSideUrl+middleUrl+rightSideUrl
                                //Check mode is "Stay On Root" or "Stay On Path", and if url without http/https does not match with root or path
                                if (extend === "Stay On Root" && !isStartMatching(nowUrlWithoutHttp, linkRoot)) {
                                    if (adjustPage) {
                                        pageContent = replaceString(pageContent, oldPhrase, leftSideUrl + fullUrl + rightSideUrl); 
                                    }
                                    continue;
                                }
                                if (extend === "Stay On Path" && !isStartMatching(nowUrlWithoutHttp, linkPath)) {
                                    if (adjustPage) {
                                        pageContent = replaceString(pageContent, oldPhrase, leftSideUrl + fullUrl + rightSideUrl); 
                                    }
                                    continue;
                                }
                                if (nowExtension === "html") {
                                    //Add url for next level
                                    extractedUrls.add(fullUrl);
                                    if (adjustPage) {
                                        if (currentIteration < iterations) {
                                            //console.log(leftSideUrl + getRelativePath(currentUrl, fullUrl) + "." + nowExtension + rightSideUrl)
                                            pageContent = replaceString(pageContent, oldPhrase, leftSideUrl + getRelativePath(currentUrl, fullUrl) + "." + nowExtension + rightSideUrl);
                                        }else{
                                            //console.log(leftSideUrl + getRelativePath(currentUrl, fullUrl) + "." + nowExtension + rightSideUrl)
                                            pageContent = replaceString(pageContent, oldPhrase, leftSideUrl + fullUrl + rightSideUrl);
                                        }
                                    }
                                } else {
                                    try {
                                        const nowPageContent = await pageDownloadWithErrorThrow(fullUrl);
                                        sendFile(nowFolderName, nowFileName, nowExtension, nowPageContent);

                                        //If file could be downloaded, link html to local file
                                        pageContent = replaceString(pageContent, oldPhrase, leftSideUrl + getRelativePath(currentUrl, fullUrl) + "." + nowExtension + rightSideUrl);
                                    } catch (e) {
                                        //If file could not be downloaded, link to website link
                                        pageContent = replaceString(pageContent, oldPhrase, leftSideUrl + fullUrl + rightSideUrl);
                                    }//Mark url as visited
                                    visitedUrlSet.add(fullUrl);
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

                //Iterate level by one
                currentIteration++;
            }
            
            //Finish process by making currentIteration reached iterations and disconnect session with client
            function finish() {
                currentIteration = iterations;
                socket.emit("end", "Process got cancelled!");
                socket.disconnect();
            }

            //Finish process when client wants to cancel
            socket.on("cancel", function () {
                finish();
            })

            //Finish process when naturally finished
            finish();
        } catch (e) {
            console.log(e);
            console.log("Process failed!");
            console.log("error", "An error occured on the server!")
        }
    });

    function sendFile(folderName, fileName, extension, pageContent) {
        //Send the client the pageContent by using the file extension 
        //Text and image defer in file creation on client side
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
    const slashCount = getSlashCount(url);
    if (slashCount === 0) { return ""; }
    const lastPart = url.substring(url.lastIndexOf('/') + 1);
    const pointSeperation = lastPart.split(".");
    return pointSeperation[0];
}

function extractFolderName(url) {
    const slashCount = getSlashCount(url);
    if (slashCount === 0) { 
        return url; 
    }else{
        return url.substring(url.lastIndexOf('/') + 1, '\0');
    }
    
}

function extractRoot(link) {
    link = removeHttp(link);
    return link.split("/")[0];
}
function extractRootWithHttp(link) {
    const tmp = link.split("/")
    return tmp[0] + "/" + tmp[1] + "/" + tmp[2];
}

function extractPath(link) {
    link = removeHttp(link);
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
    try{
        var regex = RegExp(oldPhrase, "g");
        return string.replaceAll(regex, newPhrase);
    }catch(e){
        return string;
    }
    
}

function getSlashCount(string) {
    return string.split("/").length-1;
}

function getRelativePath(start, end) {
    start = removeHttp(start);
    end = removeHttp(end);
    var count = getSlashCount(start);
    if(extractFileName(start).length===0){count++;}
    const folderName = extractFolderName(end);
    const fileName = extractFileName(end);
    const res = "../".repeat(count) + folderName + fileName;
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