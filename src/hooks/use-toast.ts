'use client'
// Simple toast hook using browser alerts for now
// TODO: Replace with proper toast component

interface ToastProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const toast = ({ title, description, variant }: ToastProps): void => {
    if (variant === 'destructive') {
      alert(`❌ ${title}${description ? '\n' + description : ''}`)
    } else {
      alert(`✅ ${title}${description ? '\n' + description : ''}`)
    }
  }

  return { toast }
}

