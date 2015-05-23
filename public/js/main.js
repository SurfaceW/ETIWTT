// seajs 的简单配置
seajs.config({
  base: "/js/lib",
  alias: {
    "jquery": "/js/lib/jquery"
  }
})

// 加载入口模块
seajs.use("/js/ini");
