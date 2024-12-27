// 在 Page 外部定义菜品数据库
const dishDatabase = {
  1: {
    id: 1,
    name: '和牛牛排',
    price: 388,
    monthlySales: 156,
    description: 'A5级和牛，搭配时令蔬菜和特制酱料，口感细腻，风味绝佳。',
    images: [
      'https://images.unsplash.com/photo-1546039907-7fa05f864c02',
      'https://images.unsplash.com/photo-1544025162-d76694265947',
      'https://images.unsplash.com/photo-1558030006-450675393462'
    ],
    restaurantName: '米其林星级餐厅',
    restaurantLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    restaurantId: 1,
    recommendations: [
      {
        id: 5,
        name: '松露薯条',
        price: 58,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877'
      },
      {
        id: 6,
        name: '凯撒沙拉',
        price: 48,
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1'
      }
    ]
  },
  2: {
    id: 2,
    name: '三文鱼刺身',
    price: 128,
    monthlySales: 238,
    description: '精选挪威三文鱼，现切现制，搭配日本芥末和特制酱油。',
    images: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
      'https://images.unsplash.com/photo-1553621042-f6e147245754',
      'https://images.unsplash.com/photo-1584583570840-0a3d88497593'
    ],
    restaurantName: '寿司之神',
    restaurantLogo: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b',
    restaurantId: 4,
    recommendations: [
      {
        id: 7,
        name: '玉子烧',
        price: 38,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'
      }
    ]
  },
  3: {
    id: 3,
    name: '松露意面',
    price: 168,
    monthlySales: 198,
    description: '使用进口意大利面，搭配黑松露片，配以帕尔马干酪。',
    images: [
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
      'https://images.unsplash.com/photo-1548234979-5e83c8190770',
      'https://images.unsplash.com/photo-1572441713132-c542fc4fe282'
    ],
    restaurantName: '意大利餐厅',
    restaurantLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    restaurantId: 3,
    recommendations: [
      {
        id: 8,
        name: '提拉米苏',
        price: 48,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9'
      }
    ]
  }
};

Page({
  data: {
    dish: null,
    quantity: 0
  },

  onLoad(options) {
    const { id } = options;
    // 从数据库获取菜品数据
    const dish = dishDatabase[id];
    
    if (!dish) {
      wx.showToast({
        title: '菜品不存在',
        icon: 'error',
        complete: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
      return;
    }

    this.setData({ dish });
    wx.setNavigationBarTitle({
      title: dish.name
    });
  },

  previewImage(e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({
      urls: this.data.dish.images,
      current: url
    });
  },

  increaseQuantity() {
    this.setData({
      quantity: this.data.quantity + 1
    });
  },

  decreaseQuantity() {
    if (this.data.quantity > 0) {
      this.setData({
        quantity: this.data.quantity - 1
      });
    }
  },

  addToCart() {
    if (this.data.quantity === 0) {
      wx.showToast({
        title: '请选择数量',
        icon: 'none'
      });
      return;
    }

    // 获取当前购物车数据
    let cartItems = wx.getStorageSync('cartItems') || [];
    const dish = this.data.dish;

    // 检查是否已存在相同商品
    const existingItemIndex = cartItems.findIndex(
      item => item.id === dish.id && item.restaurantId === dish.restaurantId
    );

    if (existingItemIndex > -1) {
      // 更新数量
      cartItems[existingItemIndex].quantity += this.data.quantity;
    } else {
      // 添加新商品
      cartItems.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.images[0],
        quantity: this.data.quantity,
        restaurantId: dish.restaurantId,
        restaurantName: dish.restaurantName,
        restaurantLogo: dish.restaurantLogo
      });
    }

    // 更新本地存储
    wx.setStorageSync('cartItems', cartItems);

    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });

    // 重置数量
    this.setData({
      quantity: 0
    });
  },

  goToRestaurant() {
    wx.navigateTo({
      url: `/pages/restaurant-detail/restaurant-detail?id=${this.data.dish.restaurantId}`
    });
  },

  goToDish(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish-detail/dish-detail?id=${id}`
    });
  }
}); 