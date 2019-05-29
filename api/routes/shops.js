const Joi = require('joi');
const { paginationDefine } = require('../utils/router-helper');
const { jwtHeaderDefine } = require('../utils/router-helper');
const models = require('../models');

const GROUP_NAME = 'shops';

module.exports = [
  {
    method: 'GET',
    path: `/${GROUP_NAME}`,
    handler: async (request, reply) => {

      // 通过 await 来异步查取数据

      /* 隐藏返回列表中不需要的字段
        很多时候，我们并不希望 findAll 来将数据表中的所有数据全都暴露出来，
        比如在查询用户列表时，用户的密码的值，便是特别敏感的数据。
        我们可以在 findAll 中加入一个 attributes 的约束，可以是一个要查询的属性（字段）列表，
        或者是一个 key 为 include 或 exclude 对象的键，
        比如对于用户表，findAll({ attributes: { exclude: ['password'] } })，
        就可以排除密码字段的查询露出。
      */

      // const result = await models.shops.findAll({
      //   attributes: [
      //     'id', 'name'
      //   ]
      // });

      /*
        考虑到分页的查询功能除了拉取列表外，还要获取总条目数，
        Sequelize 为我们提供了 findAndCountAll 的 API，
        来为分页查询提供更高效的封装实现，返回的列表与总条数会分别存放在 rows 与 count 字段的对象中。

      */

      const { rows: results, count: totalCount } = await models.shops.findAndCountAll({
        attributes: [
          'id',
          'name',
        ],
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit,
      });

      // 开启分页的插件，返回的数据结构里，需要带上result与totalCount两个字段
      reply({ results, totalCount });

    },
    config: {
      auth: false,  // 一些特定接口不通过 JWT 验证
      tags: ['api', GROUP_NAME],
      description: '获取店铺列表',
      validate: {
        // headers: Joi.object({  // header 入参校验
        //   authorization: Joi.string().required(),
        // }).unknown(),
        ...jwtHeaderDefine, // 整理公共的 header 定义
        query: {
          ...paginationDefine,
        },
      },
    },
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/{shopId}/goods`,
    handler: async (request, reply) => {
      // 增加带有where的条件查询
      const { rows: results, count: totalCount } = await models.goods.findAndCountAll({
        // 基于 shop_id 的条件查询
        where: {
          shop_id: request.params.shopId,
        },
        attributes: [
          'id',
          'name',
        ],
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit,
      });
      // 开启分页的插件，返回的数据结构里，需要带上result与totalCount两个字段
      reply({ results, totalCount });
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '获取店铺的商品列表',
      validate: {
        params: {
          shopId: Joi.string().required().description('店铺的id'),
        },
        query: {
          ...paginationDefine,
        },
      },
    },
  },
];
