
import "./globals.css";
import { Toaster, toast } from 'sonner' 


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">


      <body className="font-sans bg-white text-black">
        <Toaster richColors position="top-center" />
        {/* <Navbar /> */}
        {children}

        
      </body>




    </html>

    
  );
}
