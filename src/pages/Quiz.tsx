import React, { useState, useEffect } from 'react';
import { useIndustry } from '../context/IndustryContext';
import { QuizQuestion } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, RefreshCw, Trophy, ArrowRight, HelpCircle, Loader2 } from 'lucide-react';

interface QuizProps {
  data: QuizQuestion[];
  loading?: boolean;
}

export default function Quiz({ data: questions, loading }: QuizProps) {
  const { industry } = useIndustry();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Reset quiz state when questions change (new industry search)
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizCompleted(false);
  }, [questions]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (!industry) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-900 rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-air">
        <Loader2 className="w-10 h-10 text-violet-600 dark:text-violet-400 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Preparing your quiz...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No quiz available</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">We couldn't generate a quiz for this industry.</p>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-air border border-white/50 dark:border-slate-700/50 overflow-hidden text-center p-12"
      >
        <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-yellow-200 dark:shadow-yellow-900/20">
          <Trophy className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Quiz Completed!</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-10 text-lg">
          You scored <span className="font-bold text-violet-600 dark:text-violet-400 text-2xl">{score}</span> out of <span className="font-bold text-slate-900 dark:text-white text-2xl">{questions.length}</span>
        </p>
        
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-6 mb-12 overflow-hidden p-1">
          <div 
            className="bg-gradient-to-r from-violet-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${(score / questions.length) * 100}%` }}
          ></div>
        </div>

        <button 
          onClick={restartQuiz}
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-5 h-5 mr-3" />
          Retry Quiz
        </button>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Question {currentQuestionIndex + 1} / {questions.length}
        </span>
        <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-4 py-2 rounded-full border border-violet-100 dark:border-violet-800">
          Score: {score}
        </span>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-10">
        <motion.div 
          className="bg-violet-600 dark:bg-violet-500 h-2 rounded-full"
          initial={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-air border border-white/50 dark:border-slate-700/50 p-8 md:p-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-10 leading-tight">
            {currentQuestion.question}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showResult = isAnswered;

              let buttonClass = "w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group relative overflow-hidden ";
              
              if (showResult) {
                if (isCorrect) {
                  buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300";
                } else if (isSelected) {
                  buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300";
                } else {
                  buttonClass += "border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50";
                }
              } else {
                buttonClass += "border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-md";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <span className="font-semibold text-lg relative z-10">{option}</span>
                  {showResult && isCorrect && <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 relative z-10" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 relative z-10" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800"
            >
              <div className="bg-violet-50/50 dark:bg-violet-900/20 rounded-2xl p-6 mb-8 text-slate-700 dark:text-slate-300 border border-violet-100 dark:border-violet-800">
                <span className="font-bold text-violet-900 dark:text-violet-300 block mb-2 uppercase text-xs tracking-wider">Explanation</span>
                <p className="leading-relaxed font-medium">{currentQuestion.explanation}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={nextQuestion}
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
