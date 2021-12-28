let sentMessage1 = false
let sentMessage2 = false
let sentMessage3 = false

chrome.runtime.onMessage.addListener((request) => {
    if (request.message == "sis-urlchange") {
        if (window.location.href.startsWith("https://philasd.infinitecampus.org/campus/nav-wrapper/student/portal/student/")) {
            if(!sentMessage1){
                console.log("%cYou been haczd", "font-size: 24px; color: rgb(220, 220, 220); margin-top: 12px; margin-bottom: 8px;")
                console.log("%cJK, have fun with the new styles", "font-size: 16px; color: rgb(200, 200, 200); margin-top: 8px; margin-bottom: 24px;")
                sentMessage1 = true
            }
            try {
                const logoContainer = document.querySelector('.header__logo');
                if(logoContainer == null){
                    throw new Error("doesnt exist yet")
                }
                const url = "https://logo-api-i9jpe.ondigitalocean.app"
                fetch(url).then(res => res.json()).then(res => {
                    const logoSrc = res.data
                    const sisLogo = document.createElement("img")
                    sisLogo.src = logoSrc
                    sisLogo.alt = "Students In Style",
                    sisLogo.className = "sisLogo"
                    logoContainer.appendChild(sisLogo)
                })

                const headerElement = document.querySelector(".header")
                const sideBarHeader = document.querySelector(".sidebar__header")
                if (headerElement == null) {
                    throw new Error("doesnt exist yet")
                }
                chrome.storage.sync.get(["sis-color"], (result) => {
                    if (typeof result["sis-color"] == "string") {
                        headerElement.style.backgroundColor = `hsl(${result["sis-color"]}, 100%, 55%)`
                        sideBarHeader.style.backgroundColor = `hsl(${result["sis-color"]}, 100%, 55%)`
                        const icons = document.getElementsByClassName("fa")
                        for (let i = 0; i < icons.length; i++) {
                            icons.item(i).style.color = `hsl(${result["sis-color"]}, 100%, 10%)`
                        }
                        const activeTabMarkers = document.getElementsByClassName("tool")
                        for (let i = 0; i < activeTabMarkers.length; i++) {
                            activeTabMarkers.item(i).style.borderColor = `hsl(${result["sis-color"]}, 100%, 55%)`
                        }
                    }
                })
            } catch (e) {
                if(!sentMessage2){
                    console.log("just give it a minute")
                    sentMessage2 = true
                }
            }
        }
        if (window.location.href == "https://philasd.infinitecampus.org/campus/nav-wrapper/student/portal/student/today") {
            const setPage = (callback) => {
                let successful = true
                try {
                    const iframeElement = document.querySelector("#main-workspace")
                    const pfpElement = iframeElement.contentDocument.querySelector(".today__student-picture").firstChild
                    const nameElement = iframeElement.contentDocument.querySelector(".today__student-name")
                    chrome.storage.sync.get(["sis-pfp"], (result) => {
                        if (typeof result["sis-pfp"] == "string" && result["sis-pfp"] != "") {
                            pfpElement.setAttribute("src", result["sis-pfp"])
                        }
                    })
                    chrome.storage.sync.get(["sis-name"], (result) => {
                        if (typeof result["sis-name"] == "string" && result["sis-name"] != "") {
                            nameElement.innerHTML = result["sis-name"]
                        }
                    })
                } catch (e) {
                    if(!sentMessage3){
                        console.log("try getting some wifi bruh")
                        sentMessage3 = true
                    }
                    successful = false
                }
                callback(successful)
            }

            const setUntilSuccessful = (successful) => {
                if (!successful) {
                    setTimeout(() => {
                        setPage(setUntilSuccessful)
                    }, 100)
                }
            }
            setUntilSuccessful(false)
        }
    }
})