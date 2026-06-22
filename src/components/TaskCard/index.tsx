import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { DailyTask } from '@/types';

interface TaskCardProps {
  data: DailyTask;
  onClick?: () => void;
}

export default function TaskCard({ data, onClick }: TaskCardProps) {
  return (
    <View
      className={classnames(
        styles.card,
        data.completed && styles.completed
      )}
      onClick={!data.completed ? onClick : undefined}
    >
      <View className={styles.iconBox}>
        <Text className={styles.icon}>{data.icon}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.titleRow}>
          <Text className={styles.title}>{data.title}</Text>
          {data.completed && (
            <View className={styles.doneTag}>✓ 已完成</View>
          )}
        </View>
        <Text className={styles.desc}>{data.description}</Text>
        <View className={styles.meta}>
          <Text className={styles.time}>⏱ {data.timeCost}分钟</Text>
          <Text className={styles.points}>+{data.points}积分</Text>
        </View>
      </View>
      {!data.completed && (
        <View className={styles.arrow}>›</View>
      )}
    </View>
  );
}
