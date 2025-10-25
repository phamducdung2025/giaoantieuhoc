import { GoogleGenAI, Type } from "@google/genai";
import type { LessonPlanInput, GeneratedLessonPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        tieuDe: { type: Type.STRING },
        monHoc: { type: Type.STRING },
        lop: { type: Type.STRING },
        soTiet: { type: Type.STRING },
        thoiGianThucHien: { type: Type.STRING },
        yeuCauCanDat: { type: Type.ARRAY, items: { type: Type.STRING } },
        doDungDayHoc: {
            type: Type.OBJECT,
            properties: {
                giaoVien: { type: Type.ARRAY, items: { type: Type.STRING } },
                hocSinh: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        },
        hoatDong: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    ten: { type: Type.STRING },
                    thoiGian: { type: Type.STRING },
                    hoatDongGV: { type: Type.STRING },
                    hoatDongHS: { type: Type.STRING },
                },
            },
        },
        dieuChinh: { type: Type.STRING },
    },
};

const callGemini = async (prompt: string): Promise<GeneratedLessonPlan> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });
        
        const jsonText = response.text.trim();
        const lessonPlan: GeneratedLessonPlan = JSON.parse(jsonText);
        return lessonPlan;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to process request with Gemini.");
    }
}

export async function generateLessonPlan(inputs: LessonPlanInput): Promise<GeneratedLessonPlan> {
  const prompt = `
Bạn là một trợ lý AI chuyên tạo giáo án cho giáo viên tiểu học tại Việt Nam.
Nhiệm vụ của bạn là tạo một kế hoạch bài dạy chi tiết dựa trên các thông tin sau:
- Môn học: ${inputs.subject}
- Lớp: ${inputs.grade}
- Tên bài học: ${inputs.lessonTitle}
- Số tiết: ${inputs.periods}
- Ngày dạy: ${inputs.teachingDate}

Hãy tạo giáo án tuân thủ nghiêm ngặt theo cấu trúc của Công văn 2345 của Bộ Giáo dục và Đào tạo.
Cấu trúc đầu ra phải là một đối tượng JSON. Nội dung phải sáng tạo, hấp dẫn, phù hợp với lứa tuổi học sinh tiểu học.

QUAN TRỌNG: Đối với mục "hoatDong" (Các hoạt động dạy học chủ yếu):
1.  Hãy chia nhỏ "hoatDongGV" (hoạt động của giáo viên) và "hoatDongHS" (hoạt động của học sinh) thành các bước hành động cụ thể, tương ứng với nhau.
2.  Mỗi bước hành động phải nằm trên một dòng riêng, sử dụng ký tự xuống dòng ('\\n') để phân tách.
3.  **BẮT BUỘC**: Số lượng dòng trong "hoatDongGV" phải BẰNG CHÍNH XÁC số lượng dòng trong "hoatDongHS" để các hành động tương ứng với nhau theo từng hàng.

Ví dụ cho một hoạt động:
"hoatDongGV": "Tổ chức trò chơi 'Ai nhanh hơn' với các phép cộng trừ trong phạm vi 10.\\nChiếu các phép tính lên màn hình, yêu cầu học sinh giơ thẻ kết quả hoặc hô to đáp án.\\nKhen ngợi, động viên học sinh.",
"hoatDongHS": "Tham gia trò chơi một cách hào hứng.\\nTính nhẩm nhanh và giơ thẻ kết quả hoặc hô to đáp án.\\nSẵn sàng cho bài học mới."
`;
  return callGemini(prompt);
}

export async function editLessonPlan(currentPlan: GeneratedLessonPlan, editPrompt: string): Promise<GeneratedLessonPlan> {
    const prompt = `
Bạn là một trợ lý AI chuyên chỉnh sửa giáo án cho giáo viên tiểu học tại Việt Nam.
Đây là giáo án hiện tại ở định dạng JSON:
${JSON.stringify(currentPlan)}

Giáo viên có một yêu cầu chỉnh sửa như sau:
"${editPrompt}"

Nhiệm vụ của bạn là cập nhật lại giáo án dựa trên yêu cầu này. Hãy trả về TOÀN BỘ giáo án đã được cập nhật, giữ nguyên định dạng JSON ban đầu.
LƯU Ý QUAN TRỌNG: Khi cập nhật mục "hoatDong", hãy đảm bảo tuân thủ quy tắc sau:
1.  Chia nhỏ "hoatDongGV" và "hoatDongHS" thành các bước hành động trên từng dòng riêng biệt (sử dụng '\\n').
2.  Số lượng dòng của "hoatDongGV" và "hoatDongHS" phải bằng nhau.
Không thêm bất kỳ văn bản giải thích nào ngoài đối tượng JSON.
`;
    return callGemini(prompt);
}