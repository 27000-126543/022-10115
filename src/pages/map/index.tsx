import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import { levels, levelCategories } from '@/data/levels';
import { questions } from '@/data/questions';
import LevelNode from '@/components/LevelNode';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';

const categoryIdToName: Record<string, string> = {
  service: '服务流程',
  booking: '预约规则',
  complaint: '投诉应对',
  privacy: '隐私保护'
};

export default function MapPage() {
  const { user, addScore } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filteredLevels = useMemo(() => {
    if (activeCategory === 'all') return levels;
    const categoryName = categoryIdToName[activeCategory];
    if (!categoryName) return levels;
    return levels.filter(l => l.category === categoryName);
  }, [activeCategory]);

  const selectedLevelData = useMemo(() => {
    if (!selectedLevel) return null;
    return levels.find(l => l.id === selectedLevel) || null;
  }, [selectedLevel]);

  const levelQuestions = useMemo(() => {
    if (!selectedLevelData) return [];
    const matched = questions.filter(q => q.category === selectedLevelData.category);
    return matched.length > 0 ? matched : questions.slice(0, 3);
  }, [selectedLevelData]);

  const completedCount = levels.filter(l => l.completed).length;
  const totalReward = levels.filter(l => l.completed).reduce((s, l) => s + l.rewardPoints, 0);
  const nextLevelExp = user.level * 200;

  const handleLevelClick = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    if (!level?.unlocked) {
      Taro.showToast({ title: '请先完成前置关卡', icon: 'none' });
      return;
    }
    setSelectedLevel(levelId);
  };

  const handleQuestionSubmit = (_answer: string | string[], isCorrect: boolean) => {
    if (isCorrect) {
      Taro.showToast({ title: '答题成功 +10积分', icon: 'success' });
      addScore(10);
    } else {
      Taro.showToast({ title: '再想想哦', icon: 'none' });
    }
  };

  return (
    <ScrollView scrollY>
      <View className={styles.progressCard}>
        <Text className={styles.progressTitle}>🎮 我的闯关进度</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{completedCount}</Text>
            <Text className={styles.statLabel}>已通关</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{levels.length}</Text>
            <Text className={styles.statLabel}>总关卡</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{totalReward}</Text>
            <Text className={styles.statLabel}>获得积分</Text>
          </View>
        </View>
        <View className={styles.levelBar}>
          <View className={styles.levelText}>
            <Text>Lv.{user.level}</Text>
            <Text>{user.exp} / {nextLevelExp} EXP</Text>
          </View>
          <ProgressBar
            percent={(user.exp / nextLevelExp) * 100}
            height={16}
            color="#ffffff"
            bgColor="rgba(255,255,255,0.25)"
          />
        </View>
      </View>

      <View className={styles.categoryTabs}>
        <ScrollView scrollX className={styles.tabsScroll} showScrollbar={false}>
          <View className={styles.tabsRow}>
            {levelCategories.map(cat => (
              <View
                key={cat.id}
                className={classnames(styles.tabItem, activeCategory === cat.id && styles.active)}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Text>{cat.icon}</Text>
                <Text>{cat.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.mapContainer}>
        <View className={styles.levelGrid}>
          {filteredLevels.map((level, idx) => (
            <React.Fragment key={level.id}>
              <LevelNode
                data={level}
                onClick={() => handleLevelClick(level.id)}
              />
              {idx % 2 === 1 && idx < filteredLevels.length - 1 && (
                <View className={styles.pathLine}>↓ ↓</View>
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {selectedLevel && selectedLevelData && (
        <View style={{ padding: '0 32rpx' }}>
          <Text style={{ fontSize: '32rpx', fontWeight: 600, marginBottom: '24rpx', display: 'block' }}>
            📝 {selectedLevelData.name} · 分类：{selectedLevelData.category}
          </Text>
          {levelQuestions.map((q, i) => (
            <QuestionCard
              key={q.id}
              data={q}
              index={i + 1}
              onSubmit={handleQuestionSubmit}
            />
          ))}
        </View>
      )}

      <View className={styles.contentBottom} />
    </ScrollView>
  );
}
