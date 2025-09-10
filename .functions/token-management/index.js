
    'use strict';

    const cloudbase = require('@cloudbase/node-sdk');
    const jwt = require('jsonwebtoken');
    const crypto = require('crypto');

    const app = cloudbase.init({
      env: cloudbase.DYNAMIC_CURRENT_ENV,
    });
    const models = app.models;

    // 生成 refreshToken
    function generateRefreshToken(userId) {
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(16).toString('hex');
      return crypto.createHash('sha256').update(`${userId}${randomString}${timestamp}`).digest('hex');
    }

    // 生成 accessToken
    function generateAccessToken(userId) {
      return jwt.sign(
        { userId, exp: Math.floor(Date.now() / 1000) + 3600 }, // 1小时有效期
        'your-secret-key'
      );
    }

    // 存储 refreshToken 到数据模型
    async function storeRefreshToken(userId, refreshToken) {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7天后过期
      return await models.token.create({
        data: {
          userId,
          refreshToken,
          expiresAt,
        },
      });
    }

    // 验证用户凭证
    async function validateCredentials(credentials) {
      // 这里替换为实际的用户验证逻辑
      const user = await models.user.get({
        filter: {
          where: {
            username: credentials.username,
            password: credentials.password,
          },
        },
      });
      if (!user) throw new Error('Invalid credentials');
      return user;
    }

    exports.main = async (event, context) => {
      try {
        const { credentials } = event;

        // 1. 验证用户凭证
        const user = await validateCredentials(credentials);
        if (!user) {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Invalid credentials' }),
          };
        }

        // 2. 生成 tokens
        const refreshToken = generateRefreshToken(user._id);
        const accessToken = generateAccessToken(user._id);

        // 3. 存储 refreshToken
        await storeRefreshToken(user._id, refreshToken);

        // 4. 设置 Cookie
        const cookie = `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=604800; SameSite=Strict`;

        return {
          statusCode: 200,
          headers: {
            'Set-Cookie': cookie,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
            },
          }),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Internal server error' }),
        };
      }
    };
  