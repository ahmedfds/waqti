import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../components/Button';

interface AdmissionTestStepProps {
  formData: {
    completed: boolean;
    score?: number;
    answers: Record<string, string | string[]>;
  };
  onUpdate: (data: any) => void;
}

const AdmissionTestStep: React.FC<AdmissionTestStepProps> = ({ formData, onUpdate }) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(formData.answers || {});

  const questions = [
    {
      id: 'reviews_handling',
      type: 'radio',
      question: 'كيف تتعامل مع التقييمات العملاء؟',
      options: [
        'عدم الاهتمام بالتقييمات السلبية وتجاهلها',
        'الرد بشكل دفاعي على التقييمات السلبية وإظهار الخطأ في تقييم العميل',
        'التواصل مع الدعم الفني وطلب حذف التقييمات السلبية',
        'الامتنان للتقييمات الإيجابية والاستفادة من التقييمات السلبية لتحسين المشاريع المستقبلية'
      ],
      correctAnswer: 'الامتنان للتقييمات الإيجابية والاستفادة من التقييمات السلبية لتحسين المشاريع المستقبلية'
    },
    {
      id: 'client_relationships',
      type: 'radio',
      question: 'كيف تبني علاقات ناجحة وطويلة الأمد مع عملائك؟',
      options: [
        'إكمال المشاريع في أسرع وقت ممكن حتى لو كان ذلك يعني المساومة على الجودة',
        'التواصل بانتظام والاستماع بفعالية لاحتياجاتهم وتقديم عمل متقن',
        'تجاهل ملاحظات العملاء واتخاذ القرارات بناءً على تفضيلاتك وخبرتك فقط',
        'الامتنان للتقييمات الإيجابية والاستفادة من التقييمات السلبية لتحسين المشاريع المستقبلية'
      ],
      correctAnswer: 'التواصل بانتظام والاستماع بفعالية لاحتياجاتهم وتقديم عمل متقن'
    },
    {
      id: 'project_priority',
      type: 'radio',
      question: 'أي من الأمور التالية يجب أن تعطي الأولوية عند التقدم إلى مشروع؟',
      options: [
        'تقديم عرض عام دون تخصيصه',
        'تقديم معلومات عامة عن مهاراتك حتى لو لم تكن متعلقة بالمشروع',
        'إظهار فهم واضح مع العميل تم الاتفاق مع بعد بدء التنفيذ',
        'تحديد ميزانية منخفضة لزيادة فرصة الاختيار'
      ],
      correctAnswer: 'إظهار فهم واضح مع العميل تم الاتفاق مع بعد بدء التنفيذ'
    },
    {
      id: 'negative_reviews_causes',
      type: 'checkbox',
      question: 'ما أسباب الحصول على تقييمات سلبية؟',
      options: [
        'التقدم على مستقل لا نتقن العمل عليها',
        'الاهتمام بملاحظات العملاء والانفتاح على المراجعات أو التحسينات',
        'إبرام اتفاق غير واضح مع العميل تم الاتفاق معه بعد بدء التنفيذ',
        'التأثر بتسليم المشروع'
      ],
      correctAnswers: [
        'التقدم على مستقل لا نتقن العمل عليها',
        'إبرام اتفاق غير واضح مع العميل تم الاتفاق معه بعد بدء التنفيذ',
        'التأثر بتسليم المشروع'
      ]
    }
  ];

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    onUpdate({ ...formData, answers: newAnswers });
  };

  const handleRadioChange = (questionId: string, value: string) => {
    handleAnswerChange(questionId, value);
  };

  const handleCheckboxChange = (questionId: string, value: string, checked: boolean) => {
    const currentAnswers = (answers[questionId] as string[]) || [];
    const newAnswers = checked
      ? [...currentAnswers, value]
      : currentAnswers.filter(answer => answer !== value);
    handleAnswerChange(questionId, newAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    let totalQuestions = questions.length;

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (question.type === 'radio') {
        if (userAnswer === question.correctAnswer) {
          score += 1;
        }
      } else if (question.type === 'checkbox') {
        const userAnswers = userAnswer as string[] || [];
        const correctAnswers = question.correctAnswers || [];
        const correctCount = userAnswers.filter(answer => correctAnswers.includes(answer)).length;
        const incorrectCount = userAnswers.filter(answer => !correctAnswers.includes(answer)).length;
        const questionScore = Math.max(0, (correctCount - incorrectCount) / correctAnswers.length);
        score += questionScore;
      }
    });

    return Math.round((score / totalQuestions) * 100);
  };

  const completeTest = () => {
    const score = calculateScore();
    onUpdate({
      ...formData,
      completed: true,
      score,
      answers
    });
  };

  const isTestComplete = () => {
    return questions.every(question => {
      const answer = answers[question.id];
      if (question.type === 'radio') {
        return answer && answer !== '';
      } else if (question.type === 'checkbox') {
        return answer && (answer as string[]).length > 0;
      }
      return false;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">إكمال معلومات الحساب</h2>
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-4">{question.question}</h3>
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-start gap-2 text-sm text-blue-800">
                      <input
                        type={question.type}
                        name={question.type === 'radio' ? question.id : undefined}
                        checked={
                          question.type === 'radio'
                            ? answers[question.id] === option
                            : ((answers[question.id] as string[]) || []).includes(option)
                        }
                        onChange={(e) => {
                          if (question.type === 'radio') {
                            handleRadioChange(question.id, option);
                          } else {
                            handleCheckboxChange(question.id, option, e.target.checked);
                          }
                        }}
                        className="mt-1 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="leading-relaxed">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {formData.completed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Test Completed!</h3>
              <p className="text-sm text-green-800">
                Your score: {formData.score}% - {formData.score >= 70 ? 'Passed' : 'Needs Review'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!formData.completed && (
        <div className="text-center">
          <Button
            onClick={completeTest}
            disabled={!isTestComplete()}
            className="bg-[#2E86AB] text-white px-8 py-3 rounded-lg hover:bg-[#1e5f7a] disabled:opacity-50"
          >
            Complete Test
          </Button>
          {!isTestComplete() && (
            <p className="text-sm text-red-600 mt-2">Please answer all questions to complete the test</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdmissionTestStep;