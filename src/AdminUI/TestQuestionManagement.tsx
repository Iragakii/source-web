import React, { useState, useEffect } from 'react';
import { testQuestionService, type TestQuestion } from '../services/testQuestionService';

const TestQuestionManagement: React.FC = () => {
  type CourseType = 'IT' | 'Cybersecurity';

  const [courseType, setCourseType] = useState<CourseType>('IT');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<TestQuestion | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load questions from API
  const loadQuestions = async (testType: CourseType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await testQuestionService.getQuestions(testType);
      if (response.success && response.data) {
        setQuestions(response.data);
      } else {
        setError(response.message || 'Failed to load questions');
        setQuestions([]);
      }
    } catch (err) {
      setError('Network error occurred while loading questions');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(courseType);
    setEditingQuestion(null);
    resetForm();
  }, [courseType]);

  // Load default question for editing when no questions exist
  useEffect(() => {
    if (questions.length === 0 && !isLoading && !error) {
      const defaultQuestion: TestQuestion = {
        id: 0,
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        explanation: 'Paris is the capital and most populous city of France.',
        testType: courseType
      };
      setEditingQuestion(defaultQuestion);
      setFormData({
        question: defaultQuestion.question,
        options: defaultQuestion.options,
        correctAnswer: defaultQuestion.correctAnswer,
        explanation: defaultQuestion.explanation || ''
      });
      setIsFormVisible(true);
    }
  }, [questions, isLoading, error, courseType]);

  const resetForm = () => {
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const handleInputChange = (field: string, value: string | number, index?: number) => {
    if (field === 'options' && typeof index === 'number') {
      const newOptions = [...formData.options];
      newOptions[index] = value as string;
      setFormData({ ...formData, options: newOptions });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleEdit = (question: TestQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || ''
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await testQuestionService.deleteQuestion(id);
      if (response.success) {
        // Remove from local state
        setQuestions(questions.filter(q => q.id !== id));
        alert('Question deleted successfully!');
      } else {
        alert(response.message || 'Failed to delete question');
      }
    } catch (err) {
      alert('Network error occurred while deleting question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || formData.options.some(opt => !opt.trim())) {
      alert('Please fill in all question and option fields.');
      return;
    }

    setIsLoading(true);
    try {
      if (editingQuestion) {
        // Update existing question
        const updateData = {
          id: editingQuestion.id,
          question: formData.question,
          options: formData.options,
          correctAnswer: formData.correctAnswer,
          explanation: formData.explanation,
          testType: courseType
        };

        const response = await testQuestionService.updateQuestion(updateData);
        if (response.success && response.data) {
          // Update local state
          setQuestions(questions.map(q =>
            q.id === editingQuestion.id ? response.data! : q
          ));
          alert('Question updated successfully!');
        } else {
          alert(response.message || 'Failed to update question');
          return;
        }
      } else {
        // Create new question
        const createData = {
          question: formData.question,
          options: formData.options,
          correctAnswer: formData.correctAnswer,
          explanation: formData.explanation,
          testType: courseType
        };

        const response = await testQuestionService.createQuestion(createData);
        if (response.success && response.data) {
          // Add to local state
          setQuestions([...questions, response.data]);
          alert('Question created successfully!');
        } else {
          alert(response.message || 'Failed to create question');
          return;
        }
      }

      setEditingQuestion(null);
      resetForm();
      setIsFormVisible(false);
    } catch (err) {
      alert('Network error occurred while saving question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    resetForm();
    setIsFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-black text-[#61dca3] p-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-mono font-bold text-[#61dca3] border-b-2 border-[#61dca3] pb-2">
            [ TEST QUESTION MANAGEMENT ]
          </h1>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="bg-[#61dca3] text-black font-mono px-6 py-3 rounded border-2 border-[#61dca3] hover:bg-[#009990] hover:border-[#009990] hover:text-[#61dca3] transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            {isFormVisible ? '[ HIDE FORM ]' : '[ ADD NEW QUESTION ]'}
          </button>
        </div>

        <div className="mb-8 bg-[#009990]/20 border-2 border-[#61dca3] rounded-lg p-6">
          <label className="mr-4 font-mono text-lg text-[#61dca3]">Select Test Type:</label>
          <select
            value={courseType}
            onChange={e => setCourseType(e.target.value as CourseType)}
            className="bg-black border-2 border-[#61dca3] text-[#61dca3] font-mono px-4 py-2 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300 cursor-pointer"
          >
            <option value="IT" className="bg-black text-[#61dca3]">IT Fundamentals</option>
            <option value="Cybersecurity" className="bg-black text-[#61dca3]">Cybersecurity</option>
          </select>
        </div>

        {isFormVisible && (
          <form onSubmit={handleSubmit} className="mb-8 bg-black/80 border-2 border-[#61dca3] rounded-lg p-6">
            <h2 className="text-2xl font-mono font-bold text-[#61dca3] mb-6 border-b border-[#61dca3] pb-2">
              {editingQuestion ? '[ EDIT QUESTION ]' : '[ ADD NEW QUESTION ]'}
            </h2>

            <div className="mb-6">
              <label className="block font-mono text-lg text-[#61dca3] mb-2">Question Text</label>
              <textarea
                value={formData.question}
                onChange={e => handleInputChange('question', e.target.value)}
                className="w-full bg-black border-2 border-[#61dca3] text-[#61dca3] font-mono rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#61dca3] focus:border-transparent"
                rows={4}
                required
                placeholder="Enter your question here..."
              />
            </div>

            <div className="mb-6">
              <label className="block font-mono text-lg text-[#61dca3] mb-2">Options</label>
              {formData.options.map((option, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={option}
                  onChange={e => handleInputChange('options', e.target.value, idx)}
                  className="w-full mb-3 bg-black border-2 border-[#61dca3] text-[#61dca3] font-mono rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#61dca3] focus:border-transparent"
                  placeholder={`Option ${idx + 1}`}
                  required
                />
              ))}
            </div>

            <div className="mb-6">
              <label className="block font-mono text-lg text-[#61dca3] mb-2">Correct Answer</label>
              <select
                value={formData.correctAnswer}
                onChange={e => handleInputChange('correctAnswer', Number(e.target.value))}
                className="bg-black border-2 border-[#61dca3] text-[#61dca3] font-mono px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#61dca3] focus:border-transparent"
              >
                {formData.options.map((_, idx) => (
                  <option key={idx} value={idx} className="bg-black text-[#61dca3]">
                    Option {idx + 1}
                  </option>
                ))}
              </select>
            </div>

            {courseType === 'Cybersecurity' && (
              <div className="mb-6">
                <label className="block font-mono text-lg text-[#61dca3] mb-2">Explanation (optional)</label>
                <textarea
                  value={formData.explanation}
                  onChange={e => handleInputChange('explanation', e.target.value)}
                  className="w-full bg-black border-2 border-[#61dca3] text-[#61dca3] font-mono rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#61dca3] focus:border-transparent"
                  rows={3}
                  placeholder="Provide an explanation for the correct answer..."
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-[#61dca3] text-black font-mono px-6 py-3 rounded border-2 border-[#61dca3] hover:bg-[#009990] hover:border-[#009990] hover:text-[#61dca3] transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                {editingQuestion ? '[ UPDATE QUESTION ]' : '[ ADD QUESTION ]'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-transparent border-2 border-[#61dca3] text-[#61dca3] font-mono px-6 py-3 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                [ CANCEL ]
              </button>
            </div>
          </form>
        )}

        <div className="bg-black/80 border-2 border-[#61dca3] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#61dca3]">
            <h2 className="text-2xl font-mono font-bold text-[#61dca3]">
              [ QUESTIONS LIST ] ({questions.length})
            </h2>
            {isLoading && (
              <div className="mt-4 text-[#61dca3] font-mono">
                [ LOADING QUESTIONS... ]
              </div>
            )}
            {error && (
              <div className="mt-4 text-red-400 font-mono bg-red-900/20 border border-red-400 rounded p-3">
                [ ERROR: {error} ]
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#009990]/30">
                <tr>
                  <th className="border-b border-[#61dca3] px-6 py-4 text-left font-mono text-[#61dca3] font-bold">ID</th>
                  <th className="border-b border-[#61dca3] px-6 py-4 text-left font-mono text-[#61dca3] font-bold">Question</th>
                  <th className="border-b border-[#61dca3] px-6 py-4 text-left font-mono text-[#61dca3] font-bold">Options</th>
                  <th className="border-b border-[#61dca3] px-6 py-4 text-left font-mono text-[#61dca3] font-bold">Correct Answer</th>
                  {courseType === 'Cybersecurity' && (
                    <th className="border-b border-[#61dca3] px-6 py-4 text-left font-mono text-[#61dca3] font-bold">Explanation</th>
                  )}
                  <th className="border-b border-[#61dca3] px-6 py-4 text-left font-mono text-[#61dca3] font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map(q => (
                  <tr key={q.id} className="hover:bg-[#009990]/10 transition-colors duration-200">
                    <td className="border-b border-[#61dca3]/30 px-6 py-4 font-mono text-[#61dca3]">{q.id}</td>
                    <td className="border-b border-[#61dca3]/30 px-6 py-4 font-mono text-[#61dca3] max-w-xs truncate">{q.question}</td>
                    <td className="border-b border-[#61dca3]/30 px-6 py-4">
                      <ul className="font-mono text-[#61dca3] text-sm space-y-1">
                        {q.options.map((opt, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="text-[#009990] mr-2">[{idx + 1}]</span>
                            <span className="truncate">{opt}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border-b border-[#61dca3]/30 px-6 py-4 font-mono text-[#61dca3]">
                      <span className="bg-[#61dca3] text-black px-2 py-1 rounded font-bold">
                        Option {q.correctAnswer + 1}
                      </span>
                    </td>
                    {courseType === 'Cybersecurity' && (
                      <td className="border-b border-[#61dca3]/30 px-6 py-4 font-mono text-[#61dca3] max-w-xs truncate">
                        {q.explanation || 'N/A'}
                      </td>
                    )}
                    <td className="border-b border-[#61dca3]/30 px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(q)}
                          className="bg-[#61dca3] text-black font-mono px-4 py-2 rounded border border-[#61dca3] hover:bg-[#009990] hover:border-[#009990] hover:text-[#61dca3] transition-all duration-300 cursor-pointer transform hover:scale-105"
                          disabled={isLoading}
                        >
                          [ EDIT ]
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="bg-red-600 text-white font-mono px-4 py-2 rounded border border-red-600 hover:bg-red-700 hover:border-red-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
                          disabled={isLoading}
                        >
                          [ DELETE ]
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr>
                    <td colSpan={courseType === 'Cybersecurity' ? 6 : 5} className="text-center py-12 font-mono text-[#61dca3] text-lg">
                      [ NO QUESTIONS AVAILABLE ]
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestQuestionManagement;
