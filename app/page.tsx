import Dashboard from "./[dashboard]/page";
import ProtectedRoute from "@/components/protectedroute";
export default function Home() {
  return (
   <ProtectedRoute>
   <Dashboard/>
   </ProtectedRoute>
  );
} 
