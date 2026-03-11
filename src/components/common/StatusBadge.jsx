const STATUS_STYLES = {
  "Submitted":    "bg-yellow-100 text-yellow-800",
  "In Progress":  "bg-blue-100 text-blue-800",
  "Under Review": "bg-purple-100 text-purple-800",
  "Resolved":     "bg-green-100 text-green-800",
  "Closed":       "bg-gray-100 text-gray-600",
  "Approved":     "bg-green-100 text-green-800",
  "Active":       "bg-green-100 text-green-800",
  "Rejected":     "bg-red-100 text-red-600",
  "Pending":      "bg-yellow-100 text-yellow-800",
  "Matched":      "bg-blue-100 text-blue-800",
  "Urgent":       "bg-red-100 text-red-800",
  "High":         "bg-red-100 text-red-700",
  "Medium":       "bg-yellow-100 text-yellow-700",
  "Low":          "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || "bg-gray-100 text-gray-600";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

