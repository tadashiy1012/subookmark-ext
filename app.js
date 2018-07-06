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
  let urlAry = {list: getUrlAryFromLS()};
  let urlAryP = new Proxy(urlAry, {
    set: (tgt, prop, val) => {
      console.log("update urlAryP");
      console.log(vm.urlList, tgt, val);
      tgt.list.push(val);
      vm.urlList = tgt;
    }
  })
  let vm = null;

  function getUrlAryFromLS() {
    let ary = JSON.parse(localStorage.getItem("urls"));
    if (ary === void 0 || ary === null) { ary = []; }
    console.log(ary);
    return ary;
  }

  function vAppInit() {

    const MyUrlList = {
      props: ["list"],
      template: `
        <div>
          <ul>
            <li v-for="item in list">
              {{ item.url }}
            </li>
          </ul>
        </div>
      `
    };

    const MyInText = {
      props: ["tgtUrl"],
      template: `
        <div>
          <input type="text" :value="tgtUrl" />
        </div>
      `
    }

    const MyInButton = {
      methods: {
        clickAction: () => { console.log("click!"); }
      },
      template: `
        <div>
          <button @click="clickAction">bookmark url</button>
        </div>
      `
    };

    const MyRootComponent = {
      props: ["urlList", "tgtUrl"],
      components: {MyUrlList, MyInText, MyInButton},
      template: `
        <div>
          <MyUrlList :list="urlList" />
          <br />
          <MyInText :tgtUrl="tgtUrl" />
          <br />
          <MyInButton />
        </div>
      `
    };
  
    let vm = new Vue({
      el: "#root",
      components: {MyRootComponent},
      data: {
        urlList: urlAryP,
        tgtUrl: memoUrlP,
      },
      template: `
        <MyRootComponent :urlList="urlList" :tgtUrl="tgtUrl" />
      `
    });
    
    return vm;
  }

  function init() {
    console.log("app init");
    chrome.runtime.sendMessage("send from app(popup)");
    chrome.runtime.onMessage.addListener((req, sender, resp) => {
      console.log("message recived", req);
      memoUrlP.url = req.url;
    });
    vm = vAppInit();
  }

  /*function addBtnClick(ev) {
    if (urlAry.indexOf(memoUrl) === -1) {
      urlAry.push(memoUrl);
      console.log("new url added!");
    }
    localStorage.setItem("urls", JSON.stringify(urlAry));
  }*/
  
  init();
  console.log(memoUrlP);
  console.log(urlAryP);
  
}