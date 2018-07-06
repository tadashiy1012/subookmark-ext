{
  console.log("content script ready!");
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      console.log("change!");
      chrome.runtime.sendMessage("send from content-script at vi change");
    }
  });
  chrome.runtime.sendMessage("send from content-script");
}