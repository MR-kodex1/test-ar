'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, Crown } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
export default function ChooseStage(){
 const [stage,setStage]=useState(''); const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const router=useRouter();
 async function save(){ if(!stage)return; setBusy(true);setError(''); try{const s=getSupabase();const {data:{user}}=await s.auth.getUser();if(!user)throw new Error('انتهت الجلسة، سجّل الدخول مرة أخرى.');const {error}=await s.from('profiles').update({education_system:stage==='secondary'?'الثانوية العامة':'البكالوريا'}).eq('id',user.id).is('education_system',null);if(error)throw error;router.replace('/dashboard');}catch(e){setError(e.message||'تعذر حفظ المرحلة');}finally{setBusy(false);} }
 return <main className="auth-shell"><section className="auth-card stage-card"><div className="brand-mark"><Crown size={42}/></div><div className="brand-title">منصة القيصر</div><h1>اختر مسارك الدراسي</h1><p className="muted">هذا الاختيار يُحفظ في حسابك ولا تحتاج إلى تكراره.</p>
 <div className="stage-options"><button className={`stage-option ${stage==='secondary'?'selected':''}`} onClick={()=>setStage('secondary')}><GraduationCap size={32}/><b>الثانوية العامة</b><small>شرح وتدريبات وتقييمات الثانوية</small></button><button className={`stage-option ${stage==='baccalaureate'?'selected':''}`} onClick={()=>setStage('baccalaureate')}><BookOpen size={32}/><b>البكالوريا</b><small>الوحدات والدروس والتقييمات</small></button></div>
 {error&&<div className="error-box">{error}</div>}<button className="gold-button" disabled={!stage||busy} onClick={save}>{busy?'جارٍ الحفظ...':'تأكيد الاختيار'}　←</button>
 </section></main>
}
