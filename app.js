App({
  async onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'education-7gon91rq0a4f9513',
        traceUser: true,
      });

      // 等待云环境初始化完成
      await wx.cloud.callFunction({
        name: 'login',
        data: {}
      }).catch(err => {
        console.error('云环境初始化测试失败：', err);
      });

      // 初始化多环境
      this.c1 = new wx.cloud.Cloud({
        resourceAppid: "wx3199c80279c7b8c3",
        resourceEnv: "education-7gon91rq0a4f9513"
      });
      
      await this.c1.init();
    }
    
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (token) {
      try {
        // 验证token有效性
        const result = await this.c1.callFunction({
          name: 'verifyToken',
          data: { token }
        });
        
        if (result.result.valid) {
          this.globalData.isLoggedIn = true;
          this.globalData.userInfo = result.result.userInfo;
        } else {
          wx.removeStorageSync('token');
        }
      } catch (err) {
        console.error('验证token失败：', err);
        wx.removeStorageSync('token');
      }
    }
  },

  globalData: {
    userInfo: null,
    isLoggedIn: false,
    c1: null
  }
}); 