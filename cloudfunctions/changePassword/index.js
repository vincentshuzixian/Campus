// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'education-7gon91rq0a4f9513'
})
const db = cloud.database()
const users = db.collection('users')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// 使用与 login 函数相同的密钥
const SECRET_KEY = 'your-food-recommend-secret-key-2024'

// 密码加密函数
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { oldPassword, newPassword, token } = event

  try {
    // 验证 token 并获取用户信息
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('decoded token:', decoded);
    
    // 查找用户
    const userResult = await users.where({
      username: decoded.username
    }).get();
    console.log('userResult:', userResult);

    if (userResult.data.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      }
    }

    const currentUser = userResult.data[0];
    
    // 验证旧密码
    const oldHash = hashPassword(oldPassword, currentUser.salt)
    if (oldHash !== currentUser.password) {
      return {
        success: false,
        message: '原密码错误'
      }
    }

    // 生成新密码的 hash
    const newHash = hashPassword(newPassword, currentUser.salt)

    try {
      // 更新密码
      await users.doc(currentUser._id).update({
        data: {
          password: newHash
        }
      });
      return {
        success: true,
        message: '密码修改成功'
      }
    } catch (updateErr) {
      console.error('更新密码失败:', updateErr);
      return {
        success: false,
        message: '更新密码失败'
      }
    }

  } catch (err) {
    console.error('[修改密码失败]', err);
    if (err.name === 'JsonWebTokenError') {
      return {
        success: false,
        message: 'token无效或已过期'
      }
    }
    if (err.name === 'TokenExpiredError') {
      return {
        success: false,
        message: 'token已过期，请重新登录'
      }
    }
    return {
      success: false,
      message: err.message || '修改密码失败'
    }
  }
} 