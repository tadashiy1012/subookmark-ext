{
  console.log("app(popup) script ready!");
  const out = document.getElementById("root");
  const addBtn = document.getElementById("addBtn");
  let memoUrl = "";
  let urlAry = JSON.parse(localStorage.getItem("urls"));
  if (urlAry === void 0 || urlAry === null) { urlAry = []; }
  console.log(urlAry);
  addBtn.addEventListener("click", (ev) => {
    console.log("click! url saved!");
    if (urlAry.indexOf(memoUrl) === -1) {
      urlAry.push(memoUrl);
      console.log("new url added!");
    }
    localStorage.setItem("urls", JSON.stringify(urlAry));
  });
  chrome.runtime.sendMessage("send from app(popup)");
  chrome.runtime.onMessage.addListener((req, sender, resp) => {
    console.log("message recived", req.msg);
    memoUrl = req.url;
  });
}