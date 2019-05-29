const JWT = require('jsonwebtoken');
const Joi = require('joi');
const axios = require('axios');
const config = require('../config');
const models = require('../models');
const decryptData = require('../utils/decrypted-data');

const GROUP_NAME = 'users';

module.exports = [
    {
        method: 'POST',
        path: `/${GROUP_NAME}/createJWT`,
        handler: async (request, reply) => {
            const generateJWT = (jwtInfo) => {
                const payload = {
                    userId: jwtInfo.userId,
                    exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
                };
                return JWT.sign(payload, config.jwtSecret);
            };
            reply(generateJWT({
                userId: 1,
            }));
        },
        config: {
            tags: ['api', GROUP_NAME],
            description: '用于测试的用户 JWT 签发',
            auth: false, // 约定此接口不参与 JWT 的用户验证，会结合下面的 hapi-auth-jwt 来使用
        },
    },
    {
        /* 微信小程序登录流程
        1） 小程序提供自封装的 wx.login() 方法，帮助前端开发者获取 临时登录凭证 code 值。
        2） hapi 后端服务提供一个类似 wxLogin 的接口，接收小程序传来的 code 值，结合小程序申请时的 appid 与 appsecret，一并向微信接口服务器交换回 session_key 与 openid 等。
        临时登录凭证 code 只能使用一次。会话密钥 session_key 是对用户数据进行加密签名的密钥。为了应用自身的数据安全，开发者服务器不应该把会话密钥下发到小程序，也不应该对外提供这个密钥。
        3） hapi 后端服务通过 openid 向数据库查询是否已有该 openid 的用户，如果没有，则作为新用户，创建一条该 openid 的 新用户记录。最终获取该 openid 所对应的 user_id，并向小程序签发包涵 user_id 的 JWT。
        4） 小程序获取到 JWT 信息后，保存在本地，并在后续的请求中通过 header Authorization=(jwt 值) 的方式与 hapi 后端服务器通信，访问需要身份验证的服务接口。
        */
        method: 'POST',
        path: `/${GROUP_NAME}/wxLogin`,
        handler: async (req, reply) => {
            const appid = config.wxAppId; // 你的小程序 appId
            const secret = config.wxAppSecret; // 你的小程序 appSecret
            const { code, encryptedData, iv } = req.payload;
            // 向微信小程序开放平台 换取 openid 与 session_key
            const response = await axios({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                method: 'GET',
                params: {
                    appid,
                    secret,
                    js_code: code,
                    grant_type: 'authorization_code',
                },
            });
            // response 中返回 openid 与 session_key
            const { openid, session_key: sessionKey } = response.data;
            // 基于 openid 查找或创建一个用户
            const user = await models.users.findOrCreate({
                where: { open_id: openid },
            });
            // decrypt 解码用户信息
            const userInfo = decryptData(encryptedData, iv, sessionKey, appid);
            // 更新user表中的用户的资料信息
            await models.users.update({
                nick_name: userInfo.nickName,
                gender: userInfo.gender,
                avatar_url: userInfo.avatarUrl,
                open_id: openid,
                session_key: sessionKey,
            }, {
                where: { open_id: openid },
            });
            // 签发 jwt
            const generateJWT = (jwtInfo) => {
                const payload = {
                    userId: jwtInfo.userId,
                    exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
                };
                return JWT.sign(payload, config.jwtSecret);
            };
            reply(generateJWT({
                userId: user[0].id,
            }));
        },
        config: {
            auth: false, // 不需要用户验证
            tags: ['api', GROUP_NAME],
            validate: {
                payload: {
                    code: Joi.string().required().description('微信用户登录的临时code'),
                    encryptedData: Joi.string().required().description('微信用户信息encryptedData'),
                    iv: Joi.string().required().description('微信用户信息iv'),
                },
            },
        },
    },
];
