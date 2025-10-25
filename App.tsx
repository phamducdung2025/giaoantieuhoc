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
    <div className="min-h-screen font-sans text-gray-800">
      <Header />
      <main className="p-4 md:p-8">
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
      <footer className="text-center p-4 text-sm text-gray-500">
        <p>Trung tâm Tin học ứng dụng Bai Digitech</p>
      </footer>
    </div>
  );
};

export default App;