//wrap everuthing in socket provider for realtime things...

import Sidebar from "@/components/sidebar";
import { SocketProvider } from "@/context/socketContext";

export default function DashboardLayout({ children }: any) {
  return (
    <SocketProvider>  
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </SocketProvider>
  );
}


