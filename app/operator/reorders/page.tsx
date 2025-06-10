import { withOperatorGuard } from '@/hooks/withOperatorGuard';
import ReorderDashboard from '@/components/ReorderDashboard';

function OperatorReordersPage() {
console.log('🔍 [page.tsx] Entering function: function OperatorReordersPage');
  return <ReorderDashboard />;
}

export default withOperatorGuard(OperatorReordersPage);
