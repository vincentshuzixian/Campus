import restaurants from '../../data/restaurants.js';

Page({
  data: {
    categoryId: null,
    currentFilter: '',
    showCuisineFilter: false,
    showRatingFilter: false,
    showSortFilter: false,
    selectedCuisine: '',
    selectedRating: '',
    selectedSort: '',
    loading: false,
    noMore: false,
    page: 1,
    
    // 筛选选项
    cuisineOptions: ['全部', '川菜', '粤菜', '江浙菜', '日本料理', '北方菜'],
    ratingOptions: [
      { label: '全部', value: '' },
      { label: '4.5分以上', value: '4.5' },
      { label: '4分以上', value: '4.0' },
      { label: '3分以上', value: '3.0' }
    ],
    sortOptions: [
      { label: '综合排序', value: 'default' },
      { label: '评分最高', value: 'rating' },
      { label: '评价最多', value: 'count' }
    ],

    // 餐厅列表
    restaurants: []
  },

  onLoad(options) {
    const { categoryId } = options;
    this.setData({ categoryId });
    
    // 获取并过滤餐厅列表
    this.filterRestaurants();
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: this.getCategoryName(categoryId)
    });
  },

  getCategoryName(id) {
    const categories = {
      1: '中餐',
      2: '快餐',
      3: '咖啡厅',
      4: '日料',
      5: '火锅',
      6: '西餐',
      7: '甜品',
      8: '小吃'
    };
    return categories[id] || '餐厅列表';
  },

  filterRestaurants() {
    let filteredRestaurants = Object.values(restaurants);

    // 根据分类ID筛选
    if (this.data.categoryId) {
      // 根据分类ID匹配对应的菜系
      const categoryToCuisine = {
        1: ['川菜', '粤菜', '江浙菜', '北方菜'], // 中餐
        4: ['日本料理'], // 日料
        // 可以继续添加其他分类对应的菜系
      };

      const cuisines = categoryToCuisine[this.data.categoryId];
      if (cuisines) {
        filteredRestaurants = filteredRestaurants.filter(
          restaurant => cuisines.includes(restaurant.cuisine)
        );
      }
    }

    // 按菜系筛选
    if (this.data.selectedCuisine && this.data.selectedCuisine !== '全部') {
      filteredRestaurants = filteredRestaurants.filter(
        restaurant => restaurant.cuisine === this.data.selectedCuisine
      );
    }

    // 按评分筛选
    if (this.data.selectedRating) {
      filteredRestaurants = filteredRestaurants.filter(
        restaurant => restaurant.rating >= parseFloat(this.data.selectedRating)
      );
    }

    // 排序
    switch (this.data.selectedSort) {
      case 'rating':
        filteredRestaurants.sort((a, b) => b.rating - a.rating);
        break;
      case 'count':
        filteredRestaurants.sort((a, b) => b.ratingCount - a.ratingCount);
        break;
      default:
        // 综合排序：按评分和评价数量综合计算
        filteredRestaurants.sort((a, b) => {
          const scoreA = a.rating * 0.6 + (a.ratingCount / 1000) * 0.4;
          const scoreB = b.rating * 0.6 + (b.ratingCount / 1000) * 0.4;
          return scoreB - scoreA;
        });
    }

    this.setData({
      restaurants: filteredRestaurants,
      noMore: true
    });
  },

  showFilter(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentFilter: type,
      showCuisineFilter: type === 'cuisine' ? !this.data.showCuisineFilter : false,
      showRatingFilter: type === 'rating' ? !this.data.showRatingFilter : false,
      showSortFilter: type === 'sort' ? !this.data.showSortFilter : false
    });
  },

  selectCuisine(e) {
    const cuisine = e.currentTarget.dataset.cuisine;
    this.setData({
      selectedCuisine: cuisine,
      showCuisineFilter: false
    });
    this.filterRestaurants();
  },

  selectRating(e) {
    const rating = e.currentTarget.dataset.rating;
    this.setData({
      selectedRating: rating,
      showRatingFilter: false
    });
    this.filterRestaurants();
  },

  selectSort(e) {
    const sort = e.currentTarget.dataset.sort;
    this.setData({
      selectedSort: sort,
      showSortFilter: false
    });
    this.filterRestaurants();
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/restaurant-detail/restaurant-detail?id=${id}`
    });
  }
}); 