
export interface LessonPlanInput {
  subject: string;
  grade: string;
  lessonTitle: string;
  periods: string;
  teacherName: string;
  schoolName: string;
  prepDate: string;
  teachingDate: string;
}

export interface TeachingActivity {
  ten: string;
  thoiGian: string;
  hoatDongGV: string;
  hoatDongHS: string;
}

export interface GeneratedLessonPlan {
  tieuDe: string;
  monHoc: string;
  lop: string;
  soTiet: string;
  thoiGianThucHien: string;
  yeuCauCanDat: string[];
  doDungDayHoc: {
    giaoVien: string[];
    hocSinh: string[];
  };
  hoatDong: TeachingActivity[];
  dieuChinh: string;
}
