export type AttendanceRow={id:string;staff:string;date:string;start:string;end:string;breakMinutes:number;reviewed:boolean};
export const attendanceSource=[
 {id:'A1',staff:'スタッフA（架空）',date:'2026-11-02',start:'09:00',end:'12:00',breakMinutes:0,reviewed:true},
 {id:'A2',staff:'スタッフA（架空）',date:'2026-11-03',start:'09:00',end:'17:00',breakMinutes:60,reviewed:true},
 {id:'B1',staff:'スタッフB（架空）',date:'2026-11-02',start:'08:30',end:'12:30',breakMinutes:0,reviewed:false},
 {id:'B2',staff:'スタッフB（架空）',date:'2026-11-03',start:'13:00',end:'17:00',breakMinutes:0,reviewed:false},
];
export function attendanceIssue(row:AttendanceRow){
 if(!/^\d{2}:\d{2}$/.test(row.start)||!/^\d{2}:\d{2}$/.test(row.end))return '時刻を原本と照合してください';
 const time=(s:string)=>Number(s.slice(0,2))*60+Number(s.slice(3));
 if([row.start,row.end].some(s=>Number(s.slice(0,2))>23||Number(s.slice(3))>59))return '時刻が範囲外です';
 const minutes=time(row.end)-time(row.start);
 if(minutes<=0)return '終了が開始以前です。日跨ぎ勤務は別途確認';
 if(!Number.isInteger(row.breakMinutes)||row.breakMinutes<0||row.breakMinutes>=minutes)return '休憩時間を確認してください';
 if(!row.reviewed)return '原本確認が必要です';
 return '';
}
export function workMinutes(row:AttendanceRow){if(attendanceIssue(row))return null;const time=(s:string)=>Number(s.slice(0,2))*60+Number(s.slice(3));return time(row.end)-time(row.start)-row.breakMinutes}
export function attendanceTotals(rows:AttendanceRow[]){return rows.reduce<Record<string,number>>((totals,row)=>{const m=workMinutes(row);if(m!==null)totals[row.staff]=(totals[row.staff]||0)+m;return totals},{})}
export const formatMinutes=(minutes:number)=>`${Math.floor(minutes/60)}時間${minutes%60}分`;
export function validatePhotoSlots(slots:string[],available:string[]){return slots.length===2&&slots.every(s=>available.includes(s))&&new Set(slots).size===2;}
