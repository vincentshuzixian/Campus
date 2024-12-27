const app = getApp();

Page({
  data: {
    userInfo: null,
    isLoggedIn: false
  },

  onLoad() {
    this.updateUserInfo();
  },

  onShow() {
    // 每次页面显示时更新用户信息
    this.updateUserInfo();
  },

  updateUserInfo() {
    // 从全局获取用户信息和登录状态
    const userInfo = app.globalData.userInfo;
    const isLoggedIn = app.globalData.isLoggedIn;

    this.setData({
      userInfo,
      isLoggedIn
    });
  },

  goToOrders() {
    wx.switchTab({
      url: '/pages/orders/orders'
    });
  },

  goToAddress() {
    wx.showToast({
      title: '地址管理开发中',
      icon: 'none'
    });
  },

  goToContact() {
    wx.showToast({
      title: '联系方式开发中',
      icon: 'none'
    });
  },

  goToSettings() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none'
    });
  },

  contactService() {
    wx.showModal({
      title: '联系客服',
      content: '客服电话：400-123-4567',
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '4001234567'
          });
        }
      }
    });
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态和用户信息
          wx.removeStorageSync('token');
          app.globalData.userInfo = null;
          app.globalData.isLoggedIn = false;

          // 更新页面状态
          this.setData({
            userInfo: null,
            isLoggedIn: false
          });

          // 跳转到登录页
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    });
  },

  async changePassword() {
    wx.showModal({
      title: '修改密码',
      content: '确定要修改密码吗？',
      success: async (res) => {
        if (res.confirm) {
          // 输入原密码
          const oldPasswordRes = await wx.showModal({
            title: '请输入原密码',
            editable: true,
            placeholderText: '请输入原密码'
          });

          if (!oldPasswordRes.confirm || !oldPasswordRes.content) {
            wx.showToast({
              title: '请输入原密码',
              icon: 'none'
            });
            return;
          }

          // 输入新密码
          const newPasswordRes = await wx.showModal({
            title: '请输入新密码',
            editable: true,
            placeholderText: '请输入新密码'
          });

          if (!newPasswordRes.confirm || !newPasswordRes.content) {
            wx.showToast({
              title: '请输入新密码',
              icon: 'none'
            });
            return;
          }

          // 确认新密码
          const confirmPasswordRes = await wx.showModal({
            title: '请确认新密码',
            editable: true,
            placeholderText: '请再次输入新密码'
          });

          if (!confirmPasswordRes.confirm || !confirmPasswordRes.content) {
            wx.showToast({
              title: '请确认新密码',
              icon: 'none'
            });
            return;
          }

          if (newPasswordRes.content !== confirmPasswordRes.content) {
            wx.showToast({
              title: '两次密码不一致',
              icon: 'none'
            });
            return;
          }

          const token = wx.getStorageSync('token');
          if (!token) {
            wx.showToast({
              title: '登录已过期，请重新登录',
              icon: 'none'
            });
            setTimeout(() => {
              this.logout();
            }, 1500);
            return;
          }

          try {
            wx.showLoading({
              title: '修改中...',
              mask: true
            });

            const result = await app.c1.callFunction({
              name: 'changePassword',
              data: {
                oldPassword: oldPasswordRes.content,
                newPassword: newPasswordRes.content,
                token
              }
            });

            wx.hideLoading();

            if (result.result.success) {
              wx.showToast({
                title: '密码修改成功',
                icon: 'success'
              });
              setTimeout(() => {
                this.logout();
              }, 1500);
            } else {
              wx.showToast({
                title: result.result.message || '修改失败',
                icon: 'none'
              });
            }
          } catch (err) {
            wx.hideLoading();
            console.error('修改密码失败：', err);
            wx.showToast({
              title: '修改失败，请重试',
              icon: 'none'
            });
          }
        }
      }
    });
  }
}); 