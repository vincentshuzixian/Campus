const app = getApp()

Page({
  data: {
    isRegister: false,
    username: '',
    password: '',
    confirmPassword: ''
  },

  switchToRegister() {
    this.setData({
      isRegister: true,
      username: '',
      password: '',
      confirmPassword: ''
    });
  },

  switchToLogin() {
    this.setData({
      isRegister: false,
      username: '',
      password: '',
      confirmPassword: ''
    });
  },

  async handleRegister() {
    const { username, password, confirmPassword } = this.data;
    
    if (!username || !password || !confirmPassword) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '注册中...' });

    try {
      const result = await app.c1.callFunction({
        name: 'register',
        data: { username, password }
      });

      if (result.result.success) {
        wx.showToast({
          title: '注册成功',
          icon: 'success'
        });
        this.switchToLogin();
      } else {
        wx.showToast({
          title: result.result.message || '注册失败',
          icon: 'none'
        });
      }
    } catch (err) {
      console.error('注册失败：', err);
      wx.showToast({
        title: '注册失败，请重试',
        icon: 'none'
      });
    }

    wx.hideLoading();
  },

  async handleLogin() {
    const { username, password } = this.data;
    
    if (!username || !password) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    try {
      const result = await app.c1.callFunction({
        name: 'login',
        data: { username, password }
      });

      if (result.result.success) {
        // 保存登录状态和用户信息
        wx.setStorageSync('token', result.result.token);
        
        // 立即验证 token
        try {
          const verifyResult = await app.c1.callFunction({
            name: 'verifyToken',
            data: { token: result.result.token }
          });
          
          if (!verifyResult.result.valid) {
            wx.showToast({
              title: '登录验证失败',
              icon: 'none'
            });
            return;
          }
          
          app.globalData.isLoggedIn = true;
          app.globalData.userInfo = result.result.userInfo;

          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/index/index'
                });
              }, 1500);
            }
          });
        } catch (err) {
          console.error('验证token失败：', err);
          wx.showToast({
            title: '登录验证失败',
            icon: 'none'
          });
        }
      } else {
        wx.showToast({
          title: result.result.message || '登录失败',
          icon: 'none'
        });
      }
    } catch (err) {
      console.error('登录失败：', err);
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
    }

    wx.hideLoading();
  }
}); 