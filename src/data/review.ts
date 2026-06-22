import type { WrongQuestion, WeekFocus } from '@/types';

export const weekFocusList: WeekFocus[] = [
  {
    id: 'wf001',
    title: '618大促期间预约规则重点',
    content: '618活动期间预约量激增，重点强调：1) 改期需提前72小时申请；2) 活动项目定金不退；3) 每日预约上限已调至12人/天，超出自动顺延。所有前台人员务必熟读并严格执行，避免产生预约纠纷。',
    publisher: '主管-王静',
    publishTime: '2026-06-20 09:00',
    priority: 'high'
  },
  {
    id: 'wf002',
    title: 'VIP客户接待标准升级通知',
    content: '自本周起，钻石卡及以上VIP客户到院需执行全新服务标准：1) 提前1小时确认茶点偏好；2) 指定咨询师全程陪同；3) 离院时赠送专属伴手礼。请各班组利用交班时间组织学习。',
    publisher: '主管-王静',
    publishTime: '2026-06-18 14:30',
    priority: 'medium'
  },
  {
    id: 'wf003',
    title: '新入职前台培训计划',
    content: '本周二、四下午14:00-16:00在二楼会议室开展新员工岗前培训，内容包括院内动线、系统操作、服务礼仪三轮。请各班组安排好值班人员，确保新员工准时参加。',
    publisher: '培训专员-李娜',
    publishTime: '2026-06-17 10:00',
    priority: 'low'
  }
];

export const wrongQuestions: WrongQuestion[] = [
  {
    id: 'wq001',
    title: '顾客抱怨术后效果不理想，正确的第一反应是？',
    category: '投诉应对',
    userAnswer: 'A. 告诉顾客这是正常现象，慢慢会好',
    correctAnswer: 'B. 先倾听并表达共情，记录具体诉求',
    wrongCount: 2,
    lastWrongTime: '2026-06-21'
  },
  {
    id: 'wq002',
    title: '术前多久内改期不收取违约金？',
    category: '预约规则',
    userAnswer: 'A. 提前24小时',
    correctAnswer: 'B. 提前48小时',
    wrongCount: 3,
    lastWrongTime: '2026-06-21'
  },
  {
    id: 'wq003',
    title: '顾客询问"这个手术会不会疼？"，以下哪种回答最恰当？',
    category: '服务规范',
    userAnswer: 'A. 一点都不疼，放心吧',
    correctAnswer: 'C. 术中会有麻醉，术后可能有轻微胀痛，我们会有止痛方案',
    wrongCount: 1,
    lastWrongTime: '2026-06-20'
  },
  {
    id: 'wq004',
    title: '可以在休息区公共场合大声讨论顾客的手术项目和既往病史。',
    category: '隐私保护',
    userAnswer: '正确',
    correctAnswer: '错误',
    wrongCount: 1,
    lastWrongTime: '2026-06-20'
  },
  {
    id: 'wq005',
    title: '顾客做完双眼皮手术后，拆线应该去哪个区域？',
    category: '院内动线',
    userAnswer: 'B. 二楼咨询室',
    correctAnswer: 'C. 三楼换药室',
    wrongCount: 2,
    lastWrongTime: '2026-06-19'
  }
];

export const meetingSummary = [
  {
    date: '2026-06-21',
    topic: '昨日预约纠纷案例复盘',
    keyPoints: [
      '改期违约金规则解释需更有温度，不能生硬搬条例',
      '新员工岗前需增加3个典型投诉情景模拟训练',
      '本周投诉率下降15%，继续保持'
    ]
  },
  {
    date: '2026-06-20',
    topic: '618大促服务保障部署',
    keyPoints: [
      '全员熟悉618特殊预约规则',
      '增加1名机动前台应对高峰时段',
      '每日晚班需完成当日数据统计上报'
    ]
  }
];
