import React, { useState, useMemo } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Question } from '@/types';

interface QuestionCardProps {
  data: Question;
  index?: number;
  showAnswer?: boolean;
  onSubmit?: (answer: string | string[], isCorrect: boolean) => void;
}

export default function QuestionCard({ data, index, showAnswer = true, onSubmit }: QuestionCardProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [fillInputs, setFillInputs] = useState<string[]>([]);
  const [activeFillIdx, setActiveFillIdx] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  const blankCount = useMemo(() => {
    if (data.type !== 'fill') return 0;
    return Array.isArray(data.correctAnswer) ? data.correctAnswer.length : 1;
  }, [data.type, data.correctAnswer]);

  const initFillInputs = () => {
    if (fillInputs.length === 0 && blankCount > 0) {
      setFillInputs(new Array(blankCount).fill(''));
    }
  };

  React.useEffect(() => {
    initFillInputs();
  }, [blankCount]);

  const isCorrect = (key: string) => {
    if (Array.isArray(data.correctAnswer)) {
      return data.correctAnswer.includes(key);
    }
    return data.correctAnswer === key;
  };

  const checkFillCorrect = (userAnswers: string[]): boolean => {
    if (!Array.isArray(data.correctAnswer)) {
      return userAnswers[0]?.trim() === String(data.correctAnswer).trim();
    }
    if (userAnswers.length !== data.correctAnswer.length) return false;
    return userAnswers.every((ans, idx) =>
      ans.trim() === String(data.correctAnswer[idx]).trim()
    );
  };

  const handleOptionClick = (key: string) => {
    if (submitted) return;

    if (data.type === 'multiple') {
      setSelected(prev =>
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
    } else {
      setSelected([key]);
      const correct = isCorrect(key);
      setTimeout(() => {
        setSubmitted(true);
        onSubmit?.(key, correct);
      }, 300);
    }
  };

  const handleJudge = (val: 'true' | 'false') => {
    if (submitted) return;
    setSelected([val]);
    const correct = isCorrect(val);
    setTimeout(() => {
      setSubmitted(true);
      onSubmit?.(val, correct);
    }, 300);
  };

  const submitMultiple = () => {
    if (submitted || selected.length === 0) return;
    const correct = selected.every(k => isCorrect(k)) &&
      selected.length === (Array.isArray(data.correctAnswer) ? data.correctAnswer.length : 1);
    setSubmitted(true);
    onSubmit?.(selected, correct);
  };

  const handleFillClick = (idx: number) => {
    if (submitted) return;
    setActiveFillIdx(idx);
    setInputValue(fillInputs[idx] || '');
    Taro.showActionSheet({
      itemList: ['确认修改'],
      success: () => {
      }
    });
  };

  const handleFillInput = (e: any) => {
    setInputValue(e.detail.value);
  };

  const handleFillConfirm = (idx: number) => {
    const newInputs = [...fillInputs];
    newInputs[idx] = inputValue;
    setFillInputs(newInputs);
    setActiveFillIdx(null);
    setInputValue('');
  };

  const submitFill = () => {
    if (submitted) return;
    if (fillInputs.some(v => !v.trim())) {
      Taro.showToast({ title: '请填写所有空格', icon: 'none' });
      return;
    }
    const correct = checkFillCorrect(fillInputs);
    setSubmitted(true);
    onSubmit?.(fillInputs, correct);
  };

  const getOptionClass = (key: string) => {
    if (!submitted) {
      return selected.includes(key) ? styles.selected : '';
    }
    if (isCorrect(key)) return styles.correct;
    if (selected.includes(key) && !isCorrect(key)) return styles.wrong;
    return '';
  };

  const getFillInputClass = (idx: number) => {
    if (!submitted) {
      return activeFillIdx === idx ? styles.fillInputActive : '';
    }
    const correctAns = Array.isArray(data.correctAnswer) ? data.correctAnswer[idx] : data.correctAnswer;
    if (fillInputs[idx]?.trim() === String(correctAns).trim()) {
      return styles.fillCorrect;
    }
    return styles.fillWrong;
  };

  const renderFillTitle = () => {
    if (data.type !== 'fill') {
      return <Text className={styles.title}>{data.title}</Text>;
    }
    const parts = data.title.split('__');
    return (
      <View className={styles.fillTitleRow}>
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            <Text className={styles.title}>{part}</Text>
            {idx < parts.length - 1 && idx < blankCount && (
              <View
                className={classnames(
                  styles.fillBlank,
                  getFillInputClass(idx),
                  !submitted && styles.fillBlankClickable
                )}
                onClick={() => handleFillClick(idx)}
              >
                {submitted ? (
                  <>
                    <Text className={styles.fillUserAns}>{fillInputs[idx] || '?'}</Text>
                    {fillInputs[idx]?.trim() !== String(
                      Array.isArray(data.correctAnswer) ? data.correctAnswer[idx] : data.correctAnswer
                    ).trim() && (
                      <Text className={styles.fillCorrectAns}>
                        (正确:{Array.isArray(data.correctAnswer) ? data.correctAnswer[idx] : data.correctAnswer})
                      </Text>
                    )}
                  </>
                ) : (
                  fillInputs[idx] ? (
                    <Text className={styles.fillUserAns}>{fillInputs[idx]}</Text>
                  ) : (
                    <Text className={styles.fillPlaceholder}>第{idx + 1}空</Text>
                  )
                )}
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    );
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

      {renderFillTitle()}

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
        <>
          {activeFillIdx !== null && !submitted && (
            <View className={styles.fillInputPanel}>
              <Text className={styles.fillInputLabel}>请填写第 {activeFillIdx + 1} 空的答案：</Text>
              <View className={styles.fillInputRow}>
                <Input
                  className={styles.fillNativeInput}
                  value={inputValue}
                  onInput={handleFillInput}
                  placeholder="请输入答案"
                  confirmType="done"
                />
                <View
                  className={classnames(styles.smallBtn, styles.smallBtnPrimary)}
                  onClick={() => handleFillConfirm(activeFillIdx)}
                >
                  确认
                </View>
              </View>
            </View>
          )}
          <View
            className={classnames(styles.submitBtn, fillInputs.every(v => v.trim()) && !submitted && styles.active)}
            onClick={submitFill}
          >
            提交答案
          </View>
        </>
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
              onClick={submitMultiple}
            >
              提交答案
            </View>
          )}
        </View>
      )}

      {submitted && showAnswer && (
        <View className={styles.explanation}>
          <View className={styles.expTitle}>
            {data.type === 'fill'
              ? (checkFillCorrect(fillInputs) ? '✅ 回答正确' : '❌ 回答错误')
              : (
                data.type === 'multiple'
                  ? (selected.every(k => isCorrect(k)) && selected.length === (Array.isArray(data.correctAnswer) ? data.correctAnswer.length : 1) ? '✅ 回答正确' : '❌ 回答错误')
                  : (isCorrect(selected[0]) ? '✅ 回答正确' : '❌ 回答错误')
              )
            }　📖 题目解析
          </View>
          <Text className={styles.expContent}>{data.explanation}</Text>
        </View>
      )}
    </View>
  );
}
