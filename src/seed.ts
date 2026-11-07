import type { Database, Property, Job, Report } from './model';
export function createSeed():Database {
 const customers=[
  {id:'C-001',name:'みなと都市管理（架空）',contact:'管理課 担当A',email:'contact@example.com',format:'顧客指定 Excel',delivery:'メール（PDF）'},
  {id:'C-002',name:'六甲プロパティ（架空）',contact:'施設課 担当B',email:'facility@example.com',format:'顧客指定 Word',delivery:'顧客システム'},
  {id:'C-003',name:'中之島ビルマネジメント（架空）',contact:'業務課 担当C',email:'office@example.com',format:'顧客指定 Excel',delivery:'メール（PDF）'},
  {id:'C-004',name:'北摂施設サービス（架空）',contact:'管理室 担当D',email:'support@example.com',format:'共通様式（デモ）',delivery:'原本郵送'},
 ];
 const names=['みなと中央ビル','六甲ガーデン','三宮オフィス','神戸リバーサイド','ポートスクエア','灘レジデンス','北野テラス','須磨センター','中之島タワー','梅田プラザ','本町オフィス','新大阪ガーデン','江坂スクエア','天満レジデンス','淀屋橋センター','千里テラス'];
 const properties:Property[]=names.map((name,i)=>({id:`P-${String(i+1).padStart(3,'0')}`,name,customerId:customers[i<8?i%2:2+i%2].id,branch:i<8?'神戸':'大阪',department:i%3===1?'設備部':'環境部',company:'CBSファシリティーズ',address:(i<8?'兵庫県神戸市':'大阪府大阪市')+' デモ地区 '+(i+1)+'番（架空住所）',owner:(i<8?'神戸':'大阪')+(i%3===1?'設備 担当B':'環境 担当A'),service:i%3===1?'定期設備点検':'定期清掃',status:i%5===0?'要確認':'確認済み',entry:i%5===0?'入館受付の変更あり。新しい窓口は確認中。':'作業開始前に管理室へ連絡。受付で入館手続き。',equipment:i%3===1?'受水槽・分電盤・ポンプ設備（デモ）':'清掃用具は1階用具庫。床材は現場手順書を参照。',waste:'指定場所に分別。搬出方法は作業仕様書を参照。',holiday:i%4===0?'祝日実施の扱いを顧客に確認中':'祝日の実施は個別の予定表に従う',notes:i===0?'管理室から受付変更の連絡。次回作業前に台帳を更新。':'実際の物件・契約を表すものではありません。',updatedAt:`2026-11-${String(8-i%6).padStart(2,'0')}`,updatedBy:'事務担当（デモ）',confirmedAt:i%5===0?'':'2026-11-01',contractRef:`CT-${String(i+1).padStart(3,'0')}`}));
 const jobs:Job[]=properties.map((p,i)=>({id:`J-${String(i+1).padStart(3,'0')}`,propertyId:p.id,title:p.service,date:`2026-11-${String(9+i%7).padStart(2,'0')}`,time:i%3===0?'06:30–08:30':'09:00–11:00',assignee:p.department==='設備部'?'点検担当B（デモ）':'現場担当A（デモ）',provider:p.branch==='大阪'&&p.department==='環境部'?'協力会社A（架空）':p.department==='環境部'?'CBSサービス':'CBSファシリティーズ',status:i%6===0?'日程調整中':i%7===0?'代務調整中':'予定確定',notes:i%6===0?'希望日への回答待ち。確定後に顧客へメールで連絡。':'実施担当・時間はデモ設定。既存の予定表を想定。'}));
 const reports:Report[]=properties.slice(0,12).map((p,i)=>{
  const cleaning=p.department==='環境部'; const required=cleaning?['作業前写真','作業後写真','作業記録','KYT']:['点検記録','点検写真','測定値'];
  return {id:`R-${String(i+1).padStart(3,'0')}`,propertyId:p.id,jobId:jobs[i].id,title:p.name+' '+(cleaning?'清掃報告書':'設備点検報告書'),type:cleaning?'清掃報告書':'設備点検報告書',date:'2026-11-06',due:`2026-11-${String(9+i%4).padStart(2,'0')}`,author:cleaning?'営業事務A（デモ）':p.branch==='神戸'?'報告書作成支援B（デモ）':'点検担当B（デモ）',reviewer:p.owner,status:i%4===0?'資料待ち':i%4===1?'作成中':i%4===2?'確認待ち':'提出済み',format:customers.find(c=>c.id===p.customerId)!.format,delivery:customers.find(c=>c.id===p.customerId)!.delivery,required,received:i%4===0?required.slice(0,2):[...required],finding:cleaning?'共用部の定期清掃を実施。実施範囲は作業記録を参照。':'対象設備を点検。測定値・判定は担当者が原記録と照合する。',notes:cleaning?'現場ごとに写真・KYT等の要否を確認。':'内容確認は担当者が実施。自動判定は行わない。'};
 });
 // Completed work is separate from the next scheduled visit, even for the same property.
 reports.forEach((r,i)=>{const source=jobs[i]; const completed={...source,id:`J-DONE-${i+1}`,date:r.date,status:'作業完了'};jobs.push(completed);r.jobId=completed.id;});
 const quotes=properties.slice(0,8).map((p,i)=>({id:`Q-${String(i+1).padStart(3,'0')}`,propertyId:p.id,title:i%2?'ポンプ部品交換':'共用部追加清掃',date:'2026-11-04',amount:48000+i*26000,owner:p.owner,status:['現地調査','見積作成中','提出済み','追客中','受注'][i%5],nextDate:`2026-11-${String(9+i%4).padStart(2,'0')}`,notes:'顧客相談を受け、対応範囲と条件を確認する。金額は架空。'}));
 const documents=properties.flatMap((p,i)=>[
  {id:`D-${i+1}-1`,propertyId:p.id,title:p.name+' 作業仕様書',type:'作業仕様書',version:2,updatedAt:p.updatedAt,owner:p.owner,status:'最新版',body:'【示範資料】\n対象：'+p.name+'\n作業範囲：共用部・対象設備（デモ）\n実施頻度：契約条件を確認して予定表に反映\n品質確認：担当者が実施内容を確認\nこの文書は架空のプレビューです。正式な契約仕様書ではありません。'},
  {id:`D-${i+1}-2`,propertyId:p.id,title:p.name+' '+(i%2?'図面':'覚書'),type:i%2?'図面':'覚書',version:1,updatedAt:'2026-10-20',owner:p.owner,status:i%5===0?'更新確認中':'最新版',body:'【示範資料】\n物件ID：'+p.id+'\n変更内容：受付・連絡先の見直し（架空）\n適用日・顧客合意は実際の原本で確認します。\n関連資料を物件単位で探す操作のためのサンプルです。'}
 ]);
 return {version:1,properties,customers,jobs,reports,quotes,documents,history:[{id:'H-001',at:'2026-11-08T09:30:00+09:00',entityId:'P-001',action:'確認依頼',detail:'入館受付の変更を記録。窓口は確認中（デモ）。'},{id:'H-002',at:'2026-11-07T15:00:00+09:00',entityId:'R-003',action:'内容確認',detail:'担当者による確認待ちへ変更（デモ）。'}]};
}
