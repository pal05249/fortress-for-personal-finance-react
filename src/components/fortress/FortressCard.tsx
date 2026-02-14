import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Props = {
  title: string
  current: number
  target: number
}

export function FortressCard({ title, current, target }: Props) {
  const progress = Math.min((current / target) * 100, 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} />
        <p className="mt-2 text-sm text-muted-foreground">
          ₹{current.toLocaleString()} / ₹{target.toLocaleString()}
        </p>
        {progress >= 100 && (
          <p className="mt-2 text-green-600 font-medium">Unlocked ✅</p>
        )}
      </CardContent>
    </Card>
  )
}
