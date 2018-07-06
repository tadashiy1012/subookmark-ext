{
  console.log("content script ready!");
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      console.log("vi change!");
      chrome.runtime.sendMessage("send from content-script at vi change");
    }
  });
  window.addEventListener("focus", () => {
    console.log("focus!");
    chrome.runtime.sendMessage("send from content-script at focus")
  });
  chrome.runtime.sendMessage("send from content-script");
}