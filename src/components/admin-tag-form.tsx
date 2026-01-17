"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTagSchema } from "@/schemas/tagSchemas"
import { createTagAction } from "@/serverFunctions/tags"
import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import type { z } from "zod"

type TagFormData = z.infer<typeof createTagSchema>

export function AdminTagForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TagFormData>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6",
    },
  })

  const onSubmit = (data: TagFormData) => {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      try {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null) {
            formData.append(key, String(value))
          }
        })

        const result = await createTagAction({ success: false }, formData)

        if (result.success) {
          setSuccess(true)
          reset()
          setTimeout(() => {
            setSuccess(false)
            router.refresh()
          }, 2000)
        } else if (result.errors) {
          setError(result.errors.errors?.[0] || "Failed to create tag")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-mehub-text font-medium mb-2">
          Tag Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name")}
          type="text"
          placeholder="e.g., AFK"
          className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-mehub-text font-medium mb-2">
          Color
        </label>
        <input
          {...register("color")}
          type="color"
          className="w-full h-12 px-2 py-2 bg-mehub-bg border border-mehub-border rounded-lg cursor-pointer"
        />
        {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm">
          Tag created successfully!
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Tag"
        )}
      </Button>
    </form>
  )
}

