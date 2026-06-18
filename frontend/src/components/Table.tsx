import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Application, Status } from "../types";

type Props = {
  applications: Application[];
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: number) => void;
};

const statusStyle: Record<Status, string> = {
  Applied: "bg-gray-100 text-gray-700",
  Interviewing: "bg-amber-100 text-amber-800",
  Offer: "bg-green-600 text-white",
  Rejected: "bg-red-600 text-white",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const Table = ({ applications, onView, onEdit, onDelete }: Props) => {
  if (applications.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">No applications found.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="pb-3 font-medium">Company</th>
            <th className="pb-3 font-medium">Job title</th>
            <th className="pb-3 font-medium">Type</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Applied</th>
            <th className="pb-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b border-gray-100">
              <td className="py-4 font-semibold text-gray-900">{app.company_name}</td>
              <td className="py-4 text-gray-700">{app.job_title}</td>
              <td className="py-4">
                <span className="rounded-md bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                  {app.job_type}
                </span>
              </td>
              <td className="py-4">
                <span
                  className={`rounded-md px-2.5 py-0.5 text-xs font-medium ${statusStyle[app.status]}`}
                >
                  {app.status}
                </span>
              </td>
              <td className="py-4 text-gray-600">{formatDate(app.applied_date)}</td>
              <td className="py-4">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onView(app)}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(app)}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
