import React from 'react';
import type { Question } from './types';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number;
  onAnswerSelect: (answerIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions
}) => {
  return (
    <div className="bg-gradient-to-br from-[#DDF4E7] to-[#67C090] backdrop-blur-xl border border-green-200/50 rounded-2xl p-8 shadow-xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-gray-600">
            Cybersecurity Knowledge Test
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              selectedAnswer === index
                ? 'border-[#8AA624] bg-gradient-to-r from-[#BBD8A3] to-[#A0C878] text-black shadow-lg'
                : 'border-gray-200 bg-white/80 hover:border-[#BBD8A3] hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50'
            }`}
          >
            <div className="flex items-center">
              <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-bold ${
                selectedAnswer === index
                  ? 'border-[#8AA624] bg-[#8AA624] text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-lg font-medium text-gray-800">
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
