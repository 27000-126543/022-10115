import type { KnowledgeCard, DailyTask, Badge } from '@/types';

export const todayKnowledge: KnowledgeCard = {
  id: 'k001',
  title: '到院接待标准流程',
  category: '服务流程',
  content: '顾客到院后，前台接待需按照"一迎二核三引四告"的标准流程操作。一迎：主动起身微笑问候；二核：核对预约信息与身份；三引：引导至休息区并奉上茶水；四告：告知预计等待时间与注意事项。',
  keyPoints: [
    '顾客进门3米内需微笑问候',
    '必须核对姓名+手机号双要素',
    '等待超过10分钟需主动安抚',
    '首次到院顾客需主动介绍院内环境'
  ],
  timeCost: 3
};

export const dailyTasks: DailyTask[] = [
  {
    id: 't001',
    type: 'knowledge',
    title: '学习今日知识卡',
    description: '3分钟掌握到院接待标准流程',
    icon: '📚',
    points: 20,
    completed: false,
    timeCost: 3
  },
  {
    id: 't002',
    type: 'quiz',
    title: '预约规则小测验',
    description: '5道选择题检验改期与爽约处理',
    icon: '✍️',
    points: 30,
    completed: false,
    timeCost: 5
  },
  {
    id: 't003',
    type: 'reception',
    title: '完成1个接待场景',
    description: '演练VIP顾客到院接待全流程',
    icon: '🎭',
    points: 50,
    completed: false,
    timeCost: 8
  },
  {
    id: 't004',
    type: 'complaint',
    title: '投诉情景应对',
    description: '处理术后效果不满的顾客沟通',
    icon: '💬',
    points: 50,
    completed: false,
    timeCost: 6
  },
  {
    id: 't005',
    type: 'review',
    title: '复习昨日错题',
    description: '巩固3道高频错题知识点',
    icon: '🔄',
    points: 15,
    completed: false,
    timeCost: 4
  }
];

export const badges: Badge[] = [
  {
    id: 'b001',
    name: '初心萌新',
    description: '完成首次学习',
    icon: '🌱',
    obtained: true,
    obtainedDate: '2026-06-15',
    condition: '完成第一个任务'
  },
  {
    id: 'b002',
    name: '连续7日',
    description: '连续打卡7天',
    icon: '🔥',
    obtained: true,
    obtainedDate: '2026-06-21',
    condition: '连续学习7天'
  },
  {
    id: 'b003',
    name: '服务之星',
    description: '接待流程全对通关',
    icon: '⭐',
    obtained: true,
    obtainedDate: '2026-06-18',
    condition: '接待场景100%正确率'
  },
  {
    id: 'b004',
    name: '沟通达人',
    description: '投诉应对满分',
    icon: '💎',
    obtained: false,
    condition: '完成10个投诉场景'
  },
  {
    id: 'b005',
    name: '学霸',
    description: '累计积分破千',
    icon: '🏆',
    obtained: false,
    condition: '累计获得1000积分'
  },
  {
    id: 'b006',
    name: '连续30日',
    description: '月度全勤',
    icon: '👑',
    obtained: false,
    condition: '连续学习30天'
  },
  {
    id: 'b007',
    name: '隐私卫士',
    description: '隐私题全对',
    icon: '🛡️',
    obtained: true,
    obtainedDate: '2026-06-19',
    condition: '隐私保护题100%正确'
  },
  {
    id: 'b008',
    name: '活地图',
    description: '院内动线满分',
    icon: '🗺️',
    obtained: false,
    condition: '院内动线题全部答对'
  }
];

export const forbiddenWords = [
  '这个效果我也不确定',
  '你去找医生问',
  '别人做了都没事',
  '这是规定我也没办法',
  '便宜的就是这样',
  '你以前做得不好',
  '这个价格已经最低了',
  '手术肯定有风险的嘛'
];
