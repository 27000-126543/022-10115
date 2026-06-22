import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { receptionScenes } from '@/data/questions';
import { useApp } from '@/store/AppContext';

export default function ReceptionPage() {
  const { addScore, completeTaskByType } = useApp();
  const [currentScene] = useState(receptionScenes[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [stepScores, setStepScores] = useState<number[]>([]);
  const [taskMarked, setTaskMarked] = useState(false);

  const step = currentScene.steps[currentStep];
  const progress = ((currentStep + (showFeedback ? 1 : 0)) / currentScene.steps.length) * 100;

  const handleOptionClick = (key: string) => {
    if (showFeedback) return;
    setSelectedKey(key);
    const opt = step.options.find(o => o.key === key);
    if (opt) {
      setTotalScore(prev => prev + opt.score);
      setStepScores(prev => [...prev, opt.score]);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentStep < currentScene.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedKey(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
      addScore(totalScore);
      if (!taskMarked) {
        completeTaskByType('reception');
        setTaskMarked(true);
      }
      Taro.showToast({
        title: `完成！获得${totalScore}积分`,
        icon: 'success'
      });
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedKey(null);
    setShowFeedback(false);
    setTotalScore(0);
    setFinished(false);
    setStepScores([]);
  };

  const getResultLevel = (score: number) => {
    const max = currentScene.steps.length * 20;
    const percent = score / max;
    if (percent >= 0.9) return { icon: '🏆', title: '金牌前台', tips: '完美表现！服务流程完全达标，继续保持！' };
    if (percent >= 0.7) return { icon: '⭐', title: '服务达标', tips: '整体表现不错，部分细节可以再优化哦~' };
    if (percent >= 0.5) return { icon: '💪', title: '继续努力', tips: '服务流程还需多加练习，建议再复习一遍知识卡。' };
    return { icon: '📚', title: '需要加强', tips: '建议重新学习接待流程规范，然后再试一次！' };
  };

  const result = getResultLevel(totalScore);
  const selectedOpt = selectedKey ? step.options.find(o => o.key === selectedKey) : null;

  if (finished) {
    return (
      <ScrollView scrollY className={styles.container}>
        <View className={styles.resultCard}>
          <Text className={styles.resultIcon}>{result.icon}</Text>
          <Text className={styles.resultTitle}>{result.title}</Text>
          <Text className={styles.resultScore}>{totalScore}<Text style={{ fontSize: '32rpx' }}>分</Text></Text>
          <View className={styles.resultTips}>
            <Text>{result.tips}</Text>
          </View>
        </View>
        <View className={styles.restartBtn} onClick={handleRestart}>🔄 再练一次</View>
      </ScrollView>
    );
  }

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.sceneSelect}>
        <View className={styles.sceneCard}>
          <Text className={styles.sceneIcon}>🎭</Text>
          <Text className={styles.sceneName}>{currentScene.title}</Text>
          <Text className={styles.sceneDesc}>{currentScene.description}</Text>
          <View className={styles.sceneSteps}>
            {currentScene.steps.map((_, idx) => (
              <View
                key={idx}
                className={classnames(
                  styles.stepDot,
                  idx < currentStep && styles.done,
                  idx === currentStep && styles.active
                )}
              >
                {idx < currentStep ? '✓' : idx + 1}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.progressBar}>
        <View className={styles.progressFill} style={{ width: `${progress}%` }} />
      </View>

      <View className={styles.stepCard}>
        <Text className={styles.stepIndex}>第 {currentStep + 1} 步 / 共 {currentScene.steps.length} 步</Text>
        <Text className={styles.sceneDescText}>📍 {step.scene}</Text>

        {step.customerLine && (
          <View className={styles.customerBubble}>
            <Text className={styles.customerText}>"{step.customerLine}"</Text>
          </View>
        )}

        <View className={styles.optionList}>
          {step.options.map(opt => (
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
              <Text className={styles.optionKey}>{opt.key}</Text>
              <Text>{opt.text}</Text>
            </View>
          ))}
        </View>

        {showFeedback && selectedOpt && (
          <View className={styles.feedbackBox}>
            <Text className={styles.feedbackScore}>
              {selectedOpt.isCorrect ? `✅ +${selectedOpt.score}分` : `❌ +${selectedOpt.score}分`}
            </Text>
            <Text className={styles.feedbackText}>{selectedOpt.feedback}</Text>
          </View>
        )}

        {showFeedback && (
          <View
            className={classnames(styles.nextBtn)}
            onClick={handleNext}
          >
            {currentStep < currentScene.steps.length - 1 ? '下一步 →' : '查看结果'}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
