// 在 Page 外部定义餐厅数据库
const restaurantDatabase = {
  1: {
    id: 1,
    name: '米其林星级餐厅',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    rating: 4.9,
    ratingCount: 2876,
    address: '广州市天河区珠江新城华夏路10号',
    businessHours: '11:30-14:30, 17:30-22:00',
    phone: '020-87654321',
    menuCategories: [
      {
        name: '特色推荐',
        dishes: [
          {
            id: 1,
            name: '和牛牛排',
            description: 'A5级和牛，搭配时令蔬菜',
            price: 688,
            monthlySales: 156,
            image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02'
          },
          // ... 其他菜品
        ]
      },
      // ... 其他分类
    ],
    reviews: [
      {
        id: 1,
        userName: '美食家王先生',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        rating: 5,
        date: '2024-03-15',
        content: '无可挑剔的用餐体验，和牛的品质非常好，服务也很专业。',
        images: [
          'https://images.unsplash.com/photo-1546039907-7fa05f864c02',
          'https://images.unsplash.com/photo-1544025162-d76694265947'
        ]
      }
    ]
  },
  2: {
    id: 2,
    name: '川香阁',
    coverImage: 'https://images.unsplash.com/photo-1555126634-323283e090fa',
    rating: 4.8,
    ratingCount: 2341,
    address: '广州市天河区天河路123号',
    businessHours: '10:00-22:00',
    phone: '020-12345678',
    menuCategories: [
      {
        name: '招牌菜',
        dishes: [
          {
            id: 1,
            name: '麻婆豆腐',
            description: '使用特制豆瓣酱，口感麻辣鲜香',
            price: 38,
            monthlySales: 328,
            image: 'https://images.unsplash.com/photo-1582460544558-c0f5f05ca692'
          }
          // ... 其他菜品
        ]
      }
      // ... 其他分类
    ],
    reviews: [
      // ... 评价数据
    ]
  }
  // ... 其他餐厅数据
};

Page({
  data: {
    currentCategory: 0,
    totalPrice: 0,
    totalCount: 0,
    restaurant: null,
    currentDishes: []
  },

  onLoad(options) {
    // 检查是否有传入id参数
    if (!options || !options.id) {
      wx.showToast({
        title: '参数错误',
        icon: 'error',
        complete: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
      return;
    }

    const { id } = options;
    // 根据id获取餐厅数据
    const restaurant = restaurantDatabase[id];
    
    if (!restaurant) {
      wx.showToast({
        title: '餐厅不存在',
        icon: 'error',
        complete: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
      return;
    }

    // 初始化菜品数量
    const menuCategories = restaurant.menuCategories.map(category => ({
      ...category,
      dishes: category.dishes.map(dish => ({
        ...dish,
        count: 0
      }))
    }));

    restaurant.menuCategories = menuCategories;

    this.setData({
      restaurant,
      currentDishes: menuCategories[0].dishes
    });

    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: restaurant.name
    });
  },

  toggleFavorite() {
    const isFavorite = !this.data.restaurant.isFavorite;
    this.setData({
      'restaurant.isFavorite': isFavorite
    });
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'success'
    });
  },

  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.restaurant.phone
    });
  },

  addDishToCart(e) {
    const dishId = e.currentTarget.dataset.dishId;
    this.updateDishCount(dishId, 1);
  },

  minusFromCart(e) {
    const dishId = e.currentTarget.dataset.dishId;
    this.updateDishCount(dishId, -1);
  },

  updateDishCount(dishId, delta) {
    const { menuCategories } = this.data.restaurant;
    let totalPrice = this.data.totalPrice;
    let totalCount = this.data.totalCount;

    // 更新菜品数量和总价
    const newMenuCategories = menuCategories.map(category => ({
      ...category,
      dishes: category.dishes.map(dish => {
        if (dish.id === dishId) {
          const newCount = (dish.count || 0) + delta;
          if (newCount >= 0) {
            totalPrice += dish.price * delta;
            totalCount += delta;
            return { ...dish, count: newCount };
          }
        }
        return dish;
      })
    }));

    // 更新当前显示的菜品列表
    const currentDishes = newMenuCategories[this.data.currentCategory].dishes;

    this.setData({
      'restaurant.menuCategories': newMenuCategories,
      currentDishes,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      totalCount
    });
  },

  checkout() {
    // 这里实现结算逻辑
    wx.showToast({
      title: '正在开发中...',
      icon: 'none'
    });
  },

  switchCategory(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentCategory: index,
      currentDishes: this.data.restaurant.menuCategories[index].dishes
    });
  },

  previewImage(e) {
    const { urls, current } = e.currentTarget.dataset;
    wx.previewImage({
      urls,
      current
    });
  },

  addToCart() {
    if (this.data.totalCount === 0) {
      wx.showToast({
        title: '请选择菜品',
        icon: 'none'
      });
      return;
    }

    // 获取当前购物车数据
    let cartItems = wx.getStorageSync('cartItems') || [];
    const restaurant = this.data.restaurant;

    // 获取所有已选菜品
    const selectedDishes = [];
    restaurant.menuCategories.forEach(category => {
      category.dishes.forEach(dish => {
        if (dish.count > 0) {
          selectedDishes.push({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            image: dish.image,
            quantity: dish.count,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            restaurantLogo: restaurant.coverImage
          });
        }
      });
    });

    // 更新购物车数据
    selectedDishes.forEach(newDish => {
      const existingItemIndex = cartItems.findIndex(
        item => item.id === newDish.id && item.restaurantId === newDish.restaurantId
      );

      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += newDish.quantity;
      } else {
        cartItems.push(newDish);
      }
    });

    // 更新本地存储
    wx.setStorageSync('cartItems', cartItems);

    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });

    // 重置所有菜品数量
    const newMenuCategories = this.data.restaurant.menuCategories.map(category => ({
      ...category,
      dishes: category.dishes.map(dish => ({
        ...dish,
        count: 0
      }))
    }));

    this.setData({
      'restaurant.menuCategories': newMenuCategories,
      currentDishes: newMenuCategories[this.data.currentCategory].dishes,
      totalPrice: 0,
      totalCount: 0
    });
  },

  goToCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },

  checkout() {
    // 先将菜品加入购物车，然后跳转到购物车页面
    this.addToCart();
    this.goToCart();
  }
}); 