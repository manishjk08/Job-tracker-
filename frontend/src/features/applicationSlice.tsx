import axios from "axios";
import api from "../services/api";
import type { Application, CreateApplicationPayload, DeleteApplicationPayload, EditApplicationPayload, GetSingleApplicationPayload,GetApplicationsPayload,PaginatedResponse } from "../types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

interface applicationState{
    applications:Application[]
    selectedApplication:Application|null
    loading:boolean
    error:string|null
    pagination: {
    currentPage: number
    totalPages: number
    total: number
    limit: number
  }
   filters: {
    status: string
  }
}

const initialState:applicationState={
    applications:[],
    selectedApplication:null,
    loading:true,
    error:null,
    pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 5
  },
  filters: {
    status: 'Applied'
  }
}

export const createApplications=createAsyncThunk<Application,CreateApplicationPayload,{rejectValue:string}>(
    'applications/create',
    async(data,{rejectWithValue})=>{
        try {
            const response=await api.post('/applications',data)
            return response.data.data
        } catch (error:unknown) {
            if(axios.isAxiosError(error)){
              return rejectWithValue(error.response?.data?.error || 'Failed to create application');  
            }
            return rejectWithValue("Something went Wrong")
        }
    }
)
export const getApplications=createAsyncThunk<PaginatedResponse,GetApplicationsPayload|void,{rejectValue:string}>(
    'applications/get',
    async(params,{rejectWithValue})=>{
        try {
            const queryParams=new URLSearchParams();
            if (params) {
        if (params.status) queryParams.append('status', params.status);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
      }
      const queryString=queryParams.toString();
      const url=`/applications${queryString? `?${queryString}`:""}`
            const response=await api.get(url)
            return response.data.data
        } catch (error:unknown) {
            if(axios.isAxiosError(error)){
              return rejectWithValue(error.response?.data?.error || 'Cant fetch applications');  
            }
            return rejectWithValue("Something went Wrong")
        }
    }
)
export const getSingleApplication=createAsyncThunk<Application,GetSingleApplicationPayload,{rejectValue:string}>(
    'applications/get/id',
    async({id},{rejectWithValue})=>{
        try {
            const response=await api.get(`/applications/${id}`)
            return response.data.data
        } catch (error:unknown) {
            if(axios.isAxiosError(error)){
              return rejectWithValue(error.response?.data?.error || 'Cant fetch application');  
            }
            return rejectWithValue("Something went Wrong")
        }
    }
)
export const editApplications=createAsyncThunk<Application,EditApplicationPayload,{rejectValue:string}>(
    'applications/edit',
    async({id,data},{rejectWithValue})=>{
        try {
            const response=await api.patch(`/applications/${id}`,data)
            return response.data.data
        } catch (error:unknown) {
            if(axios.isAxiosError(error)){
              return rejectWithValue(error.response?.data?.error || 'Failed to update application');  
            }
            return rejectWithValue("Something went Wrong")
        }
    }
)
export const deleteApplications=createAsyncThunk<number,DeleteApplicationPayload,{rejectValue:string}>(
    'applications/delete',
    async({id},{rejectWithValue})=>{
        try {
            await api.delete(`/applications/${id}`)
            return id
        } catch (error:unknown) {
            if(axios.isAxiosError(error)){
              return rejectWithValue(error.response?.data?.error || 'Failed to update application');  
            }
            return rejectWithValue("Something went Wrong")
        }
    }
)

const applicationSlice=createSlice({
    name:"applications",
    initialState,
    reducers:{
        clearError(state){
            state.error=null
        },
        clearSelectedApplication(state){
            state.selectedApplication=null
        },
        setPage(state, action) {
      state.pagination.currentPage = action.payload
    },
    setStatusFilter(state, action) {
      state.filters.status = action.payload
      state.pagination.currentPage = 1 // Reset to first page when filter changes
    },
    setLimit(state, action) {
      state.pagination.limit = action.payload
      state.pagination.currentPage = 1 // Reset to first page when limit changes
    },
    resetFilters(state) {
      state.filters.status = 'Applied'
      state.pagination.currentPage = 1
    }
    },
    extraReducers:(builder)=>{
        builder
        //CREATE APPLICATIONS
            .addCase(createApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createApplications.fulfilled, (state, action) => {
                state.loading = false;
                const exist=state.applications.find(
                    (app)=>app.id===action.payload.id
                )
                if(!exist){
                    state.applications.push(action.payload);
                }
                
            })
            .addCase(createApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Something went wrong";
            })
            //GET APPLICATIONS
            .addCase(getApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getApplications.fulfilled, (state,action) => {
                state.loading = false;
                state.applications=action.payload.data
                state.pagination.currentPage = action.payload.page;
                state.pagination.totalPages = action.payload.totalPages;
                state.pagination.total = action.payload.total;
                state.pagination.limit = action.payload.limit;
            })
            .addCase(getApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Something went wrong";
            })
            //GET SINGLE APPLICATIONS
            .addCase(getSingleApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleApplication.fulfilled, (state,action) => {
                state.loading = false;
                state.selectedApplication=action.payload
            })
            .addCase(getSingleApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Something went wrong";
            })
            //EDIT APPLICATIONS
            .addCase(editApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editApplications.fulfilled, (state,action) => {
                state.loading = false;
                const updated=action.payload
                const index=state.applications.findIndex(
                    (app)=>Number(app.id)===Number(updated.id)
                )
                if(index !== -1){
                    state.applications[index]=updated
                }
            })
            .addCase(editApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to update applications";
            })
            //Delete APPLICATIONS
            .addCase(deleteApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteApplications.fulfilled, (state,action) => {
                state.loading = false;
                const deletedId=action.payload
                state.applications=state.applications.filter(
                    (app)=>app.id !== deletedId
                )
                state.pagination.total -= 1
            })
            .addCase(deleteApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to delete applications";
            })
    }
})

export const { clearError, clearSelectedApplication,setLimit,setPage,setStatusFilter,resetFilters } = applicationSlice.actions;
export default applicationSlice.reducer;