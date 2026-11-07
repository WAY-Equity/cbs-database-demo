import {useRef,useState} from 'react';
import {X,ArrowUpRight} from 'lucide-react';
import type {Branch,Database} from './model';
export default function ChatWidget({branch,db,onNavigate}:{branch:Branch;db:Database;onNavigate:(page:'properties'|'reports'|'automation')=>void}){
 const [open,setOpen]=useState(false);
 const [seen,setSeen]=useState(false);
 const launcher=useRef<HTMLButtonElement>(null);
 function close(){setOpen(false);launcher.current?.focus()}
 return <div className="chat-widget" onKeyDown={e=>{if(e.key==='Escape')close()}}>
 {open&&<section className="chat-panel" aria-label="CBS AI チャット"><div className="chat-header"><div className="chat-mini-logo">CBS</div><div><strong>CBS AI</strong><small>{branch} · デモアシスタント</small></div><button autoFocus className="icon-button" aria-label="チャットを閉じる" onClick={close}><X size={20}/></button></div><div className="chat-content"><span className="badge auto-blue">デモ</span><p>こんにちは。どの情報を確認しますか？</p><p className="chat-disclaimer">この画面はデモです。AIによる回答生成はまだ接続していません。</p>{[{page:'properties' as const,label:'物件情報を確認',detail:`${branch}の物件 ${db.properties.length}件`},{page:'reports' as const,label:'報告書を確認',detail:`${branch}の報告書 ${db.reports.length}件`},{page:'automation' as const,label:'自動化を試す',detail:'写真配置・転記・勤怠集計'}].map(item=><button className="chat-shortcut" key={item.page} onClick={()=>{onNavigate(item.page);close()}}><span><strong>{item.label}</strong><small>{item.detail}</small></span><ArrowUpRight size={18}/></button>)}</div></section>}
 <button ref={launcher} className="chat-launcher" aria-label={open?'CBS AI チャットを閉じる':'CBS AI チャットを開く'} aria-expanded={open} onClick={()=>{setOpen(!open);setSeen(true)}}><span className="chat-label"><strong>AIに相談</strong><span>業務情報を確認</span></span><span className="chat-orb">CBS<span className="chat-status" aria-hidden="true"/>{!seen&&<span className="chat-notification" aria-label="ご案内1件">1</span>}</span></button>
 </div>
}
