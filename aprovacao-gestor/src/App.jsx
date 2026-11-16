import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import ManagerApprovalScreen from './ManagerApprovalScreen'
 
// Lê o id do pedido da URL: /aprovacao/00001405
function ApprovalPage() {
  const { orderId } = useParams()
  return <ManagerApprovalScreen orderId={orderId} />
}
 
function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 text-center text-slate-600">
      <p>Link inválido. Abra o pedido pelo link de aprovação que você recebeu.</p>
    </main>
  )
}
 
export default function App() {
  return (
    <Routes>
      <Route path="/aprovacao/:orderId" element={<ApprovalPage />} />
 
      {/* Só para testar o protótipo: abre um pedido de exemplo ao acessar "/".
          Remova esta linha quando ligar ao backend. */}
      <Route path="/" element={<Navigate to="/aprovacao/00001405" replace />} />
 
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}