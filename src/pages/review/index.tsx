import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import { weekFocusList, wrongQuestions, meetingSummary } from '@/data/review';
import { getPriorityLabel } from '@/utils';

export default function ReviewPage() {
  const categoryStats = [
    { name: '投诉应对', count: 8 },
    { name: '预约规则', count: 6 },
    { name: '服务规范', count: 5 },
    { name: '隐私保护', count: 3 }
  ];

  const totalWrong = wrongQuestions.length;

  return (
    <ScrollView scrollY>
      <View className={styles.statsCard}>
        <Text className={styles.statsTitle}>📊 本周错题统计</Text>
        <View style={{ marginBottom: '24rpx' }}>
          <Text style={{ fontSize: '48rpx', fontWeight: 700, color: '#E85D8D' }}>{totalWrong}</Text>
          <Text style={{ fontSize: '28rpx', color: '#6B5560', marginLeft: '12rpx' }}>道待复盘错题</Text>
        </View>
        <View className={styles.categoryStats}>
          {categoryStats.map(cat => (
            <View key={cat.name} className={styles.catItem}>
              <Text className={styles.catNum}>{cat.count}</Text>
              <Text className={styles.catName}>{cat.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📌 本周重点</Text>
          <Text className={styles.moreBtn}>共 {weekFocusList.length} 条</Text>
        </View>
        <View className={styles.focusList}>
          {weekFocusList.map(focus => {
            const priority = getPriorityLabel(focus.priority);
            return (
              <View
                key={focus.id}
                className={classnames(styles.focusCard, styles[focus.priority])}
              >
                <View className={styles.focusHeader}>
                  <Text className={styles.focusTitle}>{focus.title}</Text>
                  <View className={classnames(styles.priorityTag, styles[focus.priority])}>
                    {priority.text}
                  </View>
                </View>
                <Text className={styles.focusContent}>{focus.content}</Text>
                <Text className={styles.focusMeta}>
                  {focus.publisher} · {focus.publishTime}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>❌ 错题复盘清单</Text>
          <Text className={styles.moreBtn}>交班会讨论</Text>
        </View>
        <View className={styles.wrongList}>
          {wrongQuestions.map(wq => (
            <View key={wq.id} className={styles.wrongCard}>
              <View className={styles.wrongHeader}>
                <View className={styles.wrongCategory}>{wq.category}</View>
                <View className={styles.wrongCount}>错 {wq.wrongCount} 次</View>
              </View>
              <Text className={styles.wrongTitle}>{wq.title}</Text>
              <View className={styles.answerRow}>
                <View className={styles.answerItem}>
                  <View className={classnames(styles.answerLabel, styles.wrongLabel)}>员工选</View>
                  <Text className={styles.answerText}>{wq.userAnswer}</Text>
                </View>
                <View className={styles.answerItem}>
                  <View className={classnames(styles.answerLabel, styles.correctLabel)}>正确答案</View>
                  <Text className={styles.answerText}>{wq.correctAnswer}</Text>
                </View>
              </View>
              <Text className={styles.wrongTime}>最近错误：{wq.lastWrongTime}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📝 交班会议记录</Text>
        </View>
        <View className={styles.meetingList}>
          {meetingSummary.map((m, idx) => (
            <View key={idx} className={styles.meetingItem}>
              <View className={styles.meetingDot} />
              <Text className={styles.meetingDate}>{m.date}</Text>
              <Text className={styles.meetingTopic}>{m.topic}</Text>
              <View className={styles.meetingPoints}>
                {m.keyPoints.map((p, i) => (
                  <Text key={i} className={styles.pointItem}>{p}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.contentBottom} />
    </ScrollView>
  );
}
