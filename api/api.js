// APP 入口的 JS

require('env2')('./.env');

const Hapi = require('hapi');
const config = require('./config');

const routesHelloHapi = require('./routes/hello-hapi');
const routesShops = require('./routes/shops');
const routesOrders = require('./routes/orders');
const routesUsers = require('./routes/users');

// 引入自定义的 hapi-swagger 插件配置
const pluginHapiSwagger = require('./plugins/hapi-swagger');

// 在 app.js 中注册使用 hapi-pagination
const pluginHapiPagination = require('./plugins/hapi-pagination');

// 在 app.js 中注册 hapi-auth-jwt2 插件
const hapiAuthJWT2 = require('hapi-auth-jwt2');
const pluginHapiAuthJWT2 = require('./plugins/hapi-auth-jwt2');


const server = new Hapi.Server();
// 配置服务器启动 host 与端口
server.connection({
  port: config.port,
  host: config.host,
});

const init = async () => {

  // 注册插件
  await server.register([
    ...pluginHapiSwagger,
    pluginHapiPagination,
    hapiAuthJWT2,
  ]);

  /*
  hapi-auth-jwt2 的注册使用方式与其他插件略有不同，是在插件完成 register 注册之后，
  通过获取 server 实例后才完成最终的配置，
  所以，在代码书写上，存在一个先后顺序问题。

  */
  pluginHapiAuthJWT2(server);

  // 注册路由
  server.route([
    // 创建一个简单的hello hapi接口
    ...routesHelloHapi,
    ...routesShops,
    ...routesOrders,
    ...routesUsers,
  ]);

  // 启动服务
  await server.start();

  console.log(`Server running at: ${server.info.uri}`);
};

init();
