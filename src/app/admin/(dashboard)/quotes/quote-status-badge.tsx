interface QuoteStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contacted', className: 'bg-purple-100 text-purple-700' },
  quoted: { label: 'Quoted', className: 'bg-amber-100 text-amber-700' },
  sent: { label: 'Sent', className: 'bg-green-100 text-green-700' },
  'in-progress': { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
};

export function QuoteStatusBadge({ status }: QuoteStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}
