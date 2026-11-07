export type Branch = '神戸' | '大阪';
export type Department = '環境部' | '設備部';
export type Property = {
 id:string; name:string; customerId:string; branch:Branch; department:Department;
 company:string; address:string; owner:string; service:string; status:string;
 entry:string; equipment:string; waste:string; holiday:string; notes:string;
 updatedAt:string; updatedBy:string; confirmedAt:string; contractRef:string;
};
export type Customer = {id:string;name:string;contact:string;email:string;format:string;delivery:string};
export type Job = {id:string;propertyId:string;title:string;date:string;time:string;assignee:string;provider:string;status:string;notes:string};
export type Report = {id:string;propertyId:string;jobId:string;title:string;type:string;date:string;due:string;author:string;reviewer:string;status:string;format:string;delivery:string;required:string[];received:string[];finding:string;notes:string};
export type Quote = {id:string;propertyId:string;title:string;date:string;amount:number;owner:string;status:string;nextDate:string;notes:string};
export type Document = {id:string;propertyId:string;title:string;type:string;version:number;updatedAt:string;owner:string;status:string;body:string};
export type HistoryEntry = {id:string;at:string;entityId:string;action:string;detail:string};
export type Database = {version:1;properties:Property[];customers:Customer[];jobs:Job[];reports:Report[];quotes:Quote[];documents:Document[];history:HistoryEntry[]};
export const DEMO_DATE='2026-11-09';
export const STORAGE_KEY='cbs-base-demo-v1';
export function missingEvidence(report:Report){return report.required.filter(item=>!report.received.includes(item));}
export function validateReportStatus(report:Report,status:string){
 if(['確認待ち','提出済み'].includes(status) && missingEvidence(report).length) return '必要資料が揃っていません。資料チェックを確認してください。';
 if(status==='提出済み' && !report.reviewer.trim()) return '内容確認者を入力してください。';
 if(status==='提出済み' && !report.finding.trim()) return '点検結果・作業内容を入力してください。';
 return '';
}
export function validateRelations(db:Database){
 const errors:string[]=[]; const p=new Set(db.properties.map(x=>x.id)); const c=new Set(db.customers.map(x=>x.id));
 db.properties.forEach(x=>{if(!c.has(x.customerId))errors.push(x.id+':customer');});
 [...db.jobs,...db.reports,...db.quotes,...db.documents].forEach(x=>{if(!p.has(x.propertyId))errors.push(x.id+':property');});
 db.reports.forEach(x=>{if(!db.jobs.some(j=>j.id===x.jobId&&j.propertyId===x.propertyId))errors.push(x.id+':job');});
 return errors;
}
export function encodeCsv(rows:string[][]){return '\uFEFF'+rows.map(row=>row.map(cell=>'"'+(/^[=+@\-]/.test(cell)?"'"+cell:cell).replaceAll('"','""')+'"').join(',')).join('\r\n');}
export function readDatabase(raw:string|null,fallback:()=>Database):Database{
 if(!raw)return fallback();
 const data=JSON.parse(raw) as Database;
 if(data.version!==1||!['properties','customers','jobs','reports','quotes','documents','history'].every(k=>Array.isArray(data[k as keyof Database])))throw new Error('保存データの形式を読み込めません。');
 if(validateRelations(data).length)throw new Error('保存データの参照関係に問題があります。');
 return data;
}
export function newId(prefix:string){return `${prefix}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;}

export function scopeDatabase(db:Database,branch:Branch):Database{
 const properties=db.properties.filter(p=>p.branch===branch);
 const ids=new Set(properties.map(p=>p.id));
 return {...db,properties,jobs:db.jobs.filter(r=>ids.has(r.propertyId)),reports:db.reports.filter(r=>ids.has(r.propertyId)),quotes:db.quotes.filter(r=>ids.has(r.propertyId)),documents:db.documents.filter(r=>ids.has(r.propertyId))};
}
