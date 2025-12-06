import { useHDBSales } from "../hooks/useHDBSales";


const Transactions: React.FC = () => {
  const { data, isLoading, error } = useHDBSales();

  return (
    <div>

    </div>
  )
}

export default Transactions;