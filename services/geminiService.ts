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
        yeuCauCanDat: {
            type: Type.OBJECT,
            properties: {
                kienThucKyNang: { type: Type.ARRAY, items: { type: Type.STRING } },
                nangLuc: {
                    type: Type.OBJECT,
                    properties: {
                        chung: { type: Type.ARRAY, items: { type: Type.STRING } },
                        dacThu: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["chung", "dacThu"]
                },
                phamChat: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["kienThucKyNang", "nangLuc", "phamChat"]
        },
        doDungDayHoc: {
            type: Type.OBJECT,
            properties: {
                giaoVien: { type: Type.ARRAY, items: { type: Type.STRING } },
                hocSinh: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["giaoVien", "hocSinh"]
        },
        hoatDong: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    ten: { type: Type.STRING },
                    thoiGian: { type: Type.STRING },
                    mucTieu: { type: Type.STRING },
                    hoatDongGiaoVien: { type: Type.STRING, description: "Mô tả chi tiết hoạt động của giáo viên, thể hiện rõ các bước. Sử dụng ký tự xuống dòng '\n' để định dạng." },
                    hoatDongHocSinh: { type: Type.STRING, description: "Mô tả chi tiết hoạt động của học sinh, thể hiện rõ các bước. Sử dụng ký tự xuống dòng '\n' để định dạng." },
                },
                required: ["ten", "thoiGian", "mucTieu", "hoatDongGiaoVien", "hoatDongHocSinh"]
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
#YÊU CẦU SOẠN KẾ HOẠCH BÀI DẠY MẪU

1. VAI TRÒ:
Bạn là một giáo viên dạy giỏi cấp Quốc gia, chuyên về phương pháp giảng dạy tích cực và xây dựng giáo án theo định hướng phát triển năng lực học sinh.

2. THÔNG TIN BÀI DẠY:
- Môn học: ${inputs.subject}
- Lớp: ${inputs.grade}
- Bài học: ${inputs.lessonTitle}
- Bộ sách: ${inputs.bookSet}
- Thời lượng: ${inputs.periods} tiết

3. NHIỆM VỤ:
Soạn thảo một Kế hoạch bài dạy chi tiết, sáng tạo, và chuẩn mực, tuân thủ nghiêm ngặt cấu trúc JSON được yêu cầu và Phụ lục 3 về Hướng dẫn xây dựng Kế hoạch bài dạy.

4. CẤU TRÚC VÀ NỘI DUNG CHI TIẾT (Theo đúng định dạng JSON):

MỤC 1: YÊU CẦU CẦN ĐẠT (yeuCauCanDat)
- Kiến thức & Kĩ năng (kienThucKyNang): Nêu cụ thể học sinh *làm được gì* sau bài học.
- Năng lực (nangLuc):
  - Năng lực chung (chung): Tập trung vào Giao tiếp và Hợp tác, Tự chủ và Tự học.
  - Năng lực đặc thù (dacThu): Tập trung vào Năng lực Ngôn ngữ và Năng lực Văn học (nếu là môn Tiếng Việt) hoặc năng lực phù hợp với môn học.
- Phẩm chất (phamChat): Nhấn mạnh phẩm chất Nhân ái và Chăm chỉ.

MỤC 2: ĐỒ DÙNG DẠY HỌC (doDungDayHoc)
Liệt kê cụ thể, có tính ứng dụng cho giáo viên (giaoVien) và học sinh (hocSinh).

MỤC 3: CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU (hoatDong)
Thiết kế 4 hoạt động theo tiến trình: A. Khởi động -> B. Khám phá -> C. Luyện tập -> D. Vận dụng.
Mỗi hoạt động phải là một object trong array hoatDong, có các trường sau:
- ten: Tên hoạt động (VD: "A. Khởi động")
- thoiGian: Thời gian dự kiến (VD: "5 phút")
- mucTieu: Nêu rõ mục tiêu của hoạt động.
- hoatDongGiaoVien: Mô tả chi tiết, rõ ràng các hành động của GIÁO VIÊN.
- hoatDongHocSinh: Mô tả chi tiết, rõ ràng các hành động của HỌC SINH tương ứng với hoạt động của giáo viên.

QUAN TRỌNG: Nội dung của 'hoatDongGiaoVien' và 'hoatDongHocSinh' khi kết hợp lại phải thể hiện được chuỗi 4 bước:
1. Chuyển giao nhiệm vụ: GV nêu yêu cầu, HS tiếp nhận.
2. Thực hiện nhiệm vụ: HS thực hiện (cá nhân, cặp, nhóm), GV quan sát, hỗ trợ.
3. Báo cáo, thảo luận: HS trình bày, các HS khác nhận xét.
4. Kết luận, nhận định: GV tổng hợp, chuẩn hóa kiến thức, động viên.

Sử dụng ký tự xuống dòng ('\n') để xuống dòng và tạo các gạch đầu dòng cho dễ đọc trong các trường chuỗi dài.

MỤC 4: ĐIỀU CHỈNH SAU BÀI DẠY (dieuChinh)
Ghi một vài gợi ý thiết thực.

TỔNG KẾT:
Hãy đảm bảo rằng giáo án cuối cùng vừa khoa học, chặt chẽ, vừa thể hiện được sự vui tươi, phù hợp với tâm lý học sinh ${inputs.grade}, và phát huy được tối đa tính tích cực, chủ động của các em. Trả về kết quả dưới dạng một đối tượng JSON duy nhất, không có giải thích gì thêm.
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

Nhiệm vụ của bạn là cập nhật lại giáo án dựa trên yêu cầu này. Hãy trả về TOÀN BỘ giáo án đã được cập nhật.
LƯU Ý QUAN TRỌNG: Phải giữ nguyên cấu trúc JSON ban đầu. Trong mỗi hoạt động, hãy đảm bảo điền đầy đủ cả hai trường "hoatDongGiaoVien" và "hoatDongHocSinh" để mô tả song song hoạt động của hai bên, và đảm bảo sự kết hợp của chúng thể hiện 4 bước của một hoạt động dạy học. Sử dụng ký tự '\n' để định dạng.
Không thêm bất kỳ văn bản giải thích nào ngoài đối tượng JSON.
`;
    return callGemini(prompt);
}