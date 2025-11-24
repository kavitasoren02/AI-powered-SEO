interface StatsCardProps {
  label: string
  value: string | number
  icon?: string
  trend?: "up" | "down"
}

export default function StatsCard({ label, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-secondary rounded-lg border border-border p-6 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {icon && <span className="text-4xl">{icon}</span>}
      </div>
      {trend && (
        <p className={`text-xs mt-3 ${trend === "up" ? "text-primary" : "text-red-500"}`}>
          {trend === "up" ? "↑" : "↓"} vs last month
        </p>
      )}
    </div>
  )
}
