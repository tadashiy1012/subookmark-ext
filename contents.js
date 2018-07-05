{
  console.log("contents script ready!");
  chrome.runtime.sendMessage("hogehoge");
  chrome.runtime.onMessage.addListener(function(req, sender, resp) {
    console.log(req);
  });
}