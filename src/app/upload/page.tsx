"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronRight, ChevronLeft, Check, UploadIcon } from "lucide-react"
import { mockCategories } from "@/lib/mock-data"

type FormStep = "basic" | "details" | "files" | "review"

interface FormData {
  title: string
  category: string
  tags: string[]
  description: string
  fullDescription: string
  features: string[]
  requirements: string[]
  version: string
}

export default function UploadPage() {
  const [step, setStep] = useState<FormStep>("basic")
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    tags: [],
    description: "",
    fullDescription: "",
    features: [],
    requirements: [],
    version: "1.0.0",
  })
  const [tagInput, setTagInput] = useState("")
  const [featureInput, setFeatureInput] = useState("")
  const [requirementInput, setRequirementInput] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [screenshots, setScreenshots] = useState<string[]>([])

  const steps: { id: FormStep; label: string; icon: string }[] = [
    { id: "basic", label: "Basic Info", icon: "📝" },
    { id: "details", label: "Details", icon: "📋" },
    { id: "files", label: "Files & Media", icon: "📦" },
    { id: "review", label: "Review", icon: "✅" },
  ]

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }))
      setFeatureInput("")
    }
  }

  const handleAddRequirement = () => {
    if (requirementInput.trim() && !formData.requirements.includes(requirementInput)) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }))
      setRequirementInput("")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          setScreenshots((prev) => [...prev, event.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const nextStep = () => {
    const stepOrder: FormStep[] = ["basic", "details", "files", "review"]
    const currentIdx = stepOrder.indexOf(step)
    if (currentIdx < stepOrder.length - 1) {
      setStep(stepOrder[currentIdx + 1])
    }
  }

  const prevStep = () => {
    const stepOrder: FormStep[] = ["basic", "details", "files", "review"]
    const currentIdx = stepOrder.indexOf(step)
    if (currentIdx > 0) {
      setStep(stepOrder[currentIdx - 1])
    }
  }

  const _isBasicComplete = formData.title && formData.category
  const _isDetailsComplete = formData.description && formData.fullDescription && formData.features.length > 0
  const _isFilesComplete = uploadedFiles.length > 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-mehub-text mb-2">Upload Your Script</h1>
          <p className="text-mehub-text-secondary">Share your automation script with the community</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, idx) => {
              const stepOrder: FormStep[] = ["basic", "details", "files", "review"]
              const currentIdx = stepOrder.indexOf(step)
              const stepIdx = stepOrder.indexOf(s.id)
              const isCompleted = stepIdx < currentIdx
              const isCurrent = stepIdx === currentIdx

              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold transition-colors ${
                      isCompleted
                        ? "bg-mehub-success border-mehub-success text-mehub-bg"
                        : isCurrent
                          ? "bg-mehub-primary border-mehub-primary text-mehub-bg"
                          : "bg-mehub-card border-mehub-border text-mehub-text-secondary"
                    }`}
                  >
                    {isCompleted ? <Check size={20} /> : s.icon}
                  </div>
                  <div className="ml-3">
                    <div
                      className={`text-sm font-medium ${isCurrent ? "text-mehub-primary" : "text-mehub-text-secondary"}`}
                    >
                      {s.label}
                    </div>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full ${isCompleted ? "bg-mehub-success" : "bg-mehub-border"}`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className="bg-mehub-card border-mehub-border p-8 mb-8">
          {/* Step: Basic Info */}
          {step === "basic" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mehub-text mb-6">Basic Information</h2>

              <div>
                <label className="block text-mehub-text font-medium mb-2">Script Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="E.g., Automated Email Campaign Builder"
                  className="w-full px-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-mehub-text font-medium mb-2">Category *</label>
<select
  value={formData.category}
  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
  className="w-full px-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text focus:border-mehub-primary outline-none"
>
  <option value="" className="text-black bg-white">Select a category</option>
  {mockCategories.map((cat) => (
    <option key={cat.id} value={cat.name} className="text-black bg-white">
      {cat.icon} {cat.name}
    </option>
  ))}
</select>
              </div>

              <div>
                <label className="block text-mehub-text font-medium mb-2">Short Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="One-line description of your script"
                  rows={3}
                  className="w-full px-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none resize-none"
                />
                <div className="text-mehub-text-secondary text-sm mt-1">{formData.description.length}/100</div>
              </div>

              <div>
                <label className="block text-mehub-text font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag and press Enter"
                    className="flex-1 px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
                  />
                  <Button onClick={handleAddTag} className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-mehub-primary/20 text-mehub-primary text-sm rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-mehub-text">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step: Details */}
          {step === "details" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mehub-text mb-6">Script Details</h2>

              <div>
                <label className="block text-mehub-text font-medium mb-2">Full Description *</label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullDescription: e.target.value }))}
                  placeholder="Detailed description of what your script does..."
                  rows={6}
                  className="w-full px-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-mehub-text font-medium mb-2">Features *</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                    placeholder="Add a feature and press Enter"
                    className="flex-1 px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
                  />
                  <Button
                    onClick={handleAddFeature}
                    className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90"
                  >
                    Add
                  </Button>
                </div>
                <ul className="space-y-2">
                  {formData.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2 bg-mehub-bg rounded border border-mehub-border"
                    >
                      <span className="text-mehub-text">{feature}</span>
                      <button
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))
                        }
                        className="text-mehub-text-secondary hover:text-mehub-text"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block text-mehub-text font-medium mb-2">Requirements</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRequirement())}
                    placeholder="Add a requirement and press Enter"
                    className="flex-1 px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
                  />
                  <Button
                    onClick={handleAddRequirement}
                    className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90"
                  >
                    Add
                  </Button>
                </div>
                <ul className="space-y-2">
                  {formData.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2 bg-mehub-bg rounded border border-mehub-border"
                    >
                      <span className="text-mehub-text">{req}</span>
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            requirements: prev.requirements.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-mehub-text-secondary hover:text-mehub-text"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block text-mehub-text font-medium mb-2">Version</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                  placeholder="1.0.0"
                  className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary outline-none"
                />
              </div>
            </div>
          )}

          {/* Step: Files & Media */}
          {step === "files" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mehub-text mb-6">Files & Screenshots</h2>

              <div>
                <label className="block text-mehub-text font-medium mb-2">Upload Script Files *</label>
                <div className="border-2 border-dashed border-mehub-border rounded-lg p-8 text-center hover:border-mehub-primary transition-colors cursor-pointer">
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <UploadIcon size={40} className="mx-auto mb-2 text-mehub-primary" />
                    <p className="text-mehub-text font-medium">Click to upload or drag and drop</p>
                    <p className="text-mehub-text-secondary text-sm">PNG, JPG, ZIP, PY, JS, etc.</p>
                  </label>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-mehub-bg rounded border border-mehub-border"
                      >
                        <span className="text-mehub-text">{file.name}</span>
                        <button
                          onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-mehub-text-secondary hover:text-mehub-text"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-mehub-text font-medium mb-2">Upload Screenshots</label>
                <div className="border-2 border-dashed border-mehub-border rounded-lg p-8 text-center hover:border-mehub-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer">
                    <UploadIcon size={40} className="mx-auto mb-2 text-mehub-primary" />
                    <p className="text-mehub-text font-medium">Click to upload screenshots</p>
                    <p className="text-mehub-text-secondary text-sm">PNG, JPG up to 5MB each</p>
                  </label>
                </div>
                {screenshots.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {screenshots.map((screenshot, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={screenshot || "/placeholder.svg"}
                          alt={`Screenshot ${idx + 1}`}
                          className="w-full h-32 object-cover rounded border border-mehub-border"
                        />
                        <button
                          onClick={() => setScreenshots((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step: Review */}
          {step === "review" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mehub-text mb-6">Review & Submit</h2>

              <div className="space-y-4">
                <div className="p-4 bg-mehub-bg rounded-lg border border-mehub-border">
                  <div className="text-mehub-text-secondary text-sm mb-1">Title</div>
                  <div className="text-mehub-text font-medium">{formData.title}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-mehub-bg rounded-lg border border-mehub-border">
                    <div className="text-mehub-text-secondary text-sm mb-1">Category</div>
                    <div className="text-mehub-text font-medium">{formData.category}</div>
                  </div>
                  <div className="p-4 bg-mehub-bg rounded-lg border border-mehub-border">
                    <div className="text-mehub-text-secondary text-sm mb-1">Version</div>
                    <div className="text-mehub-text font-medium">{formData.version}</div>
                  </div>
                </div>

                <div className="p-4 bg-mehub-bg rounded-lg border border-mehub-border">
                  <div className="text-mehub-text-secondary text-sm mb-1">Description</div>
                  <div className="text-mehub-text">{formData.description}</div>
                </div>

                <div className="p-4 bg-mehub-bg rounded-lg border border-mehub-border">
                  <div className="text-mehub-text-secondary text-sm mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-mehub-primary/20 text-mehub-primary text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-mehub-bg rounded-lg border border-mehub-border">
                  <div className="text-mehub-text-secondary text-sm mb-1">Files Ready</div>
                  <div className="text-mehub-text">{uploadedFiles.length} files uploaded</div>
                </div>

                <div className="p-4 bg-mehub-bg rounded-lg border border-mehub-border">
                  <div className="text-mehub-text-secondary text-sm mb-1">Screenshots Ready</div>
                  <div className="text-mehub-text">{screenshots.length} screenshots uploaded</div>
                </div>
              </div>

              <div className="bg-mehub-primary/10 border border-mehub-primary rounded-lg p-4 text-mehub-text">
                <p>By uploading, you agree to our Terms of Service. Your script will be reviewed before publication.</p>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            onClick={prevStep}
            disabled={step === "basic"}
            className="flex items-center gap-2 border-mehub-border text-mehub-text hover:bg-mehub-hover disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
            variant="outline"
          >
            <ChevronLeft size={20} />
            Previous
          </Button>

          {step === "review" ? (
            <Button className="bg-mehub-success text-mehub-bg hover:bg-mehub-success/90 flex items-center gap-2">
              <Check size={20} />
              Publish Script
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90 flex items-center gap-2"
            >
              Next
              <ChevronRight size={20} />
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-mehub-border bg-mehub-card/50 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-mehub-text-secondary text-sm">
          <p>&copy; 2025 MEhub. Made for developers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}
