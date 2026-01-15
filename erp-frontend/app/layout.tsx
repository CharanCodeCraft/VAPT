import './globals.css'

export const metadata = {
  title: 'ERP Student Portal',
  description: 'Student Management System',
}

type RootLayoutProps = {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}