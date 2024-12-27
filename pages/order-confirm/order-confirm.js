Page({
  data: {
    restaurant: null,
    items: [],
    totalPrice: 0,
    timeArray: [
      ['今天', '明天'],
      ['11:30', '12:00', '12:30', '13:00', '17:30', '18:00', '18:30', '19:00']
    ],
    timeIndex: [0, 0],
    selectedTime: '',
    pickupMethod: 'self',
    paymentMethod: 'wechat',
    remarks: ''
  },

  onLoad() {
    // 从购物车获取数据
    const cartItems = wx.getStorageSync('cartItems') || [];
    if (cartItems.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'error',
        complete: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
      return;
    }

    // 获取第一个商品的餐厅信息
    const restaurant = {
      logo: cartItems[0].restaurantLogo,
      name: cartItems[0].restaurantName,
      address: '广州市天河区珠江新城华夏路10号'
    };

    // 计算总价
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 
      0
    ).toFixed(2);

    this.setData({
      restaurant,
      items: cartItems,
      totalPrice
    });
  },

  onTimeChange(e) {
    const [dayIndex, timeIndex] = e.detail.value;
    const day = this.data.timeArray[0][dayIndex];
    const time = this.data.timeArray[1][timeIndex];
    
    this.setData({
      timeIndex: e.detail.value,
      selectedTime: `${day} ${time}`
    });
  },

  selectMethod(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({ pickupMethod: method });
  },

  selectPayment(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({ paymentMethod: method });
  },

  onRemarksChange(e) {
    this.setData({
      remarks: e.detail.value
    });
  },

  submitOrder() {
    if (!this.data.selectedTime) {
      wx.showToast({
        title: '请选择取餐时间',
        icon: 'none'
      });
      return;
    }

    // 这里添加提交订单的逻辑
    wx.showLoading({
      title: '提交订单中...'
    });

    // 模拟提交订单
    setTimeout(() => {
      wx.hideLoading();
      
      // 清空购物车
      wx.setStorageSync('cartItems', []);

      wx.showToast({
        title: '下单成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 延迟跳转到订单列表页
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 2000);
        }
      });
    }, 1500);
  }
}); 