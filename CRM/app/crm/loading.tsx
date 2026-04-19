export default function CrmLoading() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}
