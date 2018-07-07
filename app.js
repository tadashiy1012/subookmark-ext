{
  console.log("app(popup) script ready!");

  let memoUrl = {url: "empty"};
  let memoUrlP = new Proxy(memoUrl, {
    set: (tgt, prop, val) =>  {
      console.log("update memoUrlP", val);
      if (val !== void 0 && val !== null && val.length > 0) {
        tgt[prop] = val;
      }
    }
  });
  let urlAry = {ary: getUrlAryFromLS()};
  let urlAryP = new Proxy(urlAry, {
    set: (tgt, prop, val) => {
      console.log("update urlAryP");
      console.log(vm.urlList, tgt, val);
      console.log(val);
      tgt.ary = val
      localStorage.setItem("urls", JSON.stringify(val));
    }
  })
  let vm = null;

  function getUrlAryFromLS() {
    let ary = JSON.parse(localStorage.getItem("urls"));
    if (ary === void 0 || ary === null) { ary = []; }
    console.log("ary is", ary);
    return ary;
  }

  function vAppInit() {

    const MyUrlList = {
      props: ["list"],
      template: `
        <div>
          <ul>
            <li v-for="item in list.ary">
              {{ item }}
            </li>
          </ul>
        </div>
      `
    };

    const MyInText = {
      props: ["tgtUrl"],
      template: `
        <div>
          <input type="text" :value="tgtUrl.url" />
        </div>
      `
    }

    const MyInButton = {
      props: ["urlList", "tgtUrl"],
      methods: {
        clickAction: function() {
          console.log("click!");
          console.log(this.urlList, this.tgtUrl);
          console.log(this.urlList.ary);
          let ls = this.urlList.ary;
          console.log(ls);
          console.log(this.urlList.ary === ls);
          //this.urlList.ary.push(this.tgtUrl.url);
          ls.push(this.tgtUrl.url);
          urlAryP.ary = ls;
        }
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
          <MyInButton :tgtUrl="tgtUrl" :urlList="urlList" />
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
  
  init();
}