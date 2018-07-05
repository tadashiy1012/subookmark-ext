{
  console.log("app(popup) script ready!");
  const out = document.getElementById("out1");
  const inTxt = document.getElementById("inTxt");
  const addBtn = document.getElementById("addBtn");
  let dataObj = {text: "", url: ""};
  window.addEventListener("load", (ev) => {
    console.log("window loaded");
    chrome.runtime.sendMessage("fugafuga");
  });
  addBtn.addEventListener("click", (ev) => {
    console.log("click!");
    out.innerText = dataObj.url
  });
  chrome.runtime.onMessage.addListener((req, sender, resp) => {
    console.log("message recived");
    dataObj.text = req;
    dataObj.url = sender.url;
    inTxt.value = dataObj.url
  });
}