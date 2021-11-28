import { observer } from "./observer.js";
import { Compile } from "./compile.js";
function SelfVue(options) {
  const self = this;
  this.data = options.data;
  this.methods = options.methods;
  Object.keys(this.data).forEach((key) => {
    self.proxyKeys(key);
  });
  observer(this.data);
  new Compile(options.el, this);
  options.mounted.call(this);
}
// 访问方式从selfVue.data.xxx => self.xxx做了一层代理拦截
SelfVue.prototype = {
  proxyKeys: function (key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function () {
        return self.data[key];
      },
      set: function (newVal) {
        self.data[key] = newVal;
      },
    });
  },
};
export { SelfVue };
