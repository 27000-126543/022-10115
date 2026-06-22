import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import ProgressBar from '@/components/ProgressBar';
import type { Level } from '@/types';

interface LevelNodeProps {
  data: Level;
  onClick?: () => void;
}

export default function LevelNode({ data, onClick }: LevelNodeProps) {
  return (
    <View
      className={classnames(
        styles.node,
        data.completed && styles.completed,
        !data.unlocked && styles.locked
      )}
      onClick={data.unlocked ? onClick : undefined}
    >
      <View className={styles.iconBox}>
        <Text className={styles.icon}>{data.icon}</Text>
        {data.completed && (
          <View className={styles.checkBadge}>✓</View>
        )}
        {!data.unlocked && (
          <View className={styles.lockOverlay}>
            <Text className={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>
      <Text className={styles.name}>{data.name}</Text>
      <Text className={styles.category}>{data.category}</Text>
      {data.unlocked && !data.completed && (
        <View className={styles.progressWrap}>
          <ProgressBar percent={data.progress} height={8} />
          <Text className={styles.reward}>奖励 +{data.rewardPoints}</Text>
        </View>
      )}
      {data.completed && (
        <View className={styles.fullScore}>
          <Text>满分通关 🏆</Text>
        </View>
      )}
    </View>
  );
}
