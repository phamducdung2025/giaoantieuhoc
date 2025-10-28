import React from 'react';
import type { LessonPlanInput } from '../types';
import { SUBJECTS, GRADES, BOOK_SETS } from '../constants';

interface InputFormProps {
  inputData: LessonPlanInput;
  setInputData: React.Dispatch<React.SetStateAction<LessonPlanInput>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

interface InputFieldProps {
  id: keyof LessonPlanInput;
  label: string;
  icon: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  type?: string;
  as?: 'input' | 'textarea' | 'select';
  options?: string[];
}

const InputField: React.FC<InputFieldProps> = ({ id, label, icon, value, onChange, placeholder, type = 'text', as = 'input', options }) => {
  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    className: "w-full pl-10 pr-3 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition"
  };

  const Icon = <i className={`fa-solid ${icon} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400`}></i>;

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      {Icon}
      {as === 'textarea' ? (
        <textarea {...commonProps} rows={4} />
      ) : as === 'select' ? (
        <select {...commonProps}>
          {options?.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input {...commonProps} type={type} />
      )}
    </div>
  );
};

export const InputForm: React.FC<InputFormProps> = ({ inputData, setInputData, onGenerate, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputData(prev => ({ ...prev, [name]: value }));
  };
  
  const isFormValid = 
    inputData.lessonTitle.trim() !== '' &&
    inputData.periods.trim() !== '' &&
    inputData.teacherName.trim() !== '' &&
    inputData.schoolName.trim() !== '';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-8 sticky top-24 relative">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Thông tin Giáo án</h2>
        <p className="text-gray-500 mt-1">Cung cấp thông tin để AI bắt đầu sáng tạo.</p>
      </div>

      <InputSection title="Thông tin cơ bản">
        <InputField id="subject" label="Môn học" icon="fa-book" value={inputData.subject} onChange={handleChange} as="select" options={SUBJECTS} />
        <InputField id="grade" label="Lớp" icon="fa-users" value={inputData.grade} onChange={handleChange} as="select" options={GRADES} />
        <InputField id="bookSet" label="Bộ sách" icon="fa-swatchbook" value={inputData.bookSet} onChange={handleChange} as="select" options={BOOK_SETS} />
        <InputField id="lessonTitle" label="Tên bài học" icon="fa-bookmark" value={inputData.lessonTitle} onChange={handleChange} placeholder="Tên bài dạy" />
        <InputField id="periods" label="Số tiết" icon="fa-hourglass-half" value={inputData.periods} onChange={handleChange} placeholder="Số tiết dạy" type="number" />
      </InputSection>
      
      <InputSection title="Thông tin chi tiết">
        <InputField id="teacherName" label="Người dạy" icon="fa-user" value={inputData.teacherName} onChange={handleChange} placeholder="Họ và tên giáo viên" />
        <InputField id="schoolName" label="Đơn vị" icon="fa-school" value={inputData.schoolName} onChange={handleChange} placeholder="Đơn vị trường công tác" />
        <div className="grid grid-cols-2 gap-4">
            <InputField id="prepDate" label="Ngày soạn" icon="fa-calendar-pen" value={inputData.prepDate} onChange={handleChange} type="date" />
            <InputField id="teachingDate" label="Ngày dạy" icon="fa-calendar-day" value={inputData.teachingDate} onChange={handleChange} type="date" />
        </div>
      </InputSection>
      
      <button 
        onClick={onGenerate}
        disabled={isLoading || !isFormValid}
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 ease-in-out flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
            <span>Tạo giáo án với AI</span>
          </>
        )}
      </button>
    </div>
  );
};