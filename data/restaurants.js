const restaurants = {
  1: {
    id: 1,
    name: '米其林星级餐厅',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    rating: 4.9,
    ratingCount: 2876,
    cuisine: '粤菜',
    priceLevel: '¥¥¥¥',
    address: '广州市天河区珠江新城华夏路10号',
    businessHours: '11:30-14:30, 17:30-22:00',
    phone: '020-87654321',
    menuCategories: [
      {
        name: '特色推荐',
        dishes: [
          {
            id: 101,
            name: '黑松露叉烧',
            description: '选用西班牙黑毛猪肉，搭配进口黑松露',
            price: 288,
            monthlySales: 156,
            image: 'https://images.unsplash.com/photo-1582460544558-c0f5f05ca692'
          },
          {
            id: 102,
            name: '鲍鱼焖饭',
            description: '南非活鲍鱼，配以秘制酱料',
            price: 366,
            monthlySales: 89,
            image: 'https://images.unsplash.com/photo-1548338645-3e2e2b74e129'
          }
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
    cuisine: '川菜',
    priceLevel: '¥¥',
    address: '广州市天河区天河路123号',
    businessHours: '10:00-22:00',
    phone: '020-12345678',
    menuCategories: [
      {
        name: '招牌菜',
        dishes: [
          {
            id: 201,
            name: '麻婆豆腐',
            description: '使用特制豆瓣酱，口感麻辣鲜香',
            price: 38,
            monthlySales: 328,
            image: 'https://images.unsplash.com/photo-1582460544558-c0f5f05ca692'
          },
          {
            id: 202,
            name: '水煮鱼',
            description: '新鲜草鱼，配以特制汤底',
            price: 88,
            monthlySales: 212,
            image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb'
          }
        ]
      }
    ]
  },
  3: {
    id: 3,
    name: '江南小馆',
    coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
    rating: 4.7,
    ratingCount: 1876,
    cuisine: '江浙菜',
    priceLevel: '¥¥¥',
    address: '广州市越秀区北京路45号',
    businessHours: '11:00-21:30',
    phone: '020-98765432',
    menuCategories: [
      {
        name: '特色菜品',
        dishes: [
          {
            id: 301,
            name: '东坡肉',
            description: '选用五花肉，红烧入味',
            price: 88,
            monthlySales: 198,
            image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c'
          }
        ]
      }
    ]
  },
  4: {
    id: 4,
    name: '寿司之神',
    coverImage: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b',
    rating: 4.9,
    ratingCount: 1523,
    cuisine: '日本料理',
    priceLevel: '¥¥¥¥',
    address: '广州市天河区体育西路88号',
    businessHours: '11:30-14:00, 17:30-22:00',
    phone: '020-34567890',
    menuCategories: [
      {
        name: '生鱼片',
        dishes: [
          {
            id: 401,
            name: '特上刺身拼盘',
            description: '当日空运新鲜海鲜',
            price: 488,
            monthlySales: 67,
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'
          }
        ]
      }
    ]
  },
  5: {
    id: 5,
    name: '老北京涮羊肉',
    coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624',
    rating: 4.6,
    ratingCount: 2156,
    cuisine: '北方菜',
    priceLevel: '¥¥¥',
    address: '广州市海珠区江南大道123号',
    businessHours: '11:00-22:00',
    phone: '020-23456789',
    menuCategories: [
      {
        name: '涮品',
        dishes: [
          {
            id: 501,
            name: '内蒙古羔羊肉',
            description: '精选内蒙古羔羊后腿肉',
            price: 198,
            monthlySales: 234,
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624'
          }
        ]
      }
    ]
  }
};

export default restaurants; 