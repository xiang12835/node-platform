const jwt = require('jsonwebtoken');
// 签发一条 1 小时后失效的 JWT
const token = jwt.sign(
  {
    foo: 'bar',
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
  },
  'your-secret'
);
console.log(token);
