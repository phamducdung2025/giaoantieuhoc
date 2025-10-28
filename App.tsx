import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { Header } from './components/Header';
import type { LessonPlanInput, GeneratedLessonPlan } from './types';
import { generateLessonPlan, editLessonPlan } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<GeneratedLessonPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [inputData, setInputData] = useState<LessonPlanInput>({
    subject: 'Toán',
    grade: 'Lớp 1',
    bookSet: 'Kết nối tri thức với cuộc sống',
    lessonTitle: '',
    periods: '',
    teacherName: '',
    schoolName: '',
    prepDate: new Date().toISOString().split('T')[0],
    teachingDate: new Date().toISOString().split('T')[0],
  });

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setLessonPlan(null);
    try {
      const generatedPlan = await generateLessonPlan(inputData);
      setLessonPlan(generatedPlan);
    // Fix: Added curly braces to the catch block to fix a syntax error and ensure all statements within it are executed correctly.
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi tạo giáo án. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [inputData]);

  const handleEdit = useCallback(async (editPrompt: string) => {
    if (!lessonPlan) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedPlan = await editLessonPlan(lessonPlan, editPrompt);
      setLessonPlan(updatedPlan);
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi chỉnh sửa giáo án. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [lessonPlan]);


  return (
    <>
      {isLoading && !lessonPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-semibold">AI đang sáng tạo nội dung, hãy kiên nhẫn...</p>
        </div>
      )}
      <div className="min-h-screen font-sans text-gray-900 flex flex-col">
        <Header />
        <main className="p-4 md:p-8 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-screen-2xl mx-auto">
            <div className="lg:col-span-4 xl:col-span-3">
              <InputForm 
                inputData={inputData}
                setInputData={setInputData}
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              <OutputDisplay 
                lessonPlan={lessonPlan}
                isLoading={isLoading}
                error={error}
                teacherName={inputData.teacherName}
                schoolName={inputData.schoolName}
                onEdit={handleEdit}
              />
            </div>
          </div>
        </main>
        <footer className="text-center p-4 text-sm text-gray-600">
          <p>Ứng dụng này được phát triển bởi <a href="#" className="font-semibold text-black hover:underline">@Thầy Dũng</a></p>
        </footer>
      </div>
    </>
  );
};

export default App;