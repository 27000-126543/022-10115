import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import { todayKnowledge, badges } from '@/data/tasks';
import { getWeekday, getToday } from '@/utils';
import KnowledgeCard from '@/components/KnowledgeCard';
import TaskCard from '@/components/TaskCard';
import BadgeIcon from '@/components/BadgeIcon';

export default function TasksPage() {
  const { user, tasks, totalScore, completeTask, addScore } = useApp();
  const [checkedIn, setCheckedIn] = useState(false);
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  const completedCount = tasks.filter(t => t.completed).length;

  const handleCheckin = () => {
    if (checkedIn) return;
    setCheckedIn(true);
    addScore(10);
    Taro.showToast({
      title: '签到成功 +10积分',
      icon: 'success'
    });
  };

  const handleKnowledgeRead = () => {
    if (!tasks[0].completed) {
      completeTask(tasks[0].id, tasks[0].points);
      Taro.showToast({
        title: `知识卡学习完成 +${tasks[0].points}积分`,
        icon: 'success'
      });
    }
  };

  const handleTaskClick = (task: typeof tasks[0]) => {
    if (task.completed) return;
    if (task.type === 'reception') {
      Taro.navigateTo({ url: '/pages/reception/index' });
    } else if (task.type === 'complaint') {
      Taro.navigateTo({ url: '/pages/complaint/index' });
    } else {
      completeTask(task.id, task.points);
      Taro.showToast({
        title: `任务完成 +${task.points}积分`,
        icon: 'success'
      });
    }
  };

  const quickEntries = [
    { icon: '🎭', name: '接待剧本', path: '/pages/reception/index' },
    { icon: '💬', name: '投诉模拟', path: '/pages/complaint/index' },
    { icon: '🗺️', name: '闯关地图', path: '/pages/map/index' },
    { icon: '📊', name: '班组复盘', path: '/pages/review/index' }
  ];

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userRow}>
          <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
          <View className={styles.userInfo}>
            <Text className={styles.greeting}>{getWeekday()}好，欢迎回来 👋</Text>
            <Text className={styles.userName}>{user.name}</Text>
            <View className={styles.userMeta}>
              <View className={styles.metaTag}>🏥 {user.team}</View>
              <View className={styles.metaTag}>⭐ Lv.{user.level}</View>
              <View className={styles.metaTag}>🔥 {user.streakDays}天</View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.checkinCard}>
        <View className={styles.checkinRow}>
          <View className={styles.checkinInfo}>
            <Text className={styles.checkinTitle}>
              {checkedIn ? '今日已签到 ✓' : '立即签到领积分'}
            </Text>
            <Text className={styles.checkinSubtitle}>
              已连续打卡 <Text className={styles.streakNum}>{user.streakDays}</Text> 天，坚持就是胜利！
            </Text>
          </View>
          <View
            className={classnames(styles.checkinBtn, checkedIn && styles.checked)}
            onClick={handleCheckin}
          >
            {checkedIn ? '已签到' : '签到 +10'}
          </View>
        </View>
        <View className={styles.weekDays}>
          {weekDays.map((day, idx) => (
            <View key={day} className={styles.weekDay}>
              <Text className={styles.dayName}>周{day}</Text>
              <View className={classnames(
                styles.dayDot,
                idx < todayIndex && styles.checked,
                idx === todayIndex && styles.today
              )}>
                {idx < todayIndex ? '✓' : idx === todayIndex ? (checkedIn ? '✓' : '今') : ''}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📚 今日知识卡</Text>
          <Text className={styles.taskProgress}>{todayKnowledge.timeCost}分钟掌握</Text>
        </View>
        <KnowledgeCard data={todayKnowledge} onRead={handleKnowledgeRead} />
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📋 今日任务</Text>
          <Text className={styles.taskProgress}>
            进度 {completedCount}/{tasks.length} · 总积分 {totalScore}
          </Text>
        </View>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            data={task}
            onClick={() => handleTaskClick(task)}
          />
        ))}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>🏆 我的徽章</Text>
          <Text className={styles.taskProgress}>
            {badges.filter(b => b.obtained).length}/{badges.length}
          </Text>
        </View>
        <ScrollView scrollX className={styles.badgesScroll} showScrollbar={false}>
          <View className={styles.badgesRow}>
            {badges.map(badge => (
              <View key={badge.id} className={styles.badgeItem}>
                <BadgeIcon
                  icon={badge.icon}
                  name={badge.name}
                  obtained={badge.obtained}
                  size="medium"
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>⚡ 快速进入</Text>
        </View>
        <View className={styles.quickEntry}>
          {quickEntries.map(entry => (
            <View
              key={entry.name}
              className={styles.entryItem}
              onClick={() => Taro.navigateTo({ url: entry.path })}
            >
              <Text className={styles.entryIcon}>{entry.icon}</Text>
              <Text className={styles.entryName}>{entry.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.contentBottom} />
    </ScrollView>
  );
}
