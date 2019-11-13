(function() {
    var init=function() {
        let directories=document.querySelectorAll("[data-browserlevel]");
        let levels=[];
        let totalLevels=0;
        Array.from(directories).forEach(dir=>{
            let dirLevel=parseInt(dir.dataset.browserlevel);
            if(levels[dirLevel]){
                levels[dirLevel].push(dir);
            }
            else {
                levels[dirLevel]=[dir];
            }
        });
        totalLevels=levels.length;
        Array.from(directories).forEach(directory=>{
            directory.onclick=function(e){
                let thisLevel=parseInt(this.dataset.browserlevel);
                let id=this.dataset.dirid;  
                let involved=Array.from(directories).filter(
                    dir=>parseInt(dir.dataset.browserlevel)>=thisLevel
                );
                Array.from(involved).forEach(i=>{
                    i.classList.remove("active")
                });
                this.classList.add("active");

                let allChildofs=document.querySelectorAll("[data-childof]");
                Array.from(allChildofs).forEach(el=>{
                    el.classList.add("hidden");
                });
                let childOf=this.dataset.childof;
                let currId=id;

                if(childOf){
                }


                while(document.querySelectorAll("[data-childof='" + childOf + "']")){
                    Array.from(document.querySelectorAll("[data-childof='" + childOf + "']")).forEach(el=>{
                        el.classList.remove("hidden");
                    });
                    let parent=document.querySelectorAll("[data-dirid='" + childOf + "']");
                    childOf=parent.dataset.childOf;
                }
            }
        });

    }
    if (
        document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll)
    ) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
});

(function() {
    var init=function() {
        let folderTitles=document.getElementsByClassName("folder-title");
        let folderOnClick=function(e){
            let activeFolder="";
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
            loadFiles(document.getElementsByClassName("directory-picker")[0].getElementsByClassName("active")[0]);

        }
        Array.from(folderTitles).forEach(folder=>{
            folder.onclick=folderOnClick;
        });
    }
    if (
        document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll)
    ) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }

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
    var loadFiles=function(dir) {
        let dirID;
        if(dir) {
            dirID=dir.dataset.dirid;
        }
        else {
            //slap that mf empty view

        }
    }
})();

