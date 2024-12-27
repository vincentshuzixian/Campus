Page({
  data: {
    cartItems: [],
    groupedItems: [],
    totalPrice: 0,
    totalCount: 0
  },

  onShow() {
    // 每次显示页面时重新获取购物车数据
    this.loadCartData();
  },

  loadCartData() {
    // 从本地存储获取购物车数据
    const cartItems = wx.getStorageSync('cartItems') || [];
    
    // 按餐厅分组
    const groupedItems = this.groupByRestaurant(cartItems);
    
    // 计算总价和总数量
    const { totalPrice, totalCount } = this.calculateTotal(cartItems);

    this.setData({
      cartItems,
      groupedItems,
      totalPrice,
      totalCount
    });
  },

  groupByRestaurant(cartItems) {
    const grouped = {};
    
    cartItems.forEach(item => {
      if (!grouped[item.restaurantId]) {
        grouped[item.restaurantId] = {
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          restaurantLogo: item.restaurantLogo,
          dishes: []
        };
      }
      grouped[item.restaurantId].dishes.push(item);
    });

    return Object.values(grouped);
  },

  calculateTotal(cartItems) {
    let totalPrice = 0;
    let totalCount = 0;

    cartItems.forEach(item => {
      totalPrice += item.price * item.quantity;
      totalCount += item.quantity;
    });

    return {
      totalPrice: totalPrice.toFixed(2),
      totalCount
    };
  },

  increaseQuantity(e) {
    const { restaurantId, dishId } = e.currentTarget.dataset;
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === dishId && item.restaurantId === restaurantId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    this.updateCart(cartItems);
  },

  decreaseQuantity(e) {
    const { restaurantId, dishId } = e.currentTarget.dataset;
    let cartItems = this.data.cartItems.map(item => {
      if (item.id === dishId && item.restaurantId === restaurantId) {
        return { ...item, quantity: Math.max(0, item.quantity - 1) };
      }
      return item;
    });

    // 移除数量为0的商品
    cartItems = cartItems.filter(item => item.quantity > 0);

    this.updateCart(cartItems);
  },

  deleteRestaurant(e) {
    const { restaurantId } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '提示',
      content: '确定要清空该餐厅的所有菜品吗？',
      success: (res) => {
        if (res.confirm) {
          const cartItems = this.data.cartItems.filter(
            item => item.restaurantId !== restaurantId
          );
          this.updateCart(cartItems);
        }
      }
    });
  },

  updateCart(cartItems) {
    // 更新本地存储
    wx.setStorageSync('cartItems', cartItems);
    
    // 重新加载购物车数据
    this.loadCartData();
  },

  checkout() {
    if (this.data.cartItems.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/order-confirm/order-confirm'
    });
  },

  goShopping() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
}); 