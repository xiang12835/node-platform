// config/index.js

const { env } = process;

module.exports = {
  host: env.HOST,
  port: env.PORT,
  jwtSecret: env.JWT_SECRET,
  wxAppId: env.WX_APP_ID,
  wxAppSecret: env.WX_APP_SECRET,
  wxMchId: env.WX_MCH_ID,
  wxPayApiKey: env.WX_PAY_API_KEY,
}
