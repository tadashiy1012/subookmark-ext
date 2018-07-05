{
  console.log("app(popup) script ready!");
  const out = document.getElementById("out");
  const addBtn = document.getElementById("addBtn");
  addBtn.addEventListener("click", (ev) => {
    console.log("click!");
  });
  chrome.runtime.sendMessage("fugafuga");
  chrome.runtime.onMessage.addListener(function(req, sender, resp) {
    out.innerText = req;
  });
}