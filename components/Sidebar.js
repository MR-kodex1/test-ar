'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, BookOpen, ClipboardCheck, ChartNoAxesColumn, UserRound, LogOut, Crown, Sparkles } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
export default function Sidebar({stage}){const router=useRouter();async function logout(){await getSupabase().auth.signOut();router.replace('/login');}
 return <aside className="sidebar"><Link href="/dashboard" className="side-brand"><Crown size={34}/><span>القيصر<small>مركز الشرح الذكي</small></span></Link><nav><Link href="/dashboard" className="nav-link active"><Home/> الرئيسية</Link><a href="#subjects" className="nav-link"><BookOpen/> المواد الدراسية</a><a href="#assessments" className="nav-link"><ClipboardCheck/> التقييمات</a><a href="#progress" className="nav-link"><ChartNoAxesColumn/> تقارير التقدم</a></nav><div className="sidebar-bottom"><div className="side-emblem"><Crown size={38}/><b>القيصر</b><small>أنت قادر.. فقط استمر</small></div><button className="logout-button" onClick={logout}><LogOut size={17}/> تسجيل الخروج</button></div></aside>}
