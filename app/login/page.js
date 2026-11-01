'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, KeyRound, LockKeyhole, ArrowLeft, Sparkles } from 'lucide-react';
import { getSupabase, studentEmailFromCode } from '@/lib/supabase';

export default function LoginPage(){
  const [code,setCode]=useState(''); const [password,setPassword]=useState('');
  const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const router=useRouter();
  async function submit(e){
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const supabase=getSupabase();
      const {data,error:authError}=await supabase.auth.signInWithPassword({email:studentEmailFromCode(code),password});
      if(authError) throw new Error('كود الطالب أو كلمة المرور غير صحيحة.');
      const {data:profile,error:profileError}=await supabase.from('profiles').select('education_system').eq('id',data.user.id).single();
      if(profileError) throw new Error('تم تسجيل الدخول، لكن لم نعثر على ملف الطالب. راجع إعداد قاعدة البيانات.');
      router.replace(profile.education_system ? '/dashboard' : '/choose-stage');
    } catch(err){setError(err.message || 'حدث خطأ أثناء تسجيل الدخول.');}
    finally{setBusy(false);}
  }
  return <main className="auth-shell"><div className="auth-glow"/><section className="auth-card">
    <div className="brand-mark"><Crown size={42}/></div><div className="brand-title">منصة القيصر</div><p className="brand-subtitle">مركز الشرح والحلول الذكي</p>
    <div className="gold-line"/><h1>مرحباً بعودتك</h1><p className="muted">سجّل الدخول بكود الطالب وكلمة المرور</p>
    <form onSubmit={submit} className="login-form">
      <label>كود الطالب</label><div className="field"><KeyRound size={18}/><input value={code} onChange={e=>setCode(e.target.value)} placeholder="مثال: MM-2027-001" autoComplete="username" required/></div>
      <label>كلمة المرور</label><div className="field"><LockKeyhole size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="أدخل كلمة المرور" autoComplete="current-password" required/></div>
      {error && <div className="error-box">{error}</div>}
      <button className="gold-button" disabled={busy}>{busy?'جارٍ التحقق...':'تسجيل الدخول'} <ArrowLeft size={18}/></button>
    </form>
    <div className="secure-note"><Sparkles size={15}/> دخول آمن مخصص لطلاب منصة القيصر</div>
  </section><footer className="auth-footer">بالعلم نصنع المستقبل <span>✦</span></footer></main>
}
