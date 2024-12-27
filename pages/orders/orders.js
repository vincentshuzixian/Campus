Page({
  data: {
    currentStatus: 'all',
    orders: [],
    loading: false,
    noMore: false,
    page: 1
  },

  onLoad() {
    this.loadOrders();
  },

  onPullDownRefresh() {
    this.setData({
      orders: [],
      page: 1,
      noMore: false
    });
    this.loadOrders();
  },

  loadOrders() {
    if (this.data.loading || this.data.noMore) return;

    this.setData({ loading: true });

    // 模拟加载订单数据
    setTimeout(() => {
      // 模拟所有订单数据
      const allOrders = [
        {
          id: 1,
          restaurantId: 1,
          restaurantName: '米其林星级餐厅',
          restaurantLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
          createTime: '2024-03-20 12:30',
          status: 'processing',
          statusText: '进行中',
          progress: 2,
          deliveryMethod: 'delivery',
          dishes: [
            {
              id: 1,
              name: '和牛牛排',
              price: 288,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02'
            },
            {
              id: 2,
              name: '松露薯条',
              price: 88,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1544025162-d76694265947'
            }
          ],
          totalCount: 2,
          totalPrice: '398.00'
        },
        {
          id: 2,
          restaurantId: 2,
          restaurantName: '日式料理店',
          restaurantLogo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
          createTime: '2024-03-19 19:30',
          status: 'completed',
          statusText: '已完成',
          progress: 4,
          deliveryMethod: 'self',
          dishes: [
            {
              id: 3,
              name: '三文鱼刺身',
              price: 128,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'
            }
          ],
          totalCount: 1,
          totalPrice: '128.00'
        }
      ];

      // 根据当前状态筛选订单
      let filteredOrders;
      if (this.data.currentStatus === 'all') {
        filteredOrders = allOrders;
      } else {
        filteredOrders = allOrders.filter(order => order.status === this.data.currentStatus);
      }

      // 分页处理（每页5条数据）
      const pageSize = 5;
      const start = (this.data.page - 1) * pageSize;
      const end = start + pageSize;
      const currentPageOrders = filteredOrders.slice(start, end);

      this.setData({
        orders: this.data.page === 1 ? currentPageOrders : [...this.data.orders, ...currentPageOrders],
        loading: false,
        noMore: currentPageOrders.length < pageSize // 如果当前页数据不足，说明没有更多了
      });

      wx.stopPullDownRefresh();
    }, 1000);
  },

  switchStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({
      currentStatus: status,
      orders: [],
      page: 1,
      noMore: false
    });
    this.loadOrders();
  },

  loadMore() {
    if (!this.data.noMore) {
      this.setData({ page: this.data.page + 1 });
      this.loadOrders();
    }
  },

  goToComment(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '评价功能开发中',
      icon: 'none'
    });
  },

  cancelOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 这里添加取消订单的逻辑
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
        }
      }
    });
  },

  reorder(e) {
    const orderId = e.currentTarget.dataset.id;
    // 获取对应的订单信息
    const order = this.data.orders.find(item => item.id === orderId);
    
    if (!order) {
      wx.showToast({
        title: '订单信息不存在',
        icon: 'none'
      });
      return;
    }

    // 直接跳转到餐厅详情页
    wx.navigateTo({
      url: `/pages/restaurant-detail/restaurant-detail?id=${order.restaurantId}`
    });
  },

  goShopping() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
}); 