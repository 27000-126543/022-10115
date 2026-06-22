import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import type { KnowledgeCard as KnowledgeCardType } from '@/types';

interface KnowledgeCardProps {
  data: KnowledgeCardType;
  onRead?: () => void;
}

export default function KnowledgeCard({ data, onRead }: KnowledgeCardProps) {
  return (
    <View className={styles.card} onClick={onRead}>
      <View className={styles.header}>
        <View className={styles.category}>{data.category}</View>
        <View className={styles.time}>⏱ {data.timeCost}分钟</View>
      </View>
      <Text className={styles.title}>{data.title}</Text>
      <Text className={styles.content}>{data.content}</Text>
      <View className={styles.keyPoints}>
        {data.keyPoints.map((point, idx) => (
          <View key={idx} className={styles.pointItem}>
            <Text className={styles.pointDot}>✦</Text>
            <Text className={styles.pointText}>{point}</Text>
          </View>
        ))}
      </View>
      <View className={styles.footer}>
        <Text className={styles.readBtn}>我已掌握 →</Text>
      </View>
    </View>
  );
}
