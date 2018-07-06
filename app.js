{
  console.log("app(popup) script ready!");

  let memoUrl = "";
  let urlAry = null;
  let vm = null;

  function init() {
    chrome.runtime.sendMessage("send from app(popup)");
    chrome.runtime.onMessage.addListener((req, sender, resp) => {
      console.log("message recived", req.msg);
      memoUrl = req.url;
    });
    urlAry = getUrlAry();
    vm = vAppInit();
    console.log("app initialized!");
  }

  function vAppInit() {

    const MyUrlListItem = {
      props: ["list"],
      template: `
        <ol>
          <li v-for="item in list">{{ item }}</li>
        </ol>
      `
    };

    const MyUrlList = {
      props: ["list"],
      components: {MyUrlListItem},
      template: `
        <div>
          <MyUrlListItem :list="list" />
        </div>
      `
    };

    const MyRootComponent = {
      props: ["urlList"],
      components: {MyUrlList},
      template: `
        <div>
          <MyUrlList :list="urlList" />
        </div>
      `
    };

    let vm = new Vue({
      el: "#root",
      components: {MyRootComponent},
      data: {
        urlList: getUrlList()
      },
      template: `
        <MyRootComponent :urlList="urlList" />
      `
    });
    
    return vm;
  }

  function getUrlAry() {
    let ary = JSON.parse(localStorage.getItem("urls"));
    if (ary === void 0 || ary === null) { ary = []; }
    console.log(ary);
    return ary;
  }
  
  function getUrlList() {
    const a = [
      ...urlAry.map((elm, idx) => { return {id: idx, url: elm}; }),
      {id: 10000, url: "http://example.com"}
    ];
    return a;
  }

  function addBtnClick(ev) {
    if (urlAry.indexOf(memoUrl) === -1) {
      urlAry.push(memoUrl);
      console.log("new url added!");
    }
    localStorage.setItem("urls", JSON.stringify(urlAry));
  }
  
  init();
}