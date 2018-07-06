{
  console.log("app(popup) script ready!");

  let memoUrl = {url: "empty"};
  let memoUrlP = new Proxy(memoUrl, {
    set: (tgt, prop, val) =>  {
      console.log("update memoUrlP");
      console.log(vm.tgtUrl, tgt, prop, val);
      vm.tgtUrl = tgt[prop] = val;
    }
  });
  let urlAry = null;
  let vm = null;

  function init() {
    chrome.runtime.sendMessage("send from app(popup)");
    chrome.runtime.onMessage.addListener((req, sender, resp) => {
      console.log("message recived", req);
      memoUrlP.url = req.url;
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

    const MyInText = {
      props: ["tgtUrl"],
      template: `
        <div>
          <span>{{tgtUrl}}</span>
          <input type="text" :value="tgtUrl" />
        </div>
      `
    }

    const MyRootComponent = {
      props: ["urlList", "tgtUrl"],
      components: {MyUrlList, MyInText},
      template: `
        <div>
          <MyUrlList :list="urlList" />
          <br />
          <MyInText :tgtUrl="tgtUrl" />
        </div>
      `
    };

    let vm = new Vue({
      el: "#root",
      components: {MyRootComponent},
      data: {
        urlList: getUrlList(),
        tgtUrl: memoUrlP
      },
      template: `
        <MyRootComponent :urlList="urlList" :tgtUrl="tgtUrl" />
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