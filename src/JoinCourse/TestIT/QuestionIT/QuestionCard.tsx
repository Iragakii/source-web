import React from 'react';
import type { Question } from './types';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
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
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-gradient-to-r from-green-100/60 to-emerald-100/60 border-green-300/50 text-green-700';
      case 'Medium':
        return 'bg-gradient-to-r from-amber-100/60 to-orange-100/60 border-amber-300/50 text-amber-700';
      case 'Hard':
        return 'bg-gradient-to-r from-red-100/60 to-rose-100/60 border-red-300/50 text-red-700';
      default:
        return 'bg-gradient-to-r from-gray-100/60 to-slate-100/60 border-gray-300/50 text-gray-700';
    }
  };

  return (
    
    <div className="bg-gradient-to-r from-[#DDF4E7] to-[#67C090] backdrop-blur-xl border border-green-200/50 rounded-3xl p-8 shadow-2xl">
      {/* Question Header */}
      
      <div className="flex justify-between items-center mb-8 !mt-4">
        <div className="flex items-center gap-4">
          <div className="!ml-3 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#BBD8A3' }}>
            <span className=" text-white font-bold text-lg">{questionNumber}</span>
          </div>
          <div>
            <span className="text-gray-600 text-lg font-medium">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
        </div>
        <div className="!mr-3 flex items-center gap-3">
          <span className={`!px-4 py-2 rounded-xl border text-sm font-medium ${getDifficultyStyle(question.difficulty)}`}>
            {question.difficulty}
          </span>
          <span className="!px-4 py-2 rounded-xl border border-green-300/50 bg-gradient-to-r from-green-100/50 to-emerald-100/50 text-gray-700 text-sm font-medium">
            {question.category}
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-gray-800 text-2xl font-bold leading-relaxed mb-4">
          {question.question}
        </h2>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
              selectedAnswer === index
                ? 'border-green-400/50 bg-gradient-to-r from-green-100/60 to-emerald-100/60 text-green-800 shadow-lg'
                : 'border-gray-300/50 bg-gradient-to-r from-gray-50/30 to-white/30 text-gray-700 hover:border-green-300/50 hover:from-green-50/40 hover:to-emerald-50/40'
            }`}
            style={selectedAnswer === index ? { boxShadow: '0 10px 25px rgba(138, 166, 36, 0.2)' } : {}}
          >
            <div className="flex items-center gap-4">
              <div 
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                  selectedAnswer === index
                    ? 'border-green-400 text-white shadow-lg'
                    : 'border-gray-400 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
                }`}
                style={selectedAnswer === index ? { backgroundColor: '#8AA624' } : {}}
              >
                {selectedAnswer === index ? '✓' : String.fromCharCode(65 + index)}
              </div>
              <span className="text-lg font-medium flex-1">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
