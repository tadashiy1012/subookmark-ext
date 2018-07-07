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
      console.log("update urlAryP", val);
      tgt.ary = val
      localStorage.setItem("urls", JSON.stringify(val));
    }
  })
  let vm = null;

  function getUrlAryFromLS() {
    let ary = JSON.parse(localStorage.getItem("urls"));
    if (ary === void 0 || ary === null) { ary = []; }
    return ary;
  }

  function vAppInit() {

    const MyUrlList = {
      props: ["list"],
      template: `
        <div>
          <table class="pure-table pure-table-horizontal " style="width: 100%;">
            <tr v-for="item in list.ary">
              <td>{{ item }}</td>
            </tr>
          </table>
        </div>
      `
    };

    const MyInButton = {
      props: ["urlList", "tgtUrl"],
      methods: {
        clickAction: function() {
          let ls = this.urlList.ary;
          ls.push(this.tgtUrl.url);
          urlAryP.ary = ls;
        }
      },
      template: `
        <div>
          <form class="pure-form">
            <input type="text" class="pure-input-1" :value="tgtUrl.url" />
            <button @click="clickAction" class="pure-button pure-input-1">
              bookmark url
            </button>
          </form>
        </div>
      `
    };

    const MyRootComponent = {
      props: ["urlList", "tgtUrl"],
      components: {MyUrlList, MyInButton},
      template: `
        <div>
          <MyUrlList :list="urlList" />
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