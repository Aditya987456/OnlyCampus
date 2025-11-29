
// import "./globals.css";
// import { Toaster, toast } from 'sonner' 


// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">


//       <body className="font-sans bg-white text-black">
//         <Toaster richColors position="top-center" />
//         {/* <Navbar /> */}
//         {children}

        
//       </body>




//     </html>

    
//   );
// }




// import "./globals.css";
// import { SocketProvider } from "@/context/SocketContext";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <SocketProvider>
//           {children}
//         </SocketProvider>
//       </body>
//     </html>
//   );
// }



// import "./globals.css";
// import { SocketProvider } from "@/context/socketContext";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <SocketProvider>
//           {children}
//         </SocketProvider>
//       </body>
//     </html>
//   );
// }





import "./globals.css";
import { Toaster } from "sonner";
import { SocketProvider } from "@/context/socketContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-black">
        <SocketProvider>
          <Toaster richColors position="top-center" />
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
