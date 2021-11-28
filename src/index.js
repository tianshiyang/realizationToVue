import { SelfVue } from "./responsive/selfVue.js";
new SelfVue({
  el: "#app",
  data: {
    name: "张三",
    age: 22,
    children: [
      {
        childName: "王五",
        age: "1",
      },
      {
        childName: "赵六",
        age: "2",
      },
    ],
    hobby: {
      hobbyName: "play basketball",
      hasUtil: "basketball",
    },
  },
  mounted: function () {
    window.setTimeout(() => {
      this.name = "你好";
    }, 1000);
  },
});
