import './globals.css';
export const metadata = { title: 'القيصر | مركز الشرح والحلول الذكي', description: 'منصة القيصر التعليمية للثانوية العامة والبكالوريا' };
export default function RootLayout({ children }) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
