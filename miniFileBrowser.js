(function() {
    var fileBrowser = {
        yearSelectorEl: document.getElementById("file_browser_year_selector"),
        directoryContainerEl: document.getElementById("directory_picker"),
        resultsContainerEl: document.getElementById("file_browser_results_picker"),
        fileContents: {},
        currentYear: undefined,
        //methods
        loadData: function() {
            let fb = this;
            return new Promise(function(resolve, reject) {
                url="file_data.json";//change this
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() { 
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                        fb.fileContents = JSON.parse(xmlHttp.response);
                        resolve();
                    }
                }
                xmlHttp.open("GET", url, false); // true for asynchronous 
                xmlHttp.send(null);
            });
        },
        buildYearSelector: function() {
            let availableYears = Object.keys(this.fileContents).sort((a,b)=>{
                if(a<b) return 1;
                else return -1;
            });
            let options = ""
            availableYears.forEach((yr) => {
                options += `<option value="${yr}">${yr}</option>`;
            });
            this.yearSelectorEl.innerHTML=options;
            this.currentYear = this.yearSelectorEl.childNodes[0].value;
        },
        buildDirectoryList: function() {
            let allFilesForYear=this.fileContents[this.currentYear];
            let allHTML = ""
            let currentPath=[];
            let recGen=function(data) {
                let retHTML = "";
                Object.keys(data).forEach((item)=>{
                    currentPath.push(item);
                    if(Array.isArray(data[item])){
                        retHTML +=                           
                        `<div class="folder">
                            <div class="folder-title" data-folderID="${currentPath.join("/")}"><i class="fas fa-folder"></i>${item}</div>
                        </div>`;
                    }
                    else {
                        retHTML+= 
                        `<div class="folder-title"><i class="fas fa-folder"></i>${item}</div>
                        <div class="folder-content">
                            ${recGen(data[item])}
                        </div>`;
                    }
                    currentPath.pop();
                });
                return retHTML;
            }
            this.directoryContainerEl.innerHTML = recGen(allFilesForYear);
        },
        updateFileBrowser: function() {
            //ignore notification if content is empty
            let fb = this;
            if(!this.fileContents || Object.keys(this.fileContents).length == 0) {
                return;
            }
            let activeDir=this.getActiveDirectory();
            if(!activeDir){
                return;
            }
            let folderID=activeDir.dataset.folderid;
            if(!folderID) return;
            let currentSub = this.fileContents[this.currentYear];
            folderID.split("/").forEach((directory) => {
                if(currentSub) {
                    currentSub = currentSub[directory];
                }
            });
            itemsHTML = "<div class='file-empty'>Nothing here.</div>";
            if(!currentSub || currentSub.length == 0) {
                //empty view
            }
            else {
                itemsHTML = "";
                currentSub.forEach((item) => {
                    itemsHTML += fb.genIcon(item,folderID);
                });
            }
            this.resultsContainerEl.innerHTML = itemsHTML;
        },
        getActiveDirectory: function() {
            return this.directoryContainerEl.getElementsByClassName("folder-title active")[0];
        },
        genIcon: function(fileData,path){
            let fileType,fileName = "";
            fileName = fileData.split(".")[0];
            fileType = fileData.split(".")[1];
            if(fileType=="ppt" || fileType == "pptx") fileType = "powerpoint";
            else if (fileType=="doc" || fileType=="docx" || fileType=="txt") fileType = "word";
            else if (fileType=="xls" || fileType=="xlsx") fileType = "excel";
            if(!fileName || !fileType) return;
            return `                      
            <div class="item-wrapper">
                <div class="item document-${fileType}" data-filepath="${path}${fileData}">
                    <i class="far fa-file-${fileType} fa-7x"></i>
                    <div class="item-name">
                        ${fileName}
                    </div>
                </div>
            </div>`
        },
        //bind
        bindEvents: function() {
            let fb = this;
            Array.from(this.directoryContainerEl.getElementsByClassName("folder-title")).forEach(folder=>{
                var getSiblings=function(node) {
                    let siblings=[];
                    let sibling=node.parentElement.firstChild;
                    while(sibling) {
                        if (sibling.nodeType === 1 && sibling !== node)
                            siblings.push(sibling);
                        sibling=sibling.nextElementSibling;
                    }
                    return siblings;
                }
                folder.onclick=function(e){
                    let activeFolder="";
                    let folderTitles=fb.directoryContainerEl.getElementsByClassName("folder-title");
                    if(this.parentElement.classList.contains("open")) return;
                    Array.from(folderTitles).forEach(t=>{
                        t.classList.remove("active");
                    });
                    getSiblings(this.parentElement).forEach(el=>{
                        el.classList.remove("open");
                    });
                    if(!this.nextElementSibling || !this.nextElementSibling.classList.contains("folder-content")){
                        this.classList.add("active");
                    }
                    else {
                        this.parentElement.classList.add("open");
                    }
                    fb.updateFileBrowser();
                }
            });
            this.yearSelectorEl.onchange=function() {
                fb.currentYear=this.value;
                fb.buildDirectoryList();
            }
        },


        //initialize
        init: function() {
            let fb = this;
            this.loadData().then(function() {
                fb.buildYearSelector();
                fb.buildDirectoryList();
                fb.bindEvents();
            });
        }
    }
    var init = function() {
        fileBrowser.init();
    }
    if (
        document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll)
    ) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();

