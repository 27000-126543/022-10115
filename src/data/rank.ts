import type { RankItem, TeamRank, UserInfo } from '@/types';

export const currentUser: UserInfo = {
  id: 'u001',
  name: '李小美',
  avatar: 'https://picsum.photos/id/64/200/200',
  team: 'A班-微笑组',
  level: 5,
  exp: 680,
  streakDays: 8,
  totalScore: 820,
  badges: ['b001', 'b002', 'b003', 'b007']
};

export const personalRank: RankItem[] = [
  {
    id: 'u002',
    name: '王雅婷',
    avatar: 'https://picsum.photos/id/91/200/200',
    team: 'A班-微笑组',
    score: 1280,
    rank: 1,
    streakDays: 15
  },
  {
    id: 'u003',
    name: '陈思琪',
    avatar: 'https://picsum.photos/id/177/200/200',
    team: 'B班-星辰组',
    score: 1150,
    rank: 2,
    streakDays: 12
  },
  {
    id: 'u004',
    name: '张梦琳',
    avatar: 'https://picsum.photos/id/338/200/200',
    team: 'A班-微笑组',
    score: 980,
    rank: 3,
    streakDays: 10
  },
  {
    id: 'u001',
    name: '李小美',
    avatar: 'https://picsum.photos/id/64/200/200',
    team: 'A班-微笑组',
    score: 820,
    rank: 4,
    streakDays: 8
  },
  {
    id: 'u005',
    name: '刘佳怡',
    avatar: 'https://picsum.photos/id/1027/200/200',
    team: 'C班-暖阳组',
    score: 760,
    rank: 5,
    streakDays: 6
  },
  {
    id: 'u006',
    name: '赵敏',
    avatar: 'https://picsum.photos/id/237/200/200',
    team: 'B班-星辰组',
    score: 720,
    rank: 6,
    streakDays: 5
  },
  {
    id: 'u007',
    name: '孙晓雯',
    avatar: 'https://picsum.photos/id/659/200/200',
    team: 'C班-暖阳组',
    score: 680,
    rank: 7,
    streakDays: 7
  },
  {
    id: 'u008',
    name: '周雨彤',
    avatar: 'https://picsum.photos/id/718/200/200',
    team: 'A班-微笑组',
    score: 620,
    rank: 8,
    streakDays: 4
  },
  {
    id: 'u009',
    name: '吴丽娜',
    avatar: 'https://picsum.photos/id/783/200/200',
    team: 'B班-星辰组',
    score: 580,
    rank: 9,
    streakDays: 3
  },
  {
    id: 'u010',
    name: '郑秀妍',
    avatar: 'https://picsum.photos/id/1025/200/200',
    team: 'C班-暖阳组',
    score: 520,
    rank: 10,
    streakDays: 5
  }
];

export const teamRank: TeamRank[] = [
  {
    id: 't001',
    name: 'A班-微笑组',
    score: 4520,
    memberCount: 8,
    rank: 1,
    trend: 'up'
  },
  {
    id: 't002',
    name: 'B班-星辰组',
    score: 4180,
    memberCount: 7,
    rank: 2,
    trend: 'flat'
  },
  {
    id: 't003',
    name: 'C班-暖阳组',
    score: 3960,
    memberCount: 8,
    rank: 3,
    trend: 'down'
  }
];

export const weekStar = {
  ...personalRank[0],
  title: '本周学习之星',
  description: '累计完成38个任务，接待场景满分通关',
  weekScore: 680
};
