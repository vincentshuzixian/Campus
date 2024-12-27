// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'education-7gon91rq0a4f9513'
})
const db = cloud.database()
const users = db.collection('users')
const crypto = require('crypto')

// 密码加密函数
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { username, password } = event

  try {
    // 检查用户名是否已存在
    const existUser = await users.where({
      username: username
    }).get()

    if (existUser.data.length > 0) {
      return {
        success: false,
        message: '用户名已存在'
      }
    }

    // 加密密码
    const { salt, hash } = hashPassword(password)

    // 创建新用户
    const result = await users.add({
      data: {
        username,
        password: hash,
        salt,
        createTime: db.serverDate(),
        avatarUrl: '/images/default-avatar.png',
        phone: ''
      }
    })

    return {
      success: true,
      message: '注册成功'
    }

  } catch (err) {
    console.error('[注册失败]', err)
    return {
      success: false,
      message: '注册失败'
    }
  }
} 