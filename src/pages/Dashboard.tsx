import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FortressCard } from "@/components/fortress/FortressCard"
import { useFortress } from "@/hooks/useFortress"

export default function Dashboard() {
  const {
    income,
    expenses,
    surplus,
    setIncome,
    setExpenses,
  } = useFortress()

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🏰 Financial Fortress</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Monthly Income</Label>
          <Input
            type="number"
            value={income}
            onChange={(e) => setIncome(+e.target.value)}
          />
        </div>

        <div>
          <Label>Monthly Expenses</Label>
          <Input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(+e.target.value)}
          />
        </div>
      </div>

      <p className="text-lg">
        Monthly Surplus: <strong>₹{surplus.toLocaleString()}</strong>
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <FortressCard title="Emergency Moat" current={surplus * 6} target={210000} />
        <FortressCard title="Marriage Fund" current={surplus * 12} target={1500000} />
        <FortressCard title="Gold + Scooter" current={surplus * 18} target={950000} />
        <FortressCard title="House Citadel" current={surplus * 36} target={4000000} />
      </div>
    </div>
  )
}
