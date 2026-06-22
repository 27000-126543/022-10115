export default defineAppConfig({
  pages: [
    'pages/tasks/index',
    'pages/map/index',
    'pages/practice/index',
    'pages/rank/index',
    'pages/review/index',
    'pages/reception/index',
    'pages/complaint/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#E85D8D',
    navigationBarTitleText: '医美闯关学院',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF5F8'
  },
  tabBar: {
    color: '#A38F99',
    selectedColor: '#E85D8D',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/tasks/index',
        text: '今日任务'
      },
      {
        pagePath: 'pages/map/index',
        text: '闯关地图'
      },
      {
        pagePath: 'pages/practice/index',
        text: '实战演练'
      },
      {
        pagePath: 'pages/rank/index',
        text: '排行榜'
      },
      {
        pagePath: 'pages/review/index',
        text: '班组复盘'
      }
    ]
  }
})
