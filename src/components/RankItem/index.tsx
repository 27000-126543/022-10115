import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { RankItem as RankItemType } from '@/types';
import { getRankColor } from '@/utils';

interface RankItemProps {
  data: RankItemType;
  isMe?: boolean;
}

export default function RankItem({ data, isMe = false }: RankItemProps) {
  return (
    <View className={classnames(styles.item, isMe && styles.isMe)}>
      <View className={classnames(styles.rank, data.rank <= 3 && styles.topRank)} style={{ color: getRankColor(data.rank) }}>
        {data.rank <= 3 ? ['🥇', '🥈', '🥉'][data.rank - 1] : data.rank}
      </View>
      <Image
        className={styles.avatar}
        src={data.avatar}
        mode="aspectFill"
      />
      <View className={styles.info}>
        <View className={styles.nameRow}>
          <Text className={styles.name}>{data.name}</Text>
          {isMe && <View className={styles.meTag}>我</View>}
        </View>
        <Text className={styles.team}>{data.team}</Text>
      </View>
      <View className={styles.right}>
        <View className={styles.score}>{data.score}</View>
        <View className={styles.streak}>🔥 {data.streakDays}天</View>
      </View>
    </View>
  );
}
