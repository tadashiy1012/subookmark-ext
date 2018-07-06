{
  console.log("background script ready!");
  const extId = chrome.runtime.id;
  let conUrl = "";
  chrome.runtime.onMessage.addListener(function(req, sender, resp) {
    console.log(req, sender);
    const msg = "send from bg";
    if (sender.tab === void 0) {
      chrome.runtime.sendMessage(extId, {msg: msg, url: conUrl});
    } else {
      conUrl = sender.url;
      //chrome.tabs.sendMessage(sender.tab.id, {msg: msg, url: sender.url});
    }
  });
}