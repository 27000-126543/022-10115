import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import { personalRank, teamRank, weekStar } from '@/data/rank';
import { currentUser } from '@/data/rank';
import { getTrendIcon } from '@/utils';
import RankItem from '@/components/RankItem';

export default function RankPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'team'>('personal');

  const myRankData = personalRank.find(r => r.id === currentUser.id);

  return (
    <ScrollView scrollY>
      <View className={styles.starCard}>
        <View className={styles.starHeader}>
          <Text className={styles.crown}>👑</Text>
          <Text className={styles.starLabel}>{weekStar.title}</Text>
        </View>
        <View className={styles.starBody}>
          <Image className={styles.starAvatar} src={weekStar.avatar} mode="aspectFill" />
          <View className={styles.starInfo}>
            <Text className={styles.starName}>{weekStar.name}</Text>
            <Text className={styles.starTeam}>{weekStar.team}</Text>
            <View className={styles.starScore}>
              <View className={styles.scoreBox}>本周 +{weekStar.weekScore}分</View>
              <View className={styles.scoreBox}>🔥 {weekStar.streakDays}天连续</View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.tabsRow}>
        <View
          className={classnames(styles.tabBtn, activeTab === 'personal' && styles.active)}
          onClick={() => setActiveTab('personal')}
        >
          🏆 个人榜
        </View>
        <View
          className={classnames(styles.tabBtn, activeTab === 'team' && styles.active)}
          onClick={() => setActiveTab('team')}
        >
          🎯 班组PK
        </View>
      </View>

      {activeTab === 'personal' && (
        <View className={styles.rankSection}>
          <Text className={styles.sectionTitle}>📊 个人积分排行榜</Text>
          {personalRank.map(item => (
            <RankItem
              key={item.id}
              data={item}
              isMe={item.id === currentUser.id}
            />
          ))}
        </View>
      )}

      {activeTab === 'team' && (
        <View className={styles.rankSection}>
          <Text className={styles.sectionTitle}>⚔️ 班组积分 PK</Text>
          <View className={styles.teamList}>
            {teamRank.map((team, idx) => (
              <View
                key={team.id}
                className={classnames(
                  styles.teamCard,
                  idx === 0 && styles.top1,
                  idx === 1 && styles.top2,
                  idx === 2 && styles.top3
                )}
              >
                <View className={styles.teamRank}>
                  {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : team.rank}
                </View>
                <View className={styles.teamInfo}>
                  <Text className={styles.teamName}>{team.name}</Text>
                  <Text className={styles.teamMembers}>{team.memberCount}名成员</Text>
                </View>
                <View className={styles.teamRight}>
                  <Text className={styles.teamScore}>{team.score}</Text>
                  <View className={styles.teamTrend}>
                    {getTrendIcon(team.trend)} 积分
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {myRankData && (
        <View className={styles.myRankCard}>
          <Text className={styles.myRankTitle}>📍 我的当前排名</Text>
          <RankItem data={myRankData} isMe={true} />
        </View>
      )}

      <View className={styles.contentBottom} />
    </ScrollView>
  );
}
