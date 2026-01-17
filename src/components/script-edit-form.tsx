"use client"

import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateScriptSchema } from "@/schemas/scriptSchemas"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import type { z } from "zod"
import type { Category, Tag, Script, ScriptTag } from "@/generated/prisma/client"
import { LuaCodeEditor } from "@/components/lua-code-editor"
import Link from "next/link"
import { useScripts } from "@/hooks/useScripts"

type ScriptUpdateData = z.infer<typeof updateScriptSchema>

interface ScriptEditFormProps {
  script: Script & {
    category: Category
    tags: (ScriptTag & { tag: Tag })[]
  }
  categories: Category[]
  tags: Tag[]
}

export function ScriptEditForm({ script, categories, tags }: ScriptEditFormProps) {
  const router = useRouter()
  const [luaCode, setLuaCode] = useState(script.luaContent || "")
  const { updateScript, isUpdating, error, clearError } = useScripts()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ScriptUpdateData>({
    resolver: zodResolver(updateScriptSchema),
    defaultValues: {
      id: script.id,
      title: script.title,
      description: script.description,
      fullDescription: script.fullDescription,
      version: script.version,
      categoryId: script.categoryId,
      requirements: Array.isArray(script.requirements) ? [...script.requirements] : [],
      features: Array.isArray(script.features) ? [...script.features] : [],
      screenshots: Array.isArray(script.screenshots) ? [...script.screenshots] : [],
      isActive: script.isActive,
      tagIds: script.tags.map(st => st.tagId),
      luaContent: script.luaContent || "",
    },
  })

  // Watch arrays for dynamic fields
  const requirements = watch("requirements") || []
  const features = watch("features") || []
  const screenshots = watch("screenshots") || []
  const selectedTagIds = watch("tagIds") || []

  const onSubmit: SubmitHandler<ScriptUpdateData> = async (data) => {
    clearError()

    console.log("=== SCRIPT UPDATE DEBUG ===")
    console.log("Form data:", data)
    console.log("Form errors:", errors)
    console.log("Screenshots:", data.screenshots)
    console.log("Requirements:", data.requirements)
    console.log("Features:", data.features)
    console.log("Tags:", data.tagIds)

    try {
      // Filter out empty strings from arrays to avoid validation errors
      const cleanedData = {
        ...data,
        requirements: data.requirements?.filter(r => r.trim() !== ""),
        features: data.features?.filter(f => f.trim() !== ""),
        screenshots: data.screenshots?.filter(s => s.trim() !== ""),
        luaContent: luaCode,
      }

      console.log("Cleaned submit data:", cleanedData)

      await updateScript(cleanedData)

      console.log("Update successful!")

      // On success, navigate to script detail page
      router.push(`/script/${script.id}`)
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  // Array field handlers
  const addRequirement = () => {
    const newRequirements = [...(requirements || []), ""]
    setValue("requirements", newRequirements, { shouldValidate: false, shouldDirty: true })
  }

  const removeRequirement = (index: number) => {
    setValue("requirements", requirements.filter((_, i) => i !== index), { shouldValidate: false, shouldDirty: true })
  }

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements]
    newRequirements[index] = value
    setValue("requirements", newRequirements, { shouldValidate: false, shouldDirty: true })
  }

  const addFeature = () => {
    const newFeatures = [...(features || []), ""]
    setValue("features", newFeatures, { shouldValidate: false, shouldDirty: true })
  }

  const removeFeature = (index: number) => {
    setValue("features", features.filter((_, i) => i !== index), { shouldValidate: false, shouldDirty: true })
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setValue("features", newFeatures, { shouldValidate: false, shouldDirty: true })
  }

  const addScreenshot = () => {
    const newScreenshots = [...(screenshots || []), ""]
    setValue("screenshots", newScreenshots, { shouldValidate: false, shouldDirty: true })
  }

  const removeScreenshot = (index: number) => {
    setValue("screenshots", screenshots.filter((_, i) => i !== index), { shouldValidate: false, shouldDirty: true })
  }

  const updateScreenshot = (index: number, value: string) => {
    const newScreenshots = [...screenshots]
    newScreenshots[index] = value
    setValue("screenshots", newScreenshots, { shouldValidate: false, shouldDirty: true })
  }

  const toggleTag = (tagId: string) => {
    const newTags = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId]
    setValue("tagIds", newTags)
  }

  return (
    <Card className="bg-mehub-card border-mehub-border p-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-mehub-primary hover:underline mb-6"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-mehub-text mb-2">
              Script Title *
            </label>
            <input
              {...register("title")}
              type="text"
              id="title"
              className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text focus:ring-2 focus:ring-mehub-primary focus:border-transparent"
              placeholder="My Awesome Script"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Version */}
          <div>
            <label htmlFor="version" className="block text-sm font-medium text-mehub-text mb-2">
              Version *
            </label>
            <input
              {...register("version")}
              type="text"
              id="version"
              className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text focus:ring-2 focus:ring-mehub-primary focus:border-transparent"
              placeholder="1.0.0"
            />
            {errors.version && (
              <p className="text-red-500 text-sm mt-1">{errors.version.message}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-mehub-text mb-2">
            Category *
          </label>
          <select
            {...register("categoryId")}
            id="categoryId"
            className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text focus:ring-2 focus:ring-mehub-primary focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-mehub-text mb-2">
            Short Description *
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={3}
            className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text focus:ring-2 focus:ring-mehub-primary focus:border-transparent resize-none"
            placeholder="Brief description of your script (max 500 characters)"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Full Description */}
        <div>
          <label htmlFor="fullDescription" className="block text-sm font-medium text-mehub-text mb-2">
            Full Description *
          </label>
          <textarea
            {...register("fullDescription")}
            id="fullDescription"
            rows={6}
            className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text focus:ring-2 focus:ring-mehub-primary focus:border-transparent resize-none"
            placeholder="Detailed description of your script (min 50 characters)"
          />
          {errors.fullDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.fullDescription.message}</p>
          )}
        </div>

        {/* Lua Code Editor */}
        <div>
          <label className="block text-sm font-medium text-mehub-text mb-2">
            Lua Code
          </label>
          <LuaCodeEditor
            value={luaCode}
            onChange={setLuaCode}
            height="500px"
          />
          <p className="text-mehub-text-secondary text-sm mt-2">
            Write your Lua script code here with full syntax highlighting
          </p>
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-mehub-text mb-2">
            Requirements
          </label>
          {requirements.map((req, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => updateRequirement(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text focus:ring-2 focus:ring-mehub-primary focus:border-transparent"
                placeholder="e.g., Level 70 Combat"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeRequirement(index)}
                className="border-mehub-border text-mehub-text hover:bg-red-500/10 hover:border-red-500"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addRequirement}
            className="border-mehub-border text-mehub-text hover:bg-mehub-hover mt-2"
          >
            Add Requirement
          </Button>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-mehub-text mb-2">
            Features
          </label>
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text focus:ring-2 focus:ring-mehub-primary focus:border-transparent"
                placeholder="e.g., Auto prayer switching"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeFeature(index)}
                className="border-mehub-border text-mehub-text hover:bg-red-500/10 hover:border-red-500"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addFeature}
            className="border-mehub-border text-mehub-text hover:bg-mehub-hover mt-2"
          >
            Add Feature
          </Button>
        </div>

        {/* Screenshots */}
        <div>
          <label className="block text-sm font-medium text-mehub-text mb-2">
            Screenshots (URLs)
          </label>
          <p className="text-sm text-mehub-text-secondary mb-3">
            💡 Tip: Use direct image URLs ending in .jpg, .png, .gif, or .webp.
            For best results, upload to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-mehub-accent hover:underline">Imgur</a> or <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-mehub-accent hover:underline">ImgBB</a>.
          </p>
          {screenshots.map((screenshot, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={screenshot}
                onChange={(e) => updateScreenshot(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text focus:ring-2 focus:ring-mehub-primary focus:border-transparent"
                placeholder="https://example.com/screenshot.jpg"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeScreenshot(index)}
                className="border-mehub-border text-mehub-text hover:bg-red-500/10 hover:border-red-500"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addScreenshot}
            className="border-mehub-border text-mehub-text hover:bg-mehub-hover mt-2"
          >
            Add Screenshot
          </Button>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-mehub-text mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? "bg-mehub-accent text-mehub-bg hover:bg-mehub-accent/90"
                    : "bg-mehub-bg border border-mehub-border text-mehub-text hover:border-mehub-accent"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <input
            {...register("isActive")}
            type="checkbox"
            id="isActive"
            className="w-4 h-4 text-mehub-primary bg-mehub-bg border-mehub-border rounded focus:ring-mehub-primary"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-mehub-text">
            Script is Active (visible in marketplace)
          </label>
        </div>

        {/* Validation Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
            <p className="text-yellow-500 font-medium mb-2">Validation Errors:</p>
            <ul className="list-disc list-inside text-yellow-500 text-sm">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  {field}: {error?.message?.toString() || "Invalid value"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isUpdating}
            variant="outline"
            className="border-mehub-border text-mehub-text hover:bg-mehub-hover"
            onClick={() => {
              console.log("Update button clicked!")
              console.log("Current form errors:", errors)
              console.log("Is form valid:", Object.keys(errors).length === 0)
            }}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Script"
            )}
          </Button>
          <Link href="/dashboard">
            <Button
              type="button"
              variant="outline"
              className="border-mehub-border text-mehub-text hover:bg-mehub-hover"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  )
}

