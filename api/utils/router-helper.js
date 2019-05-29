/*
考虑到系统中未来会有不少接口需要做分页处理，我们在 utils/router-helper.js 中，增加一个公共的分页入参校验配置
*/
const Joi = require('joi');

const paginationDefine = {
  limit: Joi.number().integer().min(1).default(10)
    .description('每页的条目数'),
  page: Joi.number().integer().min(1).default(1)
    .description('页码数'),
  pagination: Joi.boolean().description('是否开启分页，默认为true'),
}

module.exports = { paginationDefine }


const jwtHeaderDefine = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}

module.exports = { jwtHeaderDefine }
