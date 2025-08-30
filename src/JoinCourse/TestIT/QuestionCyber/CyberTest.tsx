import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import { cyberQuestions } from './questionData';
import type { TestState } from './types';
import { testResultService } from '../../../services/testResultService';
import { useNotification } from '../../../contexts/NotificationContext';

const CyberTest: React.FC = () => {
  const [testState, setTestState] = useState<TestState>({
    currentQuestion: 0,
    answers: new Array(cyberQuestions.length).fill(-1),
    score: 0,
    isCompleted: false,
    timeRemaining: 1200 // 20 minutes in seconds
  });

  const [showResults, setShowResults] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  // Timer effect
  useEffect(() => {
    if (testState.timeRemaining > 0 && !testState.isCompleted) {
      const timer = setTimeout(() => {
        setTestState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);

      return () => clearTimeout(timer);
    } else if (testState.timeRemaining === 0 && !testState.isCompleted) {
      handleSubmitTest();
    }
  }, [testState.timeRemaining, testState.isCompleted]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...testState.answers];
    newAnswers[testState.currentQuestion] = answerIndex;
    
    setTestState(prev => ({
      ...prev,
      answers: newAnswers
    }));
  };

  const handleNextQuestion = () => {
    if (testState.currentQuestion < cyberQuestions.length - 1) {
      setTestState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (testState.currentQuestion > 0) {
      setTestState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }));
    }
  };

  const handleSubmitTest = () => {
    const score = testState.answers.reduce((acc, answer, index) => {
      return answer === cyberQuestions[index].correctAnswer ? acc + 1 : acc;
    }, 0);

    setTestState(prev => ({
      ...prev,
      score,
      isCompleted: true
    }));
    setShowResults(true);
  };

  const handleRestartTest = () => {
    setTestState({
      currentQuestion: 0,
      answers: new Array(cyberQuestions.length).fill(-1),
      score: 0,
      isCompleted: false,
      timeRemaining: 1200
    });
    setShowResults(false);
    setShowEmailForm(false);
    setEmail('');
    setName('');
  };

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !name.trim()) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await testResultService.submitTestResult({
        email: email.trim(),
        name: name.trim(),
        score: testState.score,
        totalQuestions: cyberQuestions.length,
        timeTaken: 1200 - testState.timeRemaining,
        testType: 'Cybersecurity'
      });

      if (result.success) {
        showNotification('Test result submitted successfully!', 'success');
        setShowEmailForm(false);
      } else {
        showNotification(result.message || 'Failed to submit test result', 'error');
      }
    } catch (error) {
      showNotification('An error occurred while submitting your result', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-emerald-400';
    if (percentage >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const currentQuestion = cyberQuestions[testState.currentQuestion];
  const answeredQuestions = testState.answers.filter(answer => answer !== -1).length;

  if (showResults) {
    return (
      <div className=' '>
        <div className="flex  items-center justify-center min-h-screen !ml-40  !p-6"> 
          <div className="bg-gradient-to-br from-[#BBD8A3] to-green-50/95 !p-8 backdrop-blur-xl border border-green-200/50 rounded-3xl !space-y-5 max-w-4xl mx-auto text-center  shadow-2xl">
            <div className="mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-4">
                Cybersecurity Test Completed 
              </h1>
            </div>
            
            <div className="space-y-8 mb-12">
              <div className={`text-8xl font-bold ${getScoreColor(testState.score, cyberQuestions.length)} drop-shadow-lg`}>
                {testState.score}/{cyberQuestions.length}
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-semibold text-gray-800">
                  {Math.round((testState.score / cyberQuestions.length) * 100)}% Score
                </div>
                <div className="text-lg text-gray-600">
                  Time taken: {formatTime(1200 - testState.timeRemaining)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-gradient-to-br from-green-100/60 to-emerald-100/60 border border-green-300/50 p-8 rounded-2xl">
                <div className="text-green-600 text-4xl font-bold mb-2">{testState.score}</div>
                <div className="text-green-700 text-lg font-medium">Correct Answers</div>
              </div>
              <div className="bg-gradient-to-br from-red-100/60 to-rose-100/60 border border-red-300/50 p-8 rounded-2xl">
                <div className="text-red-600 text-4xl font-bold mb-2">{cyberQuestions.length - testState.score}</div>
                <div className="text-red-700 text-lg font-medium">Incorrect Answers</div>
              </div>
            </div>

             {/* Email Submission Form */}
            {showEmailForm ? (
              <form onSubmit={handleSubmitResult} className="bg-gradient-to-br from-blue-100/60 to-indigo-100/60 border border-blue-300/50 !p-3 !space-y-5 rounded-2xl mb-8 text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Submit Your Results</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold !mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full !mb-3 !px-3 !py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold !mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mb-3 !px-3 !  py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Results'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="bg-gradient-to-r from-[#A4B465] to-[#626F47] hover:from-blue-600 hover:to-indigo-700 hover:scale-105 text-white !px-10 py-4 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Submit Results
                </button>
                <button
                  onClick={handleRestartTest}
                  className="bg-gradient-to-r from-[#D3E671] to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 text-black !px-10 py-4 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Take Test Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-[1100px] p-6">
      {/* Header */}
      <div className=" mb-8">
        <div className="bg-gradient-to-r from-[#DDF4E7] to-[#67C090] backdrop-blur-xl border border-green-200/50 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="!ml-3 text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #DDEB9D, #A0C878)' }}>
                Cybersecurity Knowledge Test
              </h1>
            </div>
            <div className="!mr-3 flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{answeredQuestions}/{cyberQuestions.length}</div>
                <div className="text-gray-600 text-sm">Progress</div>
              </div>
              <div className={`text-center ${
                testState.timeRemaining < 300 ? 'text-red-600' : 'text-gray-800'
              }`} style={{ color: testState.timeRemaining >= 300 ? '#8AA624' : undefined }}>
                <div className="text-3xl font-mono font-bold">
                  {formatTime(testState.timeRemaining)}
                </div>
                <div className="text-gray-600 text-sm">Time Left</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gradient-to-r from-[#DEE791] to-[#A3DC9A] rounded-full h-3 overflow-hidden">
            <div 
              className="h-3 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${(answeredQuestions / cyberQuestions.length) * 100}%`,
                backgroundColor: '#8AA624'
              }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-6xl mx-auto mb-8">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={testState.answers[testState.currentQuestion]}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={testState.currentQuestion + 1}
          totalQuestions={cyberQuestions.length}
        />
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-[#DDF4E7] to-[#67C090] backdrop-blur-xl border border-green-200/50 rounded-2xl p-6 shadow-xl">
          <div className='bg-gradient-to-r from-[#DEE791] to-[#A3DC9A] rounded-full h-3 overflow-hidden'></div>
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={testState.currentQuestion === 0}
              className="!px-2 !py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-300 hover:to-gray-400 transition-all duration-300 text-lg font-medium shadow-lg cursor-pointer"
            >
              Previous
            </button>

            <div className="flex gap-3 flex-wrap justify-center">
              {cyberQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestState(prev => ({ ...prev, currentQuestion: index }))}
                  className={`w-12 h-12 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md hover:scale-105 cursor-pointer ${
                    index === testState.currentQuestion
                      ? 'text-white shadow-lg'
                      : testState.answers[index] !== -1
                      ? 'text-white'
                      : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                  }`}
                  style={
                    index === testState.currentQuestion
                      ? { backgroundColor: '#BBD8A3' }
                      : testState.answers[index] !== -1
                      ? { backgroundColor: '#A0C878' }
                      : {}
                  }
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {testState.currentQuestion === cyberQuestions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                className="!px-2 !py-3 text-white rounded-xl transition-all duration-300 text-lg font-medium shadow-lg hover:scale-105 cursor-pointer"
                style={{ backgroundColor: '#BBD8A3' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7A9520'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8AA624'}
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="!px-2 !py-3 text-black rounded-xl transition-all duration-300 text-lg font-medium shadow-lg hover:scale-105 cursor-pointer"
                style={{ backgroundColor: '#BBD8A3' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7A9520'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8AA624'}
              >
                Next 
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberTest;
