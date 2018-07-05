{
  console.log("background script ready!");
  const extId = chrome.runtime.id;
  chrome.runtime.onMessage.addListener(function(req, sender, resp) {
    console.log(req, sender.url);
    const msg = req + " " + req;
    if (sender.tab === void 0) {
      chrome.runtime.sendMessage(extId, msg);
    } else {
      chrome.tabs.sendMessage(sender.tab.id, msg);
    }
  });
}