import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actionText?: string
  actionLink?: string
}

export function EmptyState({ icon, title, description, actionText, actionLink }: EmptyStateProps) {
  return (
    <Card className="bg-mehub-card border-mehub-border p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-mehub-text mb-2">{title}</h3>
      <p className="text-mehub-text-secondary mb-6">{description}</p>
      {actionText && actionLink && (
        <Link href={actionLink as unknown as any}>
          <Button className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90">{actionText}</Button>
        </Link>
      )}
    </Card>
  )
}
