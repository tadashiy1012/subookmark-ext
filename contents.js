{
  console.log("content script ready!");
  chrome.runtime.sendMessage("send from content-script");
  chrome.runtime.onMessage.addListener(function(req, sender, resp) {
    console.log(req);
  });
}