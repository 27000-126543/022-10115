import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface ProgressBarProps {
  percent: number;
  height?: number;
  color?: string;
  showLabel?: boolean;
  bgColor?: string;
}

export default function ProgressBar({
  percent,
  height = 12,
  color,
  showLabel = false,
  bgColor
}: ProgressBarProps) {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <View className={styles.wrapper}>
      <View
        className={styles.track}
        style={{
          height: `${height}rpx`,
          backgroundColor: bgColor || undefined
        }}
      >
        <View
          className={styles.fill}
          style={{
            width: `${safePercent}%`,
            backgroundColor: color || undefined,
            height: `${height}rpx`
          }}
        />
      </View>
      {showLabel && (
        <Text className={styles.label}>{safePercent}%</Text>
      )}
    </View>
  );
}
