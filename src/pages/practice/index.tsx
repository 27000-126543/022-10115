import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { forbiddenWords } from '@/data/tasks';

export default function PracticePage() {
  const weekStats = {
    sessions: 12,
    accuracy: '86%',
    scenes: 5
  };

  const scenes = [
    {
      type: 'reception',
      icon: '🎭',
      name: '接待剧本',
      desc: '模拟VIP顾客到院、首次到院、等待超时等真实场景，每一步选择都有即时反馈。',
      tags: ['到院问候', '身份核对', '引导就座', '送别礼仪'],
      path: '/pages/reception/index'
    },
    {
      type: 'complaint',
      icon: '💬',
      name: '投诉模拟',
      desc: '练习术后效果不满、预约改期、信息泄露、爽约处理等高难度沟通情景。',
      tags: ['差评沟通', '改期处理', '隐私保护', '爽约应对'],
      path: '/pages/complaint/index'
    }
  ];

  return (
    <ScrollView scrollY>
      <View className={styles.statsCard}>
        <Text className={styles.statsTitle}>📊 本周演练统计</Text>
        <View className={styles.statsRow}>
          <View className={styles.statCol}>
            <Text className={styles.statBig}>{weekStats.sessions}</Text>
            <Text className={styles.statDesc}>演练场次</Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.statCol}>
            <Text className={styles.statBig}>{weekStats.accuracy}</Text>
            <Text className={styles.statDesc}>正确率</Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.statCol}>
            <Text className={styles.statBig}>{weekStats.scenes}</Text>
            <Text className={styles.statDesc}>通关场景</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>🎯 核心场景演练</Text>
        <View className={styles.sceneCards}>
          {scenes.map(scene => (
            <View
              key={scene.type}
              className={classnames(styles.sceneCard, styles[scene.type])}
              onClick={() => Taro.navigateTo({ url: scene.path })}
            >
              <Text className={styles.sceneIcon}>{scene.icon}</Text>
              <Text className={styles.sceneName}>{scene.name}</Text>
              <Text className={styles.sceneDesc}>{scene.desc}</Text>
              <View className={styles.sceneTags}>
                {scene.tags.map(tag => (
                  <View key={tag} className={styles.sceneTag}>{tag}</View>
                ))}
              </View>
              <View className={styles.sceneBtn}>立即进入演练 →</View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.forbiddenSection}>
        <Text className={styles.sectionTitle}>🚫 服务禁语提醒</Text>
        <View className={styles.forbiddenCard}>
          <View className={styles.forbiddenTitle}>
            <Text>⚠️</Text>
            <Text>以下8句话严禁在顾客面前说</Text>
          </View>
          <View className={styles.forbiddenList}>
            {forbiddenWords.map((word, idx) => (
              <View key={idx} className={styles.forbiddenItem}>
                <Text className={styles.forbiddenCross}>✗</Text>
                <Text className={styles.forbiddenText}>"{word}"</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.contentBottom} />
    </ScrollView>
  );
}
