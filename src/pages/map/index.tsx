import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
    completeTaskByType,
    levelProgress: contextLevelProgress,
    resetLevelProgress
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return (router.params?.category as string) || 'all';
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
  const pendingNextRef = useRef(false);

  const resolvedLevelProgress = useMemo(() => {
    const map: Record<string, { completed: boolean; finishedAll: boolean; answeredCount: number; correctCount: number }> = {};
    levels.forEach(l => {
      const p = getLevelProgress(l.id);
      map[l.id] = {
        completed: p.completed,
        finishedAll: p.finishedAll,
        answeredCount: p.answeredIds.length,
        correctCount: p.correctCount
      };
    });
    return map;
  }, [getLevelProgress, contextLevelProgress]);

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
    const matched = questions.filter(q => q.category === selectedLevel.category);
    return matched.length > 0 ? matched : questions.slice(0, 5);
  }, [selectedLevel]);

  const reviewQuestions = useMemo(() => {
    const fromWrong = questions.filter(q => wrongQuestionIds.includes(q.id));
    if (fromWrong.length >= REVIEW_QUOTA) return fromWrong.slice(0, REVIEW_QUOTA);
    const extras = questions
      .filter(q => !wrongQuestionIds.includes(q.id))
      .slice(0, REVIEW_QUOTA - fromWrong.length);
    return [...fromWrong, ...extras].slice(0, REVIEW_QUOTA);
  }, [wrongQuestionIds]);

  const activeQuestions = wrongReviewMode ? reviewQuestions : levelQuestions;
  const activeLevelName = wrongReviewMode
    ? '🔄 错题复习'
    : (selectedLevel ? `${selectedLevel.icon} ${selectedLevel.name}` : '');

  const completedCount = useMemo(() => {
    return levels.filter(l => resolvedLevelProgress[l.id]?.completed).length;
  }, [resolvedLevelProgress]);

  const totalReward = useMemo(() => {
    return levels
      .filter(l => resolvedLevelProgress[l.id]?.completed)
      .reduce((s, l) => s + l.rewardPoints, 0);
  }, [resolvedLevelProgress]);

  const nextLevelExp = user.level * 200;

  const progress = selectedLevelId ? getLevelProgress(selectedLevelId) : null;

  useEffect(() => {
    if (mode === 'quiz' && activeQuestions.length > 0 && currentQIdx >= activeQuestions.length && !pendingNextRef.current) {
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
    } else if (selectedLevel) {
      const prev = getLevelProgress(selectedLevel.id);
      const unansweredIdx = levelQuestions.findIndex(
        q => !prev.answeredIds.includes(q.id)
      );
      setCurrentQIdx(unansweredIdx >= 0 ? unansweredIdx : 0);
    }
    setSessionAnswered(0);
    setSessionCorrect(0);
    setSessionScore(0);
    setMode('quiz');
  };

  const handleQuestionSubmit = useCallback((_answer: string | string[], isCorrect: boolean) => {
    if (!activeQuestions[currentQIdx]) return;
    const q = activeQuestions[currentQIdx];
    const score = isCorrect ? 10 : 0;

    if (wrongReviewMode) {
      recordAnswer({
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
    } else if (selectedLevel) {
      const prevAnswered = getLevelProgress(selectedLevel.id).answeredIds;
      const isNew = !prevAnswered.includes(q.id);
      const res = recordAnswer({
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
      if (res.taskCompleted) {
        Taro.showToast({ title: '今日任务已完成！', icon: 'success' });
      }
    }

    pendingNextRef.current = true;
    setTimeout(() => {
      pendingNextRef.current = false;
      setCurrentQIdx(prev => prev + 1);
    }, 1200);
  }, [activeQuestions, currentQIdx, wrongReviewMode, selectedLevel, getLevelProgress, recordAnswer, addScore, completeTaskByType]);

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
    } else if (selectedLevel) {
      // 未通关的关卡重练时重置进度，让正确率重新计算
      const lp = resolvedLevelProgress[selectedLevel.id];
      if (lp && !lp.completed && lp.finishedAll) {
        resetLevelProgress(selectedLevel.id);
      }
      setCurrentQIdx(0);
    }
    setSessionAnswered(0);
    setSessionCorrect(0);
    setSessionScore(0);
    setMode('quiz');
  };

  useDidShow(() => {
    if (router.params?.category) {
      const cat = router.params.category as string;
      setActiveCategory(cat);
      // 从今日任务进预约规则小测验时，自动选中该分类的第一个关卡
      if (cat === 'booking') {
        const firstLevel = levels.find(l => l.category === '预约规则');
        if (firstLevel) {
          setSelectedLevelId(firstLevel.id);
          setWrongReviewMode(false);
          setMode('level-detail');
        }
      }
    }
    if (router.params?.mode === 'wrongReview') {
      setWrongReviewMode(true);
      setMode('level-detail');
    }
  });

  // ========== RENDER: Wrong Review Detail ==========
  if (mode === 'level-detail' && wrongReviewMode) {
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

  // ========== RENDER: Level Detail ==========
  if (mode === 'level-detail' && selectedLevel) {
    const total = levelQuestions.length;
    const lp = resolvedLevelProgress[selectedLevel.id];
    const answered = lp?.answeredCount || 0;
    const correct = lp?.correctCount || 0;
    const isCompleted = lp?.completed || false;
    const isFinishedAll = lp?.finishedAll || false;
    const curAcc = answered > 0 ? Math.round((correct / Math.max(answered, 1)) * 100) : 0;
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
              <Text>难度：{'⭐'.repeat(Math.min(5, Math.floor(selectedLevel.rewardPoints / 30) + 1))}</Text>
            </View>
            <View className={styles.levelDetailReward}>
              <Text>🎯 共 {total} 题</Text>
              <Text>🎁 通关奖励：{selectedLevel.rewardPoints} 积分</Text>
            </View>
            <View style={{ margin: '24rpx 0' }}>
              <Text style={{ fontSize: '26rpx', color: '#666', display: 'block', marginBottom: '12rpx' }}>
                关卡进度 {answered}/{total}
                {answered > 0 && ` · 当前正确率 ${curAcc}%（通关需≥60%）`}
              </Text>
              <ProgressBar percent={pct} height={16} color="#7B5CFF" bgColor="#EEE6FF" />
            </View>
            {isFinishedAll && !isCompleted && (
              <View className={styles.hintBox}>
                <Text className={styles.hintTitle}>⚠️ 正确率未达标</Text>
                <Text className={styles.hintText}>
                  目前正确率 {curAcc}%，未达到通关要求（≥60%）。
                  本关已完成训练但暂未通关，点击「🔁 重刷正确率」可再次答题重算正确率，达标后即算正式通关。
                </Text>
              </View>
            )}
            {isCompleted && (
              <View className={styles.hintBoxSuccess}>
                <Text className={styles.hintTitle}>✅ 已正式通关</Text>
                <Text className={styles.hintText}>
                  正确率 {curAcc}% 已达标，已获得通关奖励 {selectedLevel.rewardPoints} 积分。
                  可以再练一次加深印象，但不再重复发放通关奖励。
                </Text>
              </View>
            )}
            <View className={styles.levelDescBox}>
              <Text className={styles.levelDescTitle}>📝 关卡说明</Text>
              <Text className={styles.levelDescText}>
                本关为「{selectedLevel.category}」专项训练，共 {total} 道题。
                <Text style={{ fontWeight: 600 }}>答完所有题且正确率≥60%即可正式通关</Text>
                并获得 {selectedLevel.rewardPoints} 积分奖励。答错的题目会自动加入错题本。
              </Text>
            </View>
            <View
              className={styles.startBtn}
              onClick={() => {
                if (isCompleted) {
                  handleContinueLevel();
                } else if (isFinishedAll) {
                  handleContinueLevel(); // 会重置进度并重算正确率
                } else if (answered > 0) {
                  handleStartQuiz();
                } else {
                  handleStartQuiz();
                }
              }}
            >
              {isCompleted
                ? '🔁 再练一次'
                : isFinishedAll
                  ? '🔁 重刷正确率'
                  : answered > 0
                    ? '▶ 继续答题'
                    : '▶ 开始答题'}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ========== RENDER: Quiz ==========
  if (mode === 'quiz' && activeQuestions.length > 0) {
    const q = activeQuestions[currentQIdx];
    const total = activeQuestions.length;
    const pct = total > 0 ? ((currentQIdx) / total) * 100 : 0;
    const progressColor = wrongReviewMode ? '#FF8A65' : '#7B5CFF';
    const progressBg = wrongReviewMode ? '#FFE8DC' : '#EEE6FF';
    if (!q) {
      setMode('result');
      return null;
    }
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
          <QuestionCard
            key={`${q.id}-${currentQIdx}`}
            data={q}
            index={currentQIdx + 1}
            onSubmit={handleQuestionSubmit}
          />
        </View>
      </ScrollView>
    );
  }

  // ========== RENDER: Result ==========
  if (mode === 'result') {
    const total = activeQuestions.length;
    let correct = sessionCorrect;
    let acc = total > 0 ? Math.round((correct / total) * 100) : 0;
    let levelCompleted = false;
    let finishedAll = false;

    if (wrongReviewMode) {
      levelCompleted = wrongAnsweredCount >= REVIEW_QUOTA;
      finishedAll = levelCompleted;
    } else if (selectedLevel) {
      const lp = resolvedLevelProgress[selectedLevel.id];
      if (lp) {
        correct = lp.correctCount;
        acc = total > 0 ? Math.round((correct / total) * 100) : 0;
        levelCompleted = lp.completed;
        finishedAll = lp.finishedAll;
      }
    }
    const passed = acc >= 60;

    let icon = '⏸';
    let title = '答题中断';
    let statusLine = '';
    if (wrongReviewMode) {
      icon = finishedAll ? '📚' : '⏸';
      title = finishedAll ? '复习完成！' : '复习中断';
    } else {
      if (levelCompleted) {
        icon = '🏆';
        title = '恭喜通关！';
        statusLine = '已计入地图已通关数量';
      } else if (finishedAll) {
        icon = '📚';
        title = '训练已完成';
        statusLine = `正确率 ${acc}% 未达通关标准（≥60%），可重刷正确率`;
      } else {
        icon = '⏸';
        title = '答题中断';
        statusLine = '尚未完成本关全部题目，可继续答题';
      }
    }

    return (
      <ScrollView scrollY>
        <View style={{ padding: '32rpx' }}>
          <View className={styles.backLink} onClick={handleBackToMap}>
            ← 返回闯关地图
          </View>
          <View className={styles.resultCard}>
            <Text className={styles.resultIcon}>{icon}</Text>
            <Text className={styles.resultTitle}>{title}</Text>
            {statusLine && (
              <Text className={styles.resultStatusLine}>{statusLine}</Text>
            )}
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
            {!wrongReviewMode && levelCompleted && selectedLevel && (
              <View className={styles.rewardBox}>
                <Text style={{ fontWeight: 600 }}>🎁 通关奖励</Text>
                <Text>+{selectedLevel.rewardPoints} 积分</Text>
              </View>
            )}
            {!wrongReviewMode && finishedAll && !levelCompleted && selectedLevel && (
              <View className={styles.hintBox}>
                <Text className={styles.hintTitle}>⚠️ 暂未通关</Text>
                <Text className={styles.hintText}>
                  已完成本关训练，但正确率 {acc}% 未达≥60%的通关要求。
                  可重刷正确率，达标后将自动通关并获得 {selectedLevel.rewardPoints} 积分通关奖励。
                </Text>
              </View>
            )}
            {wrongReviewMode && levelCompleted && (
              <View className={styles.rewardBox}>
                <Text style={{ fontWeight: 600 }}>🎉 今日任务</Text>
                <Text>「复习昨日错题」已完成</Text>
              </View>
            )}
            <View style={{ display: 'flex', gap: '20rpx', marginTop: '32rpx' }}>
              <View
                className={styles.secondaryBtn}
                onClick={handleContinueLevel}
              >
                {levelCompleted ? '🔁 再练一次' : wrongReviewMode ? '🔁 再练一次' : '🔁 重刷正确率'}
              </View>
              <View className={styles.primaryBtn} onClick={handleBackToMap}>🗺 返回地图</View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ========== RENDER: Map (default) ==========
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
            const p = resolvedLevelProgress[level.id];
            const enrichedLevel = {
              ...level,
              completed: p?.completed || false,
              progress: p && level.totalQuestions > 0
                ? Math.round((p.answeredCount / level.totalQuestions) * 100)
                : 0
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
