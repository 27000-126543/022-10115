import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import { levels, levelCategories } from '@/data/levels';
import { questions } from '@/data/questions';
import LevelNode from '@/components/LevelNode';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';

type Mode = 'map' | 'level-detail' | 'quiz' | 'result';

const categoryIdToName: Record<string, string> = {
  service: '服务流程',
  booking: '预约规则',
  complaint: '投诉应对',
  privacy: '隐私保护',
  postop: '术后回访'
};

const REVIEW_QUOTA = 3;

export default function MapPage() {
  const router = useRouter();
  const {
    user,
    recordAnswer,
    getLevelProgress,
    addScore,
    wrongQuestionIds,
    completeTaskByType
  } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const c = (router.params?.category as string) || 'all';
    return c;
  });
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('map');
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [wrongReviewMode, setWrongReviewMode] = useState<boolean>(
    router.params?.mode === 'wrongReview'
  );
  const [wrongAnsweredCount, setWrongAnsweredCount] = useState(0);

  const filteredLevels = useMemo(() => {
    if (activeCategory === 'all') return levels;
    const categoryName = categoryIdToName[activeCategory];
    if (!categoryName) return levels;
    return levels.filter(l => l.category === categoryName);
  }, [activeCategory]);

  const selectedLevel = useMemo(() => {
    if (!selectedLevelId) return null;
    return levels.find(l => l.id === selectedLevelId) || null;
  }, [selectedLevelId]);

  const levelQuestions = useMemo(() => {
    if (!selectedLevel) return [];
    let matched = questions.filter(q => q.category === selectedLevel.category);
    if (matched.length === 0) matched = questions.slice(0, Math.min(selectedLevel.totalQuestions, 5));
    if (matched.length < selectedLevel.totalQuestions) return matched;
    return matched.slice(0, selectedLevel.totalQuestions);
  }, [selectedLevel]);

  const reviewQuestions = useMemo(() => {
    const fromWrong = questions.filter(q => wrongQuestionIds.includes(q.id));
    if (fromWrong.length >= REVIEW_QUOTA) return fromWrong;
    const extras = questions
      .filter(q => !wrongQuestionIds.includes(q.id))
      .slice(0, REVIEW_QUOTA - fromWrong.length);
    return [...fromWrong, ...extras];
  }, [wrongQuestionIds]);

  const activeQuestions = wrongReviewMode ? reviewQuestions : levelQuestions;
  const activeLevelName = wrongReviewMode ? '🔄 错题复习' : (selectedLevel ? `${selectedLevel.icon} ${selectedLevel.name}` : '');
  const activeRewardPoints = wrongReviewMode ? 0 : (selectedLevel?.rewardPoints || 0);
  const activeTotalQuestions = wrongReviewMode ? REVIEW_QUOTA : (selectedLevel?.totalQuestions || 0);

  const progress = selectedLevelId ? getLevelProgress(selectedLevelId) : null;

  const completedCount = levels.filter(l => l.completed || (levelProgress[l.id]?.completed)).length;
  const totalReward = levels
    .filter(l => l.completed)
    .reduce((s, l) => s + l.rewardPoints, 0);
  const nextLevelExp = user.level * 200;

  const levelProgress = useMemo(() => {
    const map: Record<string, { completed: boolean; answeredCount: number }> = {};
    levels.forEach(l => {
      const p = getLevelProgress(l.id);
      map[l.id] = {
        completed: l.completed || p.completed,
        answeredCount: p.answeredIds.length
      };
    });
    return map;
  }, [getLevelProgress]);

  useEffect(() => {
    if (mode === 'quiz' && activeQuestions.length > 0 && currentQIdx >= activeQuestions.length) {
      setMode('result');
    }
  }, [currentQIdx, mode, activeQuestions.length]);

  const handleLevelClick = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    if (!level?.unlocked) {
      Taro.showToast({ title: '请先完成前置关卡', icon: 'none' });
      return;
    }
    setWrongReviewMode(false);
    setSelectedLevelId(levelId);
    setMode('level-detail');
  };

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setSelectedLevelId(null);
    setWrongReviewMode(false);
    setMode('map');
    setCurrentQIdx(0);
    setSessionAnswered(0);
    setSessionCorrect(0);
    setSessionScore(0);
    setWrongAnsweredCount(0);
  };

  const handleStartQuiz = () => {
    if (wrongReviewMode) {
      setCurrentQIdx(0);
    } else {
      if (!selectedLevel) return;
      const prev = getLevelProgress(selectedLevel.id);
      setCurrentQIdx(prev.answeredIds.length < levelQuestions.length ? prev.answeredIds.length : 0);
    }
    setSessionAnswered(0);
    setSessionCorrect(0);
    setSessionScore(0);
    setMode('quiz');
  };

  const handleQuestionSubmit = (_answer: string | string[], isCorrect: boolean) => {
    if (!activeQuestions[currentQIdx]) return;
    const q = activeQuestions[currentQIdx];
    const score = isCorrect ? 10 : 0;
    let res: { levelCompleted?: boolean; taskCompleted?: boolean } = {};

    if (wrongReviewMode) {
      res = recordAnswer({
        questionId: q.id,
        category: '__wrong__',
        isCorrect,
        questionScore: score
      });
      setWrongAnsweredCount(prev => {
        const next = prev + 1;
        if (next >= REVIEW_QUOTA) {
          completeTaskByType('review');
          Taro.showToast({ title: '错题复习完成！', icon: 'success' });
        }
        return next;
      });
      setSessionAnswered(prev => prev + 1);
      setSessionCorrect(prev => prev + (isCorrect ? 1 : 0));
      setSessionScore(prev => prev + score);
    } else {
      if (!selectedLevel) return;
      const prevAnswered = getLevelProgress(selectedLevel.id).answeredIds;
      const isNew = !prevAnswered.includes(q.id);
      res = recordAnswer({
        levelId: selectedLevel.id,
        questionId: q.id,
        category: q.category,
        isCorrect,
        questionScore: isNew && isCorrect ? score : 0
      });
      if (isNew) {
        setSessionAnswered(prev => prev + 1);
        setSessionCorrect(prev => prev + (isCorrect ? 1 : 0));
        setSessionScore(prev => prev + score);
      }
      if (res.levelCompleted && selectedLevel.rewardPoints > 0) {
        addScore(selectedLevel.rewardPoints);
        Taro.showToast({ title: `通关奖励 +${selectedLevel.rewardPoints}积分`, icon: 'success' });
      }
    }
    if (res.taskCompleted) {
      Taro.showToast({ title: '今日任务已完成！', icon: 'success' });
    }
    setTimeout(() => {
      setCurrentQIdx(prev => prev + 1);
    }, 1200);
  };

  const handleBackToMap = () => {
    setMode('map');
    setCurrentQIdx(0);
    setWrongReviewMode(false);
    setSelectedLevelId(null);
    setWrongAnsweredCount(0);
  };

  const handleContinueLevel = () => {
    if (wrongReviewMode) {
      setCurrentQIdx(0);
      setWrongAnsweredCount(0);
    } else {
      const prev = selectedLevelId ? getLevelProgress(selectedLevelId) : null;
      if (prev?.completed) {
        setCurrentQIdx(0);
      } else if (prev && prev.answeredIds.length < levelQuestions.length) {
        setCurrentQIdx(prev.answeredIds.length);
      }
    }
    setSessionAnswered(0);
    setSessionCorrect(0);
    setSessionScore(0);
    setMode('quiz');
  };

  useDidShow(() => {
    if (router.params?.category) {
      const c = router.params.category as string;
      setActiveCategory(c);
    }
    if (router.params?.mode === 'wrongReview') {
      setWrongReviewMode(true);
      setMode('level-detail');
    }
  });

  if (mode === 'level-detail' && wrongReviewMode) {
    const total = Math.min(REVIEW_QUOTA, reviewQuestions.length);
    return (
      <ScrollView scrollY>
        <View style={{ padding: '32rpx' }}>
          <View className={styles.backLink} onClick={handleBackToMap}>
            ← 返回闯关地图
          </View>
          <View className={styles.levelDetailCard}>
            <Text className={styles.levelDetailIcon}>🔄</Text>
            <Text className={styles.levelDetailName}>错题复习</Text>
            <View className={styles.levelDetailMeta}>
              <Text>分类：复盘巩固</Text>
              <Text>题量：共 {REVIEW_QUOTA} 题</Text>
            </View>
            <View className={styles.levelDetailReward}>
              <Text>🎯 完成 {REVIEW_QUOTA} 道错题复习</Text>
              <Text>🎁 完成计入今日任务</Text>
            </View>
            <View style={{ margin: '24rpx 0' }}>
              <Text style={{ fontSize: '26rpx', color: '#666', display: 'block', marginBottom: '12rpx' }}>
                当前错题本：{wrongQuestionIds.length} 道题 · 本次练习：{reviewQuestions.length} 道
              </Text>
              <ProgressBar percent={Math.min(100, (wrongAnsweredCount / REVIEW_QUOTA) * 100)} height={16} color="#FF8A65" bgColor="#FFE8DC" />
            </View>
            <View className={styles.levelDescBox}>
              <Text className={styles.levelDescTitle}>📝 复习说明</Text>
              <Text className={styles.levelDescText}>
                精选高频错题专项复盘，答对答错均计入题量。完成 {REVIEW_QUOTA} 道题后，
                今日任务中的「复习昨日错题」将自动标记完成，并获得对应积分奖励。
              </Text>
            </View>
            <View className={styles.startBtn} onClick={handleStartQuiz}>
              ▶ 开始复习
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (mode === 'level-detail' && selectedLevel && progress) {
    const total = levelQuestions.length;
    const answered = progress.answeredIds.length;
    const pct = total > 0 ? Math.min(100, (answered / total) * 100) : 0;
    return (
      <ScrollView scrollY>
        <View style={{ padding: '32rpx' }}>
          <View className={styles.backLink} onClick={handleBackToMap}>
            ← 返回闯关地图
          </View>
          <View className={styles.levelDetailCard}>
            <Text className={styles.levelDetailIcon}>{selectedLevel.icon}</Text>
            <Text className={styles.levelDetailName}>{selectedLevel.name}</Text>
            <View className={styles.levelDetailMeta}>
              <Text>分类：{selectedLevel.category}</Text>
              <Text>难度：{'⭐'.repeat(Math.min(5, selectedLevel.rewardPoints / 30 + 1))}</Text>
            </View>
            <View className={styles.levelDetailReward}>
              <Text>🎯 共 {selectedLevel.totalQuestions} 题</Text>
              <Text>🎁 通关奖励：{selectedLevel.rewardPoints} 积分</Text>
            </View>
            <View style={{ margin: '24rpx 0' }}>
              <Text style={{ fontSize: '26rpx', color: '#666', display: 'block', marginBottom: '12rpx' }}>
                关卡进度 {answered}/{total}
              </Text>
              <ProgressBar percent={pct} height={16} color="#7B5CFF" bgColor="#EEE6FF" />
            </View>
            <View className={styles.levelDescBox}>
              <Text className={styles.levelDescTitle}>📝 关卡说明</Text>
              <Text className={styles.levelDescText}>
                本关为「{selectedLevel.category}」专项训练，完成全部题目后可解锁下一关。
                请认真作答，答错的题目会自动加入错题本，用于后续复盘复习。
              </Text>
            </View>
            <View
              className={classnames(styles.startBtn, progress.completed && styles.disabled)}
              onClick={progress.completed ? handleContinueLevel : handleStartQuiz}
            >
              {progress.completed ? '🔁 再练一次' : answered > 0 ? '▶ 继续答题' : '▶ 开始答题'}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (mode === 'quiz' && activeQuestions.length > 0 && (wrongReviewMode || selectedLevel)) {
    const q = activeQuestions[currentQIdx];
    const total = activeQuestions.length;
    const pct = ((currentQIdx) / total) * 100;
    const progressColor = wrongReviewMode ? '#FF8A65' : '#7B5CFF';
    const progressBg = wrongReviewMode ? '#FFE8DC' : '#EEE6FF';
    return (
      <ScrollView scrollY>
        <View style={{ padding: '32rpx' }}>
          <View className={styles.backLink} onClick={handleBackToMap}>
            ← 返回地图
          </View>
          <View style={{ marginBottom: '24rpx' }}>
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12rpx' }}>
              <Text style={{ fontSize: '28rpx', fontWeight: 600 }}>{activeLevelName}</Text>
              <Text style={{ fontSize: '26rpx', color: progressColor }}>
                {currentQIdx + 1} / {total}
              </Text>
            </View>
            <ProgressBar percent={pct} height={10} color={progressColor} bgColor={progressBg} />
          </View>
          {q && (
            <QuestionCard
              key={q.id}
              data={q}
              index={currentQIdx + 1}
              onSubmit={handleQuestionSubmit}
            />
          )}
        </View>
      </ScrollView>
    );
  }

  if (mode === 'result' && (wrongReviewMode || (selectedLevel && progress))) {
    const total = activeQuestions.length;
    let correct = sessionCorrect;
    if (!wrongReviewMode && progress) correct = progress.correctCount;
    const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = acc >= 60;
    const levelCompleted = wrongReviewMode ? wrongAnsweredCount >= REVIEW_QUOTA : (progress?.completed || false);
    const icon = levelCompleted ? (passed ? '🏆' : '📊') : '⏸';
    const title = wrongReviewMode
      ? (levelCompleted ? '复习完成！' : '复习中断')
      : (progress?.completed ? (passed ? '恭喜通关！' : '本关已完成') : '答题中断');
    return (
      <ScrollView scrollY>
        <View style={{ padding: '32rpx' }}>
          <View className={styles.backLink} onClick={handleBackToMap}>
            ← 返回闯关地图
          </View>
          <View className={styles.resultCard}>
            <Text className={styles.resultIcon}>{icon}</Text>
            <Text className={styles.resultTitle}>{title}</Text>
            <View className={styles.resultStats}>
              <View className={styles.resultStat}>
                <Text className={styles.resultStatNum}>{acc}%</Text>
                <Text className={styles.resultStatLabel}>正确率</Text>
              </View>
              <View className={styles.resultStat}>
                <Text className={styles.resultStatNum}>{correct}/{total}</Text>
                <Text className={styles.resultStatLabel}>答对/总题</Text>
              </View>
              <View className={styles.resultStat}>
                <Text className={styles.resultStatNum}>+{sessionScore}</Text>
                <Text className={styles.resultStatLabel}>本轮积分</Text>
              </View>
            </View>
            {!wrongReviewMode && progress?.completed && (
              <View className={styles.rewardBox}>
                <Text style={{ fontWeight: 600 }}>🎁 通关奖励</Text>
                <Text>+{activeRewardPoints} 积分</Text>
              </View>
            )}
            {wrongReviewMode && levelCompleted && (
              <View className={styles.rewardBox}>
                <Text style={{ fontWeight: 600 }}>🎉 今日任务</Text>
                <Text>「复习昨日错题」已完成</Text>
              </View>
            )}
            <View style={{ display: 'flex', gap: '20rpx', marginTop: '32rpx' }}>
              <View className={styles.secondaryBtn} onClick={handleContinueLevel}>🔁 再练一次</View>
              <View className={styles.primaryBtn} onClick={handleBackToMap}>🗺 返回地图</View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

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
                onClick={() => handleCategoryChange(cat.id)}
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
          {filteredLevels.map((level, idx) => {
            const p = levelProgress[level.id];
            const enrichedLevel = {
              ...level,
              completed: p?.completed || level.completed,
              progress: p && level.totalQuestions > 0
                ? Math.round((p.answeredCount / level.totalQuestions) * 100)
                : level.progress
            };
            return (
              <React.Fragment key={level.id}>
                <LevelNode
                  data={enrichedLevel}
                  onClick={() => handleLevelClick(level.id)}
                />
                {idx % 2 === 1 && idx < filteredLevels.length - 1 && (
                  <View className={styles.pathLine}>↓ ↓</View>
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>

      <View className={styles.contentBottom} />
    </ScrollView>
  );
}
