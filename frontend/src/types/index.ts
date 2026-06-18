export type JobType="Full-time" | "Part-time" | "Internship" 
export type Status="Applied"|"Offer"|"Interviewing"|"Rejected";

export interface Application{
    id:number;
    company_name:string;
    job_title:string;
    job_type: JobType;
    status:Status
    applied_date:string;
    notes?:string;
    created_at: string;
    updated_at: string;
}
export interface PaginatedResponse {
  data: Application[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetApplicationsPayload {
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateApplicationPayload{
    company_name:string;
    job_title:string;
    job_type: JobType
    status:Status
    applied_date:string;
    notes?:string;
}
export interface EditApplicationPayload {
  id: number;
  data: CreateApplicationPayload;
}

export interface DeleteApplicationPayload {
  id: number;
};
export interface GetSingleApplicationPayload {
  id: number;
};