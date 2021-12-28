const pfpInput = document.getElementById("pfpInput")

chrome.storage.sync.get(["sis-pfp"], (result) => {
    if(typeof result["sis-pfp"] == "string" && result["sis-pfp"] != ""){
        pfpInput.value = result["sis-pfp"]
    }
})

pfpInput.addEventListener("change", () => {
    chrome.storage.sync.set({ "sis-pfp": pfpInput.value })
})

const nameInput = document.getElementById("nameInput")

chrome.storage.sync.get(["sis-name"], (result) => {
    if(typeof result["sis-name"] == "string" && result["sis-name"] != ""){
        nameInput.value = result["sis-name"]
    }
})

nameInput.addEventListener("change", () => {
    chrome.storage.sync.set({ "sis-name": nameInput.value })
})

const colorPickerLabel = document.getElementById("colorPickerLabel")
chrome.storage.sync.get(["sis-color"], (result) => {
    if(typeof result["sis-color"] == "string"){
        colorPickerLabel.style.color = `hsl(${result["sis-color"]}, 100%, 55%)`
    }
})

const colorPickerCanvas = document.getElementById("colorPicker")
const ctx = colorPickerCanvas.getContext("2d")

for(let i = 0;i<colorPickerCanvas.width;i++){
    ctx.strokeStyle = `hsl(${Math.floor(360 * i / colorPickerCanvas.width)}, 100%, 55%)`
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, colorPickerCanvas.height)
    ctx.closePath()
    ctx.stroke()
}

colorPickerCanvas.addEventListener("mousedown", (e) => {
    colorPickerLabel.style.color = `hsl(${Math.floor(360 * e.offsetX / colorPickerCanvas.width)}, 100%, 55%)`
    chrome.storage.sync.set({ "sis-color": `${Math.floor(360 * e.offsetX / colorPickerCanvas.width)}` })
})

const resetColorButton = document.getElementById("resetColor")
resetColorButton.addEventListener("click", () => {
    colorPickerLabel.style.color = "rgb(220, 220, 220)"
    chrome.storage.sync.set({ "sis-color": null })
})