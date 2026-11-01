-- منصة القيصر: شغّل هذا الملف في Supabase SQL Editor.
-- ملاحظة: يجب إنشاء حسابات الطلاب مسبقاً في Supabase Auth (email = lower(code)@students.example.com).

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  phone text,
  parent_phone text,
  education_system text check (education_system in ('الثانوية العامة','البكالوريا') or education_system is null),
  created_at timestamptz not null default now()
);

create table if not exists public.student_codes (
  code text primary key,
  is_used boolean not null default false,
  profile_id uuid references public.profiles(id) on delete set null,
  auth_user_id uuid references auth.users(id) on delete set null,
  auth_email text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  completed boolean not null default false,
  score numeric(5,2),
  updated_at timestamptz not null default now(),
  unique(student_id, lesson_slug)
);

create table if not exists public.assessment_attempts (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  stage text not null check (stage in ('الثانوية العامة','البكالوريا')),
  assessment_title text not null,
  score numeric(5,2),
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.student_codes enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assessment_attempts enable row level security;

drop policy if exists "student reads own profile" on public.profiles;
create policy "student reads own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "student updates own profile once" on public.profiles;
create policy "student updates own profile once" on public.profiles for update to authenticated using (auth.uid() = id and education_system is null) with check (auth.uid() = id);

drop policy if exists "student reads own progress" on public.lesson_progress;
create policy "student reads own progress" on public.lesson_progress for select to authenticated using (auth.uid() = student_id);
drop policy if exists "student inserts own progress" on public.lesson_progress;
create policy "student inserts own progress" on public.lesson_progress for insert to authenticated with check (auth.uid() = student_id);
drop policy if exists "student updates own progress" on public.lesson_progress;
create policy "student updates own progress" on public.lesson_progress for update to authenticated using (auth.uid() = student_id) with check (auth.uid() = student_id);

drop policy if exists "student reads own assessments" on public.assessment_attempts;
create policy "student reads own assessments" on public.assessment_attempts for select to authenticated using (auth.uid() = student_id);
drop policy if exists "student inserts own assessments" on public.assessment_attempts;
create policy "student inserts own assessments" on public.assessment_attempts for insert to authenticated with check (auth.uid() = student_id);

-- لا توجد سياسات قراءة عامة لجدول student_codes؛ لا تعرض أكواد الطلاب للمتصفح.
-- أنشئ حساب Auth لكل طالب من لوحة الإدارة أو سكربت آمن باستخدام service_role.
-- بعد إنشاء Auth user، أضف صفاً في profiles بنفس id وصفاً في student_codes.

-- ينشئ ملف الطالب تلقائياً عند إنشاء حساب Auth جديد.
create or replace function public.handle_new_student()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_student on auth.users;
create trigger on_auth_user_created_student
after insert on auth.users
for each row execute procedure public.handle_new_student();
