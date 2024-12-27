Page({
  data: {
    categories: [
      {
        id: 1,
        name: '中餐',
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa'
      },
      {
        id: 2,
        name: '快餐',
        image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330'
      },
      {
        id: 3,
        name: '咖啡厅',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'
      },
      {
        id: 4,
        name: '日料',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'
      },
      {
        id: 5,
        name: '火锅',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624'
      },
      {
        id: 6,
        name: '西餐',
        image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02'
      },
      {
        id: 7,
        name: '甜品',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814'
      },
      {
        id: 8,
        name: '小吃',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8'
      }
    ],
    restaurants: [
      {
        id: 1,
        name: '米其林星级餐厅',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
      },
      {
        id: 2,
        name: '日式料理',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b'
      },
      {
        id: 3,
        name: '意大利餐厅',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'
      }
    ],
    dishes: [
      {
        id: 1,
        name: '和牛牛排',
        image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02'
      },
      {
        id: 2,
        name: '三文鱼刺身',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'
      },
      {
        id: 3,
        name: '松露意面',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8'
      },
      {
        id: 4,
        name: '法式甜点',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814'
      }
    ]
  },

  onSearchInput(e) {
    const searchText = e.detail.value;
    // 这里可以实现搜索逻辑
    console.log('搜索文本：', searchText);
  },

  goToRestaurant(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      wx.showToast({
        title: '餐厅信息错误',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/restaurant-detail/restaurant-detail?id=${id}`,
      fail: (err) => {
        console.error('导航失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  goToDish(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish-detail/dish-detail?id=${id}`,
      fail: (err) => {
        console.error('导航失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  goToCategory(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/restaurant-list/restaurant-list?categoryId=${id}`,
      fail: (err) => {
        console.error('导航失败：', err);
        wx.showToast({
          title: '该功能正在开发中',
          icon: 'none'
        });
      }
    });
  }
}) 