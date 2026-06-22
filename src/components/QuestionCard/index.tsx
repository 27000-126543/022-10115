import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Question } from '@/types';

interface QuestionCardProps {
  data: Question;
  index?: number;
  showAnswer?: boolean;
  onSubmit?: (answer: string | string[]) => void;
}

export default function QuestionCard({ data, index, showAnswer = true, onSubmit }: QuestionCardProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [fillAnswer, setFillAnswer] = useState('');

  const isCorrect = (key: string) => {
    if (Array.isArray(data.correctAnswer)) {
      return data.correctAnswer.includes(key);
    }
    return data.correctAnswer === key;
  };

  const handleOptionClick = (key: string) => {
    if (submitted) return;

    if (data.type === 'multiple') {
      setSelected(prev =>
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
    } else {
      setSelected([key]);
      setTimeout(() => submitAnswer([key]), 300);
    }
  };

  const handleJudge = (val: 'true' | 'false') => {
    if (submitted) return;
    setSelected([val]);
    setTimeout(() => submitAnswer([val]), 300);
  };

  const submitAnswer = (answer: string[]) => {
    setSubmitted(true);
    onSubmit?.(data.type === 'multiple' ? answer : answer[0]);
  };

  const getOptionClass = (key: string) => {
    if (!submitted) {
      return selected.includes(key) ? styles.selected : '';
    }
    if (isCorrect(key)) return styles.correct;
    if (selected.includes(key) && !isCorrect(key)) return styles.wrong;
    return '';
  };

  return (
    <View className={styles.card}>
      <View className={styles.header}>
        {index !== undefined && (
          <View className={styles.index}>第{index}题</View>
        )}
        <View className={styles.category}>{data.category}</View>
        <View className={styles.difficulty}>
          {'★'.repeat(data.difficulty)}{'☆'.repeat(3 - data.difficulty)}
        </View>
      </View>
      <Text className={styles.title}>{data.title}</Text>

      {data.type === 'judge' && (
        <View className={styles.judgeRow}>
          <View
            className={classnames(styles.judgeBtn, getOptionClass('true'))}
            onClick={() => handleJudge('true')}
          >
            ✓ 正确
          </View>
          <View
            className={classnames(styles.judgeBtn, getOptionClass('false'))}
            onClick={() => handleJudge('false')}
          >
            ✗ 错误
          </View>
        </View>
      )}

      {data.type === 'fill' && (
        <View className={styles.fillArea}>
          <View className={styles.fillInput}>
            {fillAnswer || '点击输入答案...'}
          </View>
          <View
            className={classnames(styles.submitBtn, !submitted && styles.active)}
            onClick={() => fillAnswer && submitAnswer([fillAnswer])}
          >
            提交
          </View>
        </View>
      )}

      {(data.type === 'single' || data.type === 'multiple') && data.options && (
        <View className={styles.options}>
          {data.options.map(opt => (
            <View
              key={opt.key}
              className={classnames(styles.option, getOptionClass(opt.key))}
              onClick={() => handleOptionClick(opt.key)}
            >
              <View className={styles.optionKey}>{opt.key}</View>
              <Text className={styles.optionText}>{opt.text}</Text>
            </View>
          ))}
          {data.type === 'multiple' && !submitted && (
            <View
              className={classnames(styles.submitBtn, selected.length > 0 && styles.active)}
              onClick={() => selected.length > 0 && submitAnswer(selected)}
            >
              提交答案
            </View>
          )}
        </View>
      )}

      {submitted && showAnswer && (
        <View className={styles.explanation}>
          <View className={styles.expTitle}>📖 题目解析</View>
          <Text className={styles.expContent}>{data.explanation}</Text>
        </View>
      )}
    </View>
  );
}
