export interface LessonPlanInput {
  subject: string;
  grade: string;
  bookSet: string;
  lessonTitle: string;
  periods: string;
  teacherName: string;
  schoolName: string;
  prepDate: string;
  teachingDate: string;
}

export interface YeuCauCanDat {
  kienThucKyNang: string[];
  nangLuc: {
    chung: string[];
    dacThu: string[];
  };
  phamChat: string[];
}

export interface TeachingActivity {
  ten: string; // e.g., "A. Khởi động"
  thoiGian: string; // e.g., "5 phút"
  mucTieu: string;
  hoatDongGiaoVien: string; // Describes teacher's activities
  hoatDongHocSinh: string; // Describes student's activities
}

export interface GeneratedLessonPlan {
  tieuDe: string;
  monHoc: string;
  lop: string;
  soTiet: string;
  thoiGianThucHien: string;
  yeuCauCanDat: YeuCauCanDat;
  doDungDayHoc: {
    giaoVien: string[];
    hocSinh: string[];
  };
  hoatDong: TeachingActivity[];
  dieuChinh: string;
}