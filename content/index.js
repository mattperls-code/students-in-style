chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message == "sis-urlchange"){
        if(window.location.href.startsWith("https://philasd.infinitecampus.org/campus/nav-wrapper/student/portal/student/")){
            console.log("you been haczd")
            try {
                const headerElement = document.querySelector(".header")
                const sideBarHeader = document.querySelector(".sidebar__header")
                if(headerElement == null){
                    throw new Error("doesnt exist yet")
                }
                chrome.storage.sync.get(["sis-color"], (result) => {
                    if(typeof result["sis-color"] == "string"){
                        headerElement.style.backgroundColor = `hsl(${result["sis-color"]}, 100%, 55%)`
                        sideBarHeader.style.backgroundColor = `hsl(${result["sis-color"]}, 100%, 55%)`
                        const icons = document.getElementsByClassName("fa")
                        for(let i = 0;i<icons.length;i++){
                            icons.item(i).style.color = `hsl(${result["sis-color"]}, 100%, 10%)`
                        }
                        const activeTabMarkers = document.getElementsByClassName("tool")
                        for(let i = 0;i<activeTabMarkers.length;i++){
                            activeTabMarkers.item(i).style.borderColor = `hsl(${result["sis-color"]}, 100%, 55%)`
                        }
                    }
                })
            } catch(e){
                console.log("just give it a minute")
            }
        }
        if(window.location.href == "https://philasd.infinitecampus.org/campus/nav-wrapper/student/portal/student/today"){
            const setPage = (callback) => {
                let successful = true
                try {
                    const iframeElement = document.querySelector("#main-workspace")
                    const pfpElement = iframeElement.contentDocument.querySelector(".today__student-picture").firstChild
                    const nameElement = iframeElement.contentDocument.querySelector(".today__student-name")
                    chrome.storage.sync.get(["sis-pfp"], (result) => {
                        if(typeof result["sis-pfp" ] == "string" && result["sis-pfp"] != ""){
                            pfpElement.setAttribute("src", result["sis-pfp"])
                        }
                    })
                    chrome.storage.sync.get(["sis-name"], (result) => {
                        if(typeof result["sis-name"] == "string" && result["sis-name"] != ""){
                            nameElement.innerHTML = result["sis-name"]
                        }
                    })
                } catch(e){
                    console.log("try getting some wifi bruh")
                    successful = false
                }
                callback(successful)
            }
            
            const setUntilSuccessful = (successful) => {
                if(!successful){
                    setTimeout(() => {
                        setPage(setUntilSuccessful)
                    }, 100)
                }
            }
            setUntilSuccessful(false)
        }
    }
})