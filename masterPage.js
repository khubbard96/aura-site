//masterPage.js
//allows for masterpage-like performance/behavior for basic projects
//author: Kevin Hubbard - 1hubbardkl@gmail.com

//TO USE:
//1. create a "/master/" directory, and in it place "MASTER.html"
//2. Write MASTER.html as you would any other HTML page, including items
//      in the header, etc.
//3. masterPage.js works on a component basis, so write each of your components
//      surrounded with a div whose id is the name of the component
//4. When writing your sub pages, include masterPage.js in a script tag. This will
//      import all scripts, links, and items in your master page into the sub page
//5. When placing the components, create an element with a data-mastercomponent="componentName"
//      and the corresponding component will be put there.


//TODO:
//-figure out a solution for the "flickering" that now occurs as a result of
//the style links being loaded from the master page
(function () {
    //keeps track of events in the master page loading process    
    var pageLoaded=false;
    var masterPageFetched=false;
    var masterPageHTMLTree=undefined;

    //does the actual work
    var setup = function () {
        //grad header items from master page
        let headerItems=masterPageHTMLTree.getElementsByTagName("head")[0].children;
        Array.from(headerItems).forEach(hi => {
            //have to handle scripts differently
            if(hi.tagName=="SCRIPT") {
                let script=document.createElement("script");
                script.type='text/javascript';
                script.async=true;
                script.onload=function() {

                }
                script.src=hi.src;
                document.head.appendChild(script);
            }
            else {
                document.head.appendChild(hi);
            }    
        });
        //grab body elements from master page
        let segments=masterPageHTMLTree.getElementsByTagName("body")[0].children
        Array.from(segments).forEach(seg => {
            let segID=seg.id;
            let segHTML=seg.innerHTML;
            targetElement=document.querySelectorAll("[data-mastercomponent='" + segID + "']")[0];
            if(targetElement) targetElement.innerHTML=segHTML;
        });
        setTimeout(function() {
            document.getElementsByTagName("body")[0]
        },0)
    };

    //called whenver one of the relevant events happens. continues with the process if both events have happened
    var router=function(event) {
        if (event.type=="DOMContentLoaded") pageLoaded=true;
        else if (event.type=="MasterPageLoaded") masterPageFetched=true;
        if(pageLoaded && masterPageFetched) {
            setup();
        }
    }

    if (
        document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll)
    ) {
        router({type:"DOMContentLoaded"});
    } else {
        document.addEventListener("DOMContentLoaded", router);
    }

    //request masterpage content
    var getMasterPage=function() {
        url="/master/MASTER.html"
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                let masterPageText=xmlHttp.responseText;
                let parser=new DOMParser();
                masterPageHTMLTree=parser.parseFromString(masterPageText,"text/html");
                router({type:"MasterPageLoaded"});
            }
        }
        xmlHttp.open("GET", url, true); // true for asynchronous 
        xmlHttp.send(null);

    }
    getMasterPage();

})();

(function() {
    let redirects=document.getElementsByTagName("a");
})();