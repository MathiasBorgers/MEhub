"use client"

import { useForm, type SubmitHandler } from "react-hook-form"
import { createScriptAction } from "@/serverFunctions/scripts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import type { Category, Tag } from "@/generated/prisma/client"
import { LuaCodeEditor } from "@/components/lua-code-editor"

// Form data type with required arrays for better form handling
type ScriptFormData = {
  title: string
  description: string
  fullDescription: string
  version: string
  categoryId: string
  requirements: string[]
  features: string[]
  screenshots: string[]
  isActive: boolean
  luaContent?: string
  tagIds: string[]
}

interface ScriptUploadFormProps {
  categories: Category[]
  tags: Tag[]
}

export function ScriptUploadForm({ categories, tags }: ScriptUploadFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ScriptFormData>({
    defaultValues: {
      title: "",
      description: "",
      fullDescription: "",
      version: "1.0.0",
      categoryId: "",
      requirements: [],
      features: [],
      screenshots: [],
      isActive: true,
      luaContent: "",
      tagIds: [],
    },
  })

  const [featureInput, setFeatureInput] = useState("")
  const [requirementInput, setRequirementInput] = useState("")
  const [screenshotInput, setScreenshotInput] = useState("")

  const features = watch("features") || []
  const requirements = watch("requirements") || []
  const screenshots = watch("screenshots") || []
  const selectedTags = watch("tagIds") || []

  const addFeature = () => {
    if (featureInput.trim()) {
      setValue("features", [...features, featureInput.trim()], { shouldValidate: true, shouldDirty: true })
      setFeatureInput("")
    }
  }

  const removeFeature = (index: number) => {
    setValue("features", features.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true })
  }

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setValue("requirements", [...requirements, requirementInput.trim()], { shouldValidate: true, shouldDirty: true })
      setRequirementInput("")
    }
  }

  const removeRequirement = (index: number) => {
    setValue("requirements", requirements.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true })
  }

  const addScreenshot = () => {
    if (screenshotInput.trim()) {
      const newScreenshots = [...screenshots, screenshotInput.trim()]
      setValue("screenshots", newScreenshots, { shouldValidate: true, shouldDirty: true })
      setScreenshotInput("")
      console.log('Screenshot added:', screenshotInput.trim())
      console.log('Current screenshots:', newScreenshots)
    }
  }

  const removeScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index)
    setValue("screenshots", newScreenshots, { shouldValidate: true, shouldDirty: true })
    console.log('Screenshot removed at index:', index)
    console.log('Current screenshots:', newScreenshots)
  }

  const toggleTag = (tagId: string) => {
    if (selectedTags?.includes(tagId)) {
      setValue("tagIds", selectedTags.filter(id => id !== tagId))
    } else {
      setValue("tagIds", [...(selectedTags ?? []), tagId])
    }
  }

  const onSubmit: SubmitHandler<ScriptFormData> = (data) => {
    setError(null)
    setSuccess(false)

    console.log('Form submission started with data:', data)
    console.log('Screenshots in form data:', data.screenshots)
    console.log('Screenshots count:', data.screenshots?.length || 0)
    console.log('Screenshots array:', JSON.stringify(data.screenshots))

    startTransition(async () => {
      try {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          if (value === undefined || value === null) {
            return // Skip undefined/null values
          }

          if (Array.isArray(value)) {
            // Arrays as JSON strings
            formData.append(key, JSON.stringify(value))
          } else if (typeof value === 'boolean') {
            // Booleans as JSON to preserve type
            formData.append(key, JSON.stringify(value))
          } else if (typeof value === 'number') {
            // Numbers as JSON to preserve type
            formData.append(key, JSON.stringify(value))
          } else {
            // Everything else as string
            formData.append(key, String(value))
          }
        })

        const result = await createScriptAction({success: false}, formData)

        if (result.success && result.data?.scriptId) {
          setSuccess(true)
          setTimeout(() => {
            router.push(`/script/${result.data!.scriptId}`)
          }, 1000)
        } else if (result.errors) {
          console.error('Validation errors:', result.errors)

          // Check for general errors first
          if ('errors' in result.errors && Array.isArray(result.errors.errors)) {
            setError(result.errors.errors[0] || "Failed to create script")
            return
          }

          // Check for general error field
          if ('general' in result.errors && Array.isArray(result.errors.general)) {
            setError(result.errors.general[0] || "Failed to create script")
            return
          }

          // Handle field-level errors
          const errorMessages = Object.entries(result.errors)
            .map(([field, messages]) => {
              if (Array.isArray(messages) && messages.length > 0) {
                return `${field}: ${messages[0]}`
              }
              return null
            })
            .filter(Boolean)

          const errorMessage = errorMessages.length > 0
            ? errorMessages.join(', ')
            : "Failed to create script. Please check your input."

          setError(errorMessage)
        } else {
          setError("Failed to create script. Please try again.")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error('Unexpected error:', err)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card className="bg-mehub-card border-mehub-border p-6">
        <h2 className="text-2xl font-bold text-mehub-text mb-6">Basic Information</h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-mehub-text font-medium mb-2">
              Script Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="E.g., Automated Woodcutting Script"
              className="w-full px-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-mehub-text font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("categoryId")}
              className="w-full px-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text focus:border-mehub-primary outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-mehub-text font-medium mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="Brief description (10-500 characters)"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Version */}
          <div>
            <label className="block text-mehub-text font-medium mb-2">
              Version <span className="text-red-500">*</span>
            </label>
            <input
              {...register("version")}
              type="text"
              placeholder="1.0.0"
              className="w-full px-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
            />
            {errors.version && (
              <p className="text-red-500 text-sm mt-1">{errors.version.message}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Detailed Information */}
      <Card className="bg-mehub-card border-mehub-border p-6">
        <h2 className="text-2xl font-bold text-mehub-text mb-6">Detailed Information</h2>

        <div className="space-y-4">
          {/* Full Description */}
          <div>
            <label className="block text-mehub-text font-medium mb-2">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("fullDescription")}
              placeholder="Detailed description (minimum 50 characters)"
              rows={6}
              className="w-full px-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none resize-none"
            />
            {errors.fullDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.fullDescription.message}</p>
            )}
          </div>

          {/* Lua Script Content */}
          <div>
            <label className="block text-mehub-text font-medium mb-2">
              Lua Script Content
            </label>
            <LuaCodeEditor
              value={watch("luaContent") || ""}
              onChange={(value) => setValue("luaContent", value)}
              height="500px"
            />
            {errors.luaContent && (
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.luaContent.message === 'string' ? errors.luaContent.message : 'Invalid lua content'}
              </p>
            )}
            <p className="text-mehub-text-secondary text-sm mt-2">
              Optional: Write or paste your Lua script code here with full syntax highlighting and code completion.
            </p>
          </div>

          {/* Features */}
          <div>
            <label className="block text-mehub-text font-medium mb-2">Features</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addFeature()
                  }
                }}
                placeholder="Add a feature and press Enter"
                className="flex-1 px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
              />
              <Button type="button" onClick={addFeature} className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90">
                Add
              </Button>
            </div>
            <ul className="space-y-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 bg-mehub-bg rounded border border-mehub-border">
                  <span className="text-mehub-text">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-mehub-text-secondary hover:text-mehub-text"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-mehub-text font-medium mb-2">Requirements</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addRequirement()
                  }
                }}
                placeholder="Add a requirement and press Enter"
                className="flex-1 px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
              />
              <Button type="button" onClick={addRequirement} className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90">
                Add
              </Button>
            </div>
            <ul className="space-y-2">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 bg-mehub-bg rounded border border-mehub-border">
                  <span className="text-mehub-text">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(idx)}
                    className="text-mehub-text-secondary hover:text-mehub-text"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Screenshots */}
          <div>
            <label className="block text-mehub-text font-medium mb-2">Screenshots (URLs)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={screenshotInput}
                onChange={(e) => setScreenshotInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addScreenshot()
                  }
                }}
                placeholder="Add a screenshot URL and press Enter"
                className="flex-1 px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
              />
              <Button type="button" onClick={addScreenshot} className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90">
                Add
              </Button>
            </div>
            <ul className="space-y-2">
              {screenshots.map((screenshot, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 bg-mehub-bg rounded border border-mehub-border">
                  <span className="text-mehub-text truncate">{screenshot}</span>
                  <button
                    type="button"
                    onClick={() => removeScreenshot(idx)}
                    className="text-mehub-text-secondary hover:text-mehub-text ml-2"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Tags */}
      <Card className="bg-mehub-card border-mehub-border p-6">
        <h2 className="text-2xl font-bold text-mehub-text mb-6">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTags?.includes(tag.id)
                  ? "bg-mehub-primary text-mehub-bg"
                  : "bg-mehub-bg border border-mehub-border text-mehub-text hover:border-mehub-primary"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
          Script created successfully! Redirecting...
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          onClick={() => router.back()}
          variant="outline"
          className="border-mehub-border text-mehub-text hover:bg-mehub-card"
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Script"
          )}
        </Button>
      </div>
    </form>
  )
}
