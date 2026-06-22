import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface BadgeIconProps {
  icon: string;
  name?: string;
  obtained: boolean;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
}

export default function BadgeIcon({
  icon,
  name,
  obtained,
  size = 'medium',
  showName = true
}: BadgeIconProps) {
  return (
    <View className={classnames(
      styles.wrapper,
      styles[size],
      !obtained && styles.locked
    )}>
      <View className={styles.iconBox}>
        <Text className={styles.icon}>{icon}</Text>
      </View>
      {showName && name && (
        <Text className={styles.name}>{name}</Text>
      )}
    </View>
  );
}
