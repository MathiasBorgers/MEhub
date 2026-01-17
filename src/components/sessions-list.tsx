'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'
import { Role } from '@/generated/prisma/enums'
import { revokeSessionAction } from '@/serverFunctions/sessions'
import type { SessionWithProfile } from '@/models/users'

interface SessionsListProps {
  sessions: SessionWithProfile[]
}

// Helper function to format date consistently on server and client
function formatDate(date: Date): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function SessionsList({ sessions }: SessionsListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRevoke = (sessionId: string) => {
    if (!confirm('Are you sure you want to revoke this session? The user will be logged out.')) {
      return
    }

    setRevokingId(sessionId)
    setError(null)

    startTransition(async () => {
      try {
        await revokeSessionAction({ id: sessionId })
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to revoke session')
      } finally {
        setRevokingId(null)
      }
    })
  }

  return (
    <>
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-mehub-border">
            <tr>
              <th className="text-left p-4 text-mehub-text font-semibold">User</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Role</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Started</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Expires</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Duration</th>
              <th className="text-right p-4 text-mehub-text font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const duration = Math.floor(
                (new Date(session.activeUntil).getTime() - new Date(session.activeFrom).getTime())
                / (1000 * 60 * 60)
              )
              const timeLeft = Math.floor(
                (new Date(session.activeUntil).getTime() - new Date().getTime())
                / (1000 * 60 * 60)
              )

              return (
                <tr key={session.id} className="border-b border-mehub-border hover:bg-mehub-bg">
                  <td className="p-4 text-mehub-text font-medium">
                    {session.user.username}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      session.user.role === Role.Admin 
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : session.user.role === Role.Developer
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {session.user.role}
                    </span>
                  </td>
                  <td className="p-4 text-mehub-text-secondary text-sm">
                    {formatDate(session.activeFrom)}
                  </td>
                  <td className="p-4 text-mehub-text-secondary text-sm">
                    {formatDate(session.activeUntil)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-mehub-text-secondary" />
                      <span className="text-mehub-text text-sm">
                        {timeLeft}h left / {duration}h total
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleRevoke(session.id)}
                        disabled={isPending && revokingId === session.id}
                      >
                        {isPending && revokingId === session.id ? 'Revoking...' : 'Revoke'}
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-mehub-text-secondary">
                  No active sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

