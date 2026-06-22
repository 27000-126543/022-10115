import type { Level } from '@/types';

export const levels: Level[] = [
  {
    id: 'l001',
    name: '接待入门',
    category: '服务流程',
    icon: '🚪',
    unlocked: true,
    completed: true,
    progress: 100,
    totalQuestions: 5,
    rewardPoints: 50,
    position: { row: 0, col: 1 }
  },
  {
    id: 'l002',
    name: '预约小能手',
    category: '预约规则',
    icon: '📅',
    unlocked: true,
    completed: true,
    progress: 100,
    totalQuestions: 6,
    rewardPoints: 60,
    position: { row: 1, col: 0 }
  },
  {
    id: 'l003',
    name: '隐私守护',
    category: '隐私保护',
    icon: '🔒',
    unlocked: true,
    completed: false,
    progress: 60,
    totalQuestions: 5,
    rewardPoints: 80,
    position: { row: 1, col: 2 }
  },
  {
    id: 'l004',
    name: '投诉初体验',
    category: '投诉应对',
    icon: '💬',
    unlocked: true,
    completed: false,
    progress: 20,
    totalQuestions: 8,
    rewardPoints: 100,
    position: { row: 2, col: 1 }
  },
  {
    id: 'l005',
    name: '回访时间达人',
    category: '术后回访',
    icon: '⏰',
    unlocked: true,
    completed: false,
    progress: 0,
    totalQuestions: 6,
    rewardPoints: 80,
    position: { row: 3, col: 0 }
  },
  {
    id: 'l006',
    name: '院内活地图',
    category: '院内动线',
    icon: '🗺️',
    unlocked: false,
    completed: false,
    progress: 0,
    totalQuestions: 5,
    rewardPoints: 60,
    position: { row: 3, col: 2 }
  },
  {
    id: 'l007',
    name: '服务禁语大师',
    category: '服务规范',
    icon: '🚫',
    unlocked: false,
    completed: false,
    progress: 0,
    totalQuestions: 8,
    rewardPoints: 100,
    position: { row: 4, col: 1 }
  },
  {
    id: 'l008',
    name: '沟通高手',
    category: '投诉应对',
    icon: '🎯',
    unlocked: false,
    completed: false,
    progress: 0,
    totalQuestions: 10,
    rewardPoints: 150,
    position: { row: 5, col: 0 }
  },
  {
    id: 'l009',
    name: '金牌前台',
    category: '综合考核',
    icon: '👑',
    unlocked: false,
    completed: false,
    progress: 0,
    totalQuestions: 15,
    rewardPoints: 300,
    position: { row: 5, col: 2 }
  }
];

export const levelCategories = [
  { id: 'all', name: '全部', icon: '📋' },
  { id: 'service', name: '服务流程', icon: '💁' },
  { id: 'booking', name: '预约规则', icon: '📅' },
  { id: 'complaint', name: '投诉应对', icon: '💬' },
  { id: 'privacy', name: '隐私保护', icon: '🔒' },
  { id: 'postop', name: '术后回访', icon: '⏰' }
];
