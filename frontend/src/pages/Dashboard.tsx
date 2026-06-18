import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import {
  getApplications,
  createApplications,
  editApplications,
  deleteApplications,
  setPage,
  setStatusFilter,
  setLimit,
} from "../features/applicationSlice";
import Form from "../components/Form";
import Table from "../components/Table";
import type { Application, CreateApplicationPayload, Status } from "../types";

type StatusFilter = "All" | Status;
const STATUSES: StatusFilter[] = ["All", "Applied", "Interviewing", "Offer", "Rejected"];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    applications,
    loading,
    pagination,
    filters,
  } = useAppSelector((state) => state.applications);

  const [editing, setEditing] = useState<Application | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Parse URL params 
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page') || '1');
    const status = params.get('status') || 'All';
    const limit = parseInt(params.get('limit') || '5');

    
    if (page !== pagination.currentPage) {
      dispatch(setPage(page));
    }
    if (status !== filters.status) {
      dispatch(setStatusFilter(status as StatusFilter));
    }
    if (limit !== pagination.limit) {
      dispatch(setLimit(limit));
    }

   
    const searchQuery = params.get('search') || '';
    setSearch(searchQuery);
    setSearchTerm(searchQuery);
  }, []); 

  
  useEffect(() => {
    const params = new URLSearchParams();

    
    if (filters.status && filters.status !== 'All') {
      params.set('status', filters.status);
    }

    if (pagination.currentPage > 1) {
      params.set('page', pagination.currentPage.toString());
    }

    
    if (pagination.limit !== 5) {
      params.set('limit', pagination.limit.toString());
    }

   
    if (searchTerm) {
      params.set('search', searchTerm);
    }

    const searchString = params.toString();
    navigate(`${location.pathname}${searchString ? `?${searchString}` : ''}`, { replace: true });
  }, [filters.status, pagination.currentPage, pagination.limit, searchTerm, navigate, location.pathname]);

  
  useEffect(() => {
    dispatch(getApplications({
      status: filters.status === "All" ? undefined : filters.status,
      page: pagination.currentPage,
      limit: pagination.limit,
    }));
  }, [dispatch, filters.status, pagination.currentPage, pagination.limit]);

  
  const handleFilterChange = (status: StatusFilter) => {
    if (status === "All") {
      dispatch(setStatusFilter("All"));
    } else {
      dispatch(setStatusFilter(status));
    }
    dispatch(setPage(1)); 
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      dispatch(setPage(page));
    }
  };

 
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLimit(Number(e.target.value)));
    dispatch(setPage(1)); 
  };

 
  //debounce handle
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search);
      if (search.trim()) {
        if (pagination.currentPage !== 1) {
          dispatch(setPage(1));
        }
      }
    }, 500); 

    return () => clearTimeout(timer);
  }, [search, dispatch]);

  const stats = useMemo(
    () => ({
      All: pagination.total,
      Applied: applications.filter((a) => a.status === "Applied").length,
      Interviewing: applications.filter((a) => a.status === "Interviewing").length,
      Offer: applications.filter((a) => a.status === "Offer").length,
      Rejected: applications.filter((a) => a.status === "Rejected").length,
    }),
    [applications, pagination.total]
  );

  
  const filteredApps = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return applications;

    return applications.filter((app) =>
      app.company_name.toLowerCase().includes(query) ||
      app.job_title.toLowerCase().includes(query)
    );
  }, [applications, searchTerm]);

  const handleSubmit = async (data: CreateApplicationPayload) => {
    try {
      if (editing) {
        await dispatch(editApplications({ id: editing.id, data })).unwrap();
      } else {
        await dispatch(createApplications(data)).unwrap();
      }
      setEditing(null);
      setShowForm(false);
      
      dispatch(getApplications({
        status: filters.status === "All" ? undefined : filters.status,
        page: pagination.currentPage,
        limit: pagination.limit,
      }));
    } catch (error) {
      console.error("Error submitting form:", error);
      
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      await dispatch(deleteApplications({ id })).unwrap();

      if (applications.length === 1 && pagination.currentPage > 1) {
        dispatch(setPage(pagination.currentPage - 1));
      } else {
        dispatch(getApplications({
          status: filters.status === "All" ? undefined : filters.status,
          page: pagination.currentPage,
          limit: pagination.limit,
        }));
      }
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (app: Application) => {
    setEditing(app);
    setShowForm(true);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

 
  const getPageNumbers = () => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    const delta = 1; 

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift('...');
    }
    if (current + delta < total - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }

    return range;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 font-sans">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white">
              <Briefcase size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Job Tracker</h1>
              <p className="text-sm text-gray-500">Track every application in one place</p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            <Plus size={16} />
            Add application
          </button>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                filters.status === status
                  ? "border-gray-400 bg-slate-100"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-xs text-gray-500">{status}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats[status]}</p>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Applications</h2>
              <p className="text-sm text-gray-500">
                Showing {applications.length} of {pagination.total} applications
                {filters.status !== "All" && ` (${filters.status})`}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              
              <select
                value={pagination.limit}
                onChange={handleLimitChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  placeholder="Search company or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-gray-400 focus:outline-none sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="p-5">
            {loading ? (
              <p className="py-8 text-center text-sm text-gray-500">Loading...</p>
            ) : (
              <>
                <Table
                  applications={filteredApps}
                  onView={setViewApp}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />

                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-gray-500">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${
                          pagination.currentPage === 1
                            ? "cursor-not-allowed border-gray-200 text-gray-400"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) =>
                          page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                              …
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page as number)}
                              className={`rounded-lg px-3 py-1.5 text-sm ${
                                pagination.currentPage === page
                                  ? "bg-gray-900 text-white"
                                  : "border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}
                      </div>

                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${
                          pagination.currentPage === pagination.totalPages
                            ? "cursor-not-allowed border-gray-200 text-gray-400"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showForm && (
          <Form
            editing={editing}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        )}

        {viewApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{viewApp.company_name}</h2>
                  <p className="text-sm text-gray-500">{viewApp.job_title}</p>
                </div>
                <span
                  className={`rounded-md px-2.5 py-0.5 text-xs font-medium ${
                    viewApp.status === 'Applied' ? 'bg-gray-100 text-gray-700' :
                    viewApp.status === 'Interviewing' ? 'bg-amber-100 text-amber-800' :
                    viewApp.status === 'Offer' ? 'bg-green-600 text-white' :
                    'bg-red-600 text-white'
                  }`}
                >
                  {viewApp.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Job Type: </span>
                  <span className="font-medium">{viewApp.job_type}</span>
                </p>
                <p>
                  <span className="text-gray-500">Applied Date: </span>
                  <span className="font-medium">{formatDate(viewApp.applied_date)}</span>
                </p>
                {viewApp.notes && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="text-gray-500">Notes:</p>
                    <p className="mt-1 text-gray-700">{viewApp.notes}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setViewApp(null)}
                className="mt-6 w-full rounded-lg border border-gray-300 py-2 text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;