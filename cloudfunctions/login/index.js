// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'education-7gon91rq0a4f9513'
})
const db = cloud.database()
const users = db.collection('users')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const SECRET_KEY = 'your-food-recommend-secret-key-2024' // 用于生成 token 的密钥

// 验证密码
function verifyPassword(password, hash, salt) {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { username, password } = event
  const wxContext = cloud.getWXContext()

  try {
    // 查找用户
    const userResult = await users.where({
      username: username
    }).get()

    if (userResult.data.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      }
    }

    const user = userResult.data[0]

    // 验证密码
    if (!verifyPassword(password, user.password, user.salt)) {
      return {
        success: false,
        message: '密码错误'
      }
    }

    // 生成 token
    const token = jwt.sign(
      { 
        uid: user._id,
        username: user.username,
        openid: wxContext.OPENID
      },
      SECRET_KEY,
      { expiresIn: '7d' }
    )

    // 返回用户信息和 token
    return {
      success: true,
      token,
      userInfo: {
        nickName: user.username,
        avatarUrl: user.avatarUrl,
        phone: user.phone
      }
    }

  } catch (err) {
    console.error('[登录失败]', err)
    return {
      success: false,
      message: '登录失败'
    }
  }
} 