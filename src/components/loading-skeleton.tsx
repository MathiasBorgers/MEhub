export function ScriptCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-40 bg-mehub-hover rounded-lg mb-4" />
      <div className="h-6 bg-mehub-hover rounded mb-2" />
      <div className="h-4 bg-mehub-hover rounded w-3/4" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-mehub-border">
      <td className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-mehub-hover rounded" />
          <div className="flex-1">
            <div className="h-4 bg-mehub-hover rounded mb-2" />
            <div className="h-3 bg-mehub-hover rounded w-2/3" />
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-mehub-hover rounded w-1/2" />
      </td>
      <td className="p-4">
        <div className="h-4 bg-mehub-hover rounded w-1/3 ml-auto" />
      </td>
    </tr>
  )
}
