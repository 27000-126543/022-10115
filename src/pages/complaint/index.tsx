import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { complaintScenes } from '@/data/questions';
import { useApp } from '@/store/AppContext';

const typeLabels: Record<string, { name: string; icon: string }> = {
  bad_review: { name: '差评沟通', icon: '😤' },
  reschedule: { name: '改期处理', icon: '📅' },
  no_show: { name: '爽约应对', icon: '❌' },
  privacy: { name: '隐私保护', icon: '🔒' }
};

export default function ComplaintPage() {
  const { addScore, completeTaskByType } = useApp();
  const [activeType, setActiveType] = useState<string>('all');
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [taskMarked, setTaskMarked] = useState(false);

  const filteredScenes = useMemo(() => {
    if (activeType === 'all') return complaintScenes;
    return complaintScenes.filter(s => s.type === activeType);
  }, [activeType]);

  const currentScene = filteredScenes[currentSceneIdx] || filteredScenes[0];
  const selectedOpt = selectedKey && currentScene
    ? currentScene.options.find(o => o.key === selectedKey)
    : null;

  const types = ['all', ...Object.keys(typeLabels)];

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    setCurrentSceneIdx(0);
    setSelectedKey(null);
    setShowFeedback(false);
  };

  const handleOptionClick = (key: string) => {
    if (showFeedback || !currentScene) return;
    setSelectedKey(key);
    setShowFeedback(true);
    const opt = currentScene.options.find(o => o.key === key);
    if (opt?.isCorrect) {
      setScore(prev => prev + 20);
      addScore(20);
      Taro.showToast({ title: '+20积分', icon: 'success' });
    }
    if (!completedIds.includes(currentScene.id)) {
      setCompletedIds(prev => [...prev, currentScene.id]);
    }
    if (!taskMarked) {
      completeTaskByType('complaint');
      setTaskMarked(true);
    }
  };

  const handleNext = () => {
    if (currentSceneIdx < filteredScenes.length - 1) {
      setCurrentSceneIdx(prev => prev + 1);
      setSelectedKey(null);
      setShowFeedback(false);
    }
  };

  const handleRestart = () => {
    setCurrentSceneIdx(0);
    setSelectedKey(null);
    setShowFeedback(false);
    setCompletedIds([]);
    setScore(0);
  };

  if (!currentScene) {
    return (
      <ScrollView scrollY className={styles.container}>
        <View className={styles.completedCard}>
          <Text className={styles.completedIcon}>🎉</Text>
          <Text className={styles.completedTitle}>本类场景已全部完成！</Text>
          <Text className={styles.completedDesc}>
            已练习 {completedIds.length} 个场景 · 获得 {score} 积分
          </Text>
          <View className={styles.restartBtn} onClick={handleRestart}>🔄 重新练习</View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView scrollY className={styles.container}>
      <ScrollView scrollX className={styles.typeTabs} showScrollbar={false}>
        {types.map(type => (
          <View
            key={type}
            className={classnames(styles.typeTab, activeType === type && styles.active)}
            onClick={() => handleTypeChange(type)}
          >
            {type === 'all' ? '📋 全部' : `${typeLabels[type]?.icon || ''} ${typeLabels[type]?.name || ''}`}
          </View>
        ))}
      </ScrollView>

      <View className={styles.sceneList}>
        <View className={classnames(styles.sceneCard, styles.active)}>
          <Text className={styles.sceneIcon}>
            {typeLabels[currentScene.type]?.icon || '💬'}
          </Text>
          <Text className={styles.sceneTitle}>{currentScene.title}</Text>
          <View className={styles.sceneType}>
            {typeLabels[currentScene.type]?.name || ''}
          </View>
          <Text className={styles.sceneBg}>📝 背景：{currentScene.background}</Text>
          <View className={styles.complaintContent}>
            <Text className={styles.complaintLabel}>🗣 顾客投诉：</Text>
            <Text className={styles.complaintText}>"{currentScene.customerComplaint}"</Text>
          </View>

          <View className={styles.optionList}>
            {currentScene.options.map(opt => (
              <View
                key={opt.key}
                className={classnames(
                  styles.optionItem,
                  showFeedback && opt.isCorrect && styles.correct,
                  showFeedback && selectedKey === opt.key && !opt.isCorrect && styles.wrong,
                  selectedKey === opt.key && !showFeedback && styles.selected
                )}
                onClick={() => handleOptionClick(opt.key)}
              >
                <Text>{opt.key}. {opt.text}</Text>
              </View>
            ))}
          </View>

          {showFeedback && selectedOpt && (
            <View className={styles.feedbackBox}>
              <Text className={styles.feedbackTitle}>
                {selectedOpt.isCorrect ? '✅ 回答正确' : '❌ 还需改进'}
              </Text>
              <Text className={styles.feedbackText}>{selectedOpt.feedback}</Text>
              {selectedOpt.nextTip && (
                <Text className={styles.feedbackTip}>💡 {selectedOpt.nextTip}</Text>
              )}
            </View>
          )}

          {showFeedback && (
            <View
              className={classnames(styles.nextBtn, currentSceneIdx >= filteredScenes.length - 1 && styles.disabled)}
              onClick={handleNext}
            >
              {currentSceneIdx < filteredScenes.length - 1 ? '下一个场景 →' : '已完成全部场景'}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
