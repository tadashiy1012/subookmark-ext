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
      tgt.ary = [...new Set(val)].slice(-3);
      localStorage.setItem("urls", JSON.stringify(tgt.ary));
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
      props: ["items"],
      template: `
        <div>
          <table class="pure-table pure-table-horizontal " style="width: 100%;">
            <tr v-for="item in items">
              <td><a :href="item" target="_blank">{{ item }}</a></td>
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
        <div class="pure-form">
          <input type="text" class="pure-input-1" :value="tgtUrl.url" />
          <button @click="clickAction" class="pure-button pure-input-1">
            bookmark url
          </button>
        </div>
      `
    };

    const MyRootComponent = {
      props: ["urlList", "tgtUrl"],
      components: {MyUrlList, MyInButton},
      template: `
        <div>
          <MyUrlList :items="urlList.ary" />
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