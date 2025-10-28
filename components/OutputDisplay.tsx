import React, { useState } from 'react';
import type { GeneratedLessonPlan } from '../types';

interface OutputDisplayProps {
  lessonPlan: GeneratedLessonPlan | null;
  isLoading: boolean;
  error: string | null;
  teacherName: string;
  schoolName: string;
  onEdit: (prompt: string) => void;
}

const formatText = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

const formatHTML = (text: string) => {
    if (!text) return '';
    return text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

const formatLessonPlanToText = (plan: GeneratedLessonPlan, teacher: string, school: string): string => {
    let text = `KẾ HOẠCH BÀI DẠY\n\n`;
    text += `Môn học: ${plan.monHoc}\n`;
    text += `Lớp: ${plan.lop}\n`;
    text += `Tên bài học: ${plan.tieuDe}\n`;
    text += `Số tiết: ${plan.soTiet}\n`;
    text += `Thời gian thực hiện: ${plan.thoiGianThucHien}\n`;
    text += `Người soạn: ${teacher}\n`;
    text += `Đơn vị: ${school}\n\n`;

    text += `I. YÊU CẦU CẦN ĐẠT\n`;
    text += `1. Kiến thức & Kĩ năng:\n`;
    plan.yeuCauCanDat.kienThucKyNang.forEach(item => text += `- ${item}\n`);
    text += `2. Năng lực:\n`;
    text += `  - Năng lực chung: ${plan.yeuCauCanDat.nangLuc.chung.join(', ')}\n`;
    text += `  - Năng lực đặc thù: ${plan.yeuCauCanDat.nangLuc.dacThu.join(', ')}\n`;
    text += `3. Phẩm chất:\n`;
    plan.yeuCauCanDat.phamChat.forEach(item => text += `- ${item}\n`);
    text += `\n`;

    text += `II. ĐỒ DÙNG DẠY HỌC\n`;
    text += `1. Đối với giáo viên:\n`;
    (plan.doDungDayHoc?.giaoVien || []).forEach(item => text += `- ${item}\n`);
    text += `2. Đối với học sinh:\n`;
    (plan.doDungDayHoc?.hocSinh || []).forEach(item => text += `- ${item}\n`);
    text += `\n`;

    text += `III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU\n`;
    plan.hoatDong.forEach(activity => {
        text += `\n${activity.ten.toUpperCase()}\n`;
        text += `- Mục tiêu: ${activity.mucTieu}\n`;
        text += `- Thời gian: ${activity.thoiGian}\n`;
        text += `- Hoạt động của giáo viên:\n${formatText(activity.hoatDongGiaoVien)}\n`;
        text += `- Hoạt động của học sinh:\n${formatText(activity.hoatDongHocSinh)}\n`;
    });
    text += `\n`;

    text += `IV. ĐIỀU CHỈNH SAU BÀI DẠY (nếu có)\n`;
    text += `${plan.dieuChinh || 'Không có'}\n`;
    
    return text;
};

const formatLessonPlanToHTML = (plan: GeneratedLessonPlan, teacher: string, school: string): string => {
    const styles = `
        <style>
            body { font-family: 'Times New Roman', serif; line-height: 1.5; font-size: 12pt; }
            h1, h2, h3 { font-weight: bold; }
            h1 { text-align: center; font-size: 16pt; }
            h2 { font-size: 14pt; margin-top: 1em; }
            h3 { font-size: 13pt; margin-top: 0.5em;}
            p, li, td, th { font-size: 12pt; }
            ul { margin-top: 0.2em; padding-left: 20px; }
            .school-info { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 1em; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
            th { background-color: #f2f2f2; }
            .activity-header { background-color: #f3f4f6; font-weight: bold; }
        </style>
    `;
    let html = `
        <html><head><meta charset="UTF-8">${styles}</head><body>
        <div class="school-info">
            <p><strong>${school.toUpperCase()}</strong></p>
            <p><strong>Giáo viên: ${teacher}</strong></p>
        </div>
        <h1>KẾ HOẠCH BÀI DẠY</h1>
        <p><strong>Môn học/Hoạt động giáo dục:</strong> ${plan.monHoc}</p>
        <p><strong>Lớp:</strong> ${plan.lop}</p>
        <p><strong>Tên bài học:</strong> ${plan.tieuDe}</p>
        <p><strong>Số tiết:</strong> ${plan.soTiet}</p>
        <p><strong>Thời gian thực hiện:</strong> ${plan.thoiGianThucHien}</p>
        
        <h2>I. YÊU CẦU CẦN ĐẠT</h2>
        <h3>1. Về kiến thức, kĩ năng</h3>
        <ul>${plan.yeuCauCanDat.kienThucKyNang.map(item => `<li>${item}</li>`).join('')}</ul>
        <h3>2. Về phát triển năng lực</h3>
        <ul>
            <li><strong>Năng lực chung:</strong> ${plan.yeuCauCanDat.nangLuc.chung.join(', ')}</li>
            <li><strong>Năng lực đặc thù:</strong> ${plan.yeuCauCanDat.nangLuc.dacThu.join(', ')}</li>
        </ul>
        <h3>3. Về phẩm chất</h3>
        <ul>${plan.yeuCauCanDat.phamChat.map(item => `<li>${item}</li>`).join('')}</ul>
        
        <h2>II. ĐỒ DÙNG DẠY HỌC</h2>
        <h3>1. Đối với giáo viên:</h3>
        <ul>${(plan.doDungDayHoc?.giaoVien || []).map(item => `<li>${item}</li>`).join('')}</ul>
        <h3>2. Đối với học sinh:</h3>
        <ul>${(plan.doDungDayHoc?.hocSinh || []).map(item => `<li>${item}</li>`).join('')}</ul>

        <h2>III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU</h2>
        <table>
            <thead>
                <tr>
                    <th>Thời gian</th>
                    <th>Hoạt động của giáo viên</th>
                    <th>Hoạt động của học sinh</th>
                </tr>
            </thead>
            <tbody>
            ${plan.hoatDong.map(activity => `
                <tr>
                    <td colspan="3" class="activity-header">
                        ${activity.ten.toUpperCase()}<br>
                        <em><strong>Mục tiêu:</strong> ${activity.mucTieu}</em>
                    </td>
                </tr>
                <tr>
                    <td>${activity.thoiGian}</td>
                    <td>${formatHTML(activity.hoatDongGiaoVien)}</td>
                    <td>${formatHTML(activity.hoatDongHocSinh)}</td>
                </tr>
            `).join('')}
            </tbody>
        </table>

        <h2>IV. ĐIỀU CHỈNH SAU BÀI DẠY (nếu có)</h2>
        <p>${plan.dieuChinh || 'Không có'}</p>
        </body></html>
    `;
    return html;
};

const SuggestionButton: React.FC<{onSuggest: (prompt: string) => void, children: React.ReactNode}> = ({ onSuggest, children }) => (
    <button
        onClick={() => onSuggest(children as string)}
        className="px-3 py-1.5 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold hover:bg-teal-200 transition-colors"
    >
        {children}
    </button>
);


export const OutputDisplay: React.FC<OutputDisplayProps> = ({ lessonPlan, isLoading, error, teacherName, schoolName, onEdit }) => {
  const [editPrompt, setEditPrompt] = useState('');

  const handleEditSubmit = () => {
    if (editPrompt.trim()) {
      onEdit(editPrompt);
      setEditPrompt('');
    }
  };

  const copyToClipboard = () => {
    if (lessonPlan) {
      navigator.clipboard.writeText(formatLessonPlanToText(lessonPlan, teacherName, schoolName));
      alert('Đã sao chép vào clipboard!');
    }
  };

  const downloadDoc = () => {
    if (lessonPlan) {
      const htmlContent = formatLessonPlanToHTML(lessonPlan, teacherName, schoolName);
      const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GiaoAn_${lessonPlan.tieuDe.replace(/\s+/g, '_')}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-600">
          <i className="fa-solid fa-circle-exclamation text-4xl"></i>
          <p className="mt-4 text-lg font-semibold">Lỗi!</p>
          <p>{error}</p>
        </div>
      );
    }

    if (lessonPlan) {
      return (
        <div className="prose max-w-none">
          {isLoading && ( // Small loading indicator when editing
            <div className="sticky top-0 bg-white/50 backdrop-blur-sm p-2 text-center text-sm text-gray-800 z-10 font-semibold rounded-t-lg">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i> AI đang cập nhật giáo án...
            </div>
          )}
          <div className="text-center mb-6">
            <p><strong>{schoolName.toUpperCase()}</strong></p>
            <p><strong>Giáo viên: {teacherName}</strong></p>
          </div>
          <h1 className="text-center text-2xl font-bold uppercase">Kế hoạch bài dạy</h1>
          <p><strong>Môn học/Hoạt động giáo dục:</strong> {lessonPlan.monHoc}</p>
          <p><strong>Lớp:</strong> {lessonPlan.lop}</p>
          <p><strong>Tên bài học:</strong> {lessonPlan.tieuDe}</p>
          <p><strong>Số tiết:</strong> {lessonPlan.soTiet}</p>
          <p><strong>Thời gian thực hiện:</strong> {lessonPlan.thoiGianThucHien}</p>
          
          <h2 className="font-bold text-lg mt-6">I. YÊU CẦU CẦN ĐẠT</h2>
          <div className="pl-4">
              <h3 className="font-semibold mt-2">1. Kiến thức & Kĩ năng:</h3>
              <ul className="list-disc pl-5">
                  {lessonPlan.yeuCauCanDat.kienThucKyNang.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
              <h3 className="font-semibold mt-2">2. Năng lực:</h3>
              <ul className="list-disc pl-5">
                  <li><strong>Năng lực chung:</strong> {lessonPlan.yeuCauCanDat.nangLuc.chung.join(', ')}</li>
                  <li><strong>Năng lực đặc thù:</strong> {lessonPlan.yeuCauCanDat.nangLuc.dacThu.join(', ')}</li>
              </ul>
              <h3 className="font-semibold mt-2">3. Phẩm chất:</h3>
              <ul className="list-disc pl-5">
                  {lessonPlan.yeuCauCanDat.phamChat.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
          </div>
          
          <h2 className="font-bold text-lg mt-6">II. ĐỒ DÙNG DẠY HỌC</h2>
          <div className="pl-4">
              <h3 className="font-semibold mt-2">1. Đối với giáo viên:</h3>
              <ul className="list-disc pl-5">
                  {lessonPlan.doDungDayHoc?.giaoVien?.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
              <h3 className="font-semibold mt-2">2. Đối với học sinh:</h3>
              <ul className="list-disc pl-5">
                  {lessonPlan.doDungDayHoc?.hocSinh?.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
          </div>
          
          <h2 className="font-bold text-lg mt-6">III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU</h2>
            <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-400">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="border border-gray-400 p-2 w-[15%] text-gray-900">Thời gian</th>
                            <th className="border border-gray-400 p-2 w-[42.5%] text-gray-900">Hoạt động của giáo viên</th>
                            <th className="border border-gray-400 p-2 w-[42.5%] text-gray-900">Hoạt động của học sinh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessonPlan.hoatDong.map((activity, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td colSpan={3} className="border border-gray-400 p-2 bg-gray-100 font-bold text-black">
                                        {activity.ten.toUpperCase()}
                                        <p className="font-normal italic text-sm mt-1"><strong>Mục tiêu:</strong> {activity.mucTieu}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-400 p-2 align-top text-gray-900">{activity.thoiGian}</td>
                                    <td className="border border-gray-400 p-2 align-top prose-p:my-1 text-gray-900" dangerouslySetInnerHTML={{ __html: formatHTML(activity.hoatDongGiaoVien) }}></td>
                                    <td className="border border-gray-400 p-2 align-top prose-p:my-1 text-gray-900" dangerouslySetInnerHTML={{ __html: formatHTML(activity.hoatDongHocSinh) }}></td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

          <h2 className="font-bold text-lg mt-6">IV. ĐIỀU CHỈNH SAU BÀI DẠY (nếu có)</h2>
          <p>{lessonPlan.dieuChinh || "Không có"}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="bg-gray-100 p-6 rounded-full">
            <i className="fa-solid fa-book-open-reader text-5xl text-gray-600"></i>
        </div>
        <p className="mt-4 text-xl font-bold text-black">Giáo án của bạn sẽ xuất hiện ở đây</p>
        <p className="text-gray-600 mt-1">Điền thông tin và nhấn "Tạo giáo án với AI" để bắt đầu sáng tạo.</p>
      </div>
    );
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[80vh] flex flex-col relative">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold">Kế hoạch Giảng dạy</h2>
          {lessonPlan && !isLoading && (
              <div className="flex space-x-2">
                  <button onClick={copyToClipboard} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm font-semibold flex items-center"><i className="fa-solid fa-copy mr-2"></i>Sao chép</button>
                  <button onClick={downloadDoc} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-semibold flex items-center"><i className="fa-solid fa-download mr-2"></i>Tải về (.doc)</button>
              </div>
          )}
      </div>
      <div className={`flex-grow ${!lessonPlan ? 'flex flex-col items-center justify-center' : ''} overflow-y-auto pb-40`}>
        {renderContent()}
      </div>

      {lessonPlan && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200">
           <div className="max-w-3xl mx-auto mb-3">
            <div className="flex flex-wrap gap-2 justify-center">
              <SuggestionButton onSuggest={onEdit}>Thêm hoạt động khởi động vui nhộn</SuggestionButton>
              <SuggestionButton onSuggest={onEdit}>Đơn giản hóa phần Khám phá</SuggestionButton>
              <SuggestionButton onSuggest={onEdit}>Thêm bài tập vận dụng thực tế</SuggestionButton>
              <SuggestionButton onSuggest={onEdit}>Tăng tính tương tác ở phần Luyện tập</SuggestionButton>
            </div>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleEditSubmit()}
              placeholder="Yêu cầu AI chỉnh sửa giáo án (ví dụ: 'thêm câu hỏi gợi mở cho học sinh')..."
              disabled={isLoading}
              className="w-full py-3 pl-4 pr-14 text-gray-800 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition disabled:bg-gray-100"
            />
            <button
              onClick={handleEditSubmit}
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Gửi yêu cầu chỉnh sửa"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};