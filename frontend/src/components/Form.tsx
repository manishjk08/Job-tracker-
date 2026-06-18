import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { X } from "lucide-react";
import type { Application, CreateApplicationPayload } from "../types";

type Props = {
  editing: Application | null;
  onSubmit: (data: CreateApplicationPayload) => void;
  onClose: () => void;
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none";

const emptyForm: CreateApplicationPayload = {
  company_name: "",
  job_title: "",
  job_type: "Full-time",
  status: "Applied",
  applied_date: new Date().toISOString().slice(0, 10),
};

const Form = ({ editing, onSubmit, onClose }: Props) => {
  const { register, handleSubmit, reset } = useForm<CreateApplicationPayload>({
    defaultValues: emptyForm,
  });

  useEffect(() => {
    if (editing) {
      reset({
        company_name: editing.company_name,
        job_title: editing.job_title,
        job_type: editing.job_type,
        status: editing.status,
        applied_date: editing.applied_date.slice(0, 10),
      });
    } else {
      reset(emptyForm);
    }
  }, [editing, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {editing ? "Edit Application" : "Add Application"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              className={inputClass}
              placeholder="e.g. Google"
              {...register("company_name", { required: true })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              className={inputClass}
              placeholder="e.g. Backend Developer"
              {...register("job_title", { required: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Job Type
              </label>
              <select
                className={inputClass}
                {...register("job_type", { required: true })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className={inputClass}
                {...register("status", { required: true })}
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Applied Date
            </label>
            <input
              type="date"
              className={inputClass}
              {...register("applied_date", { required: true })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gray-900 py-2 text-sm text-white hover:bg-gray-800"
            >
              {editing ? "Save changes" : "Add application"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
