import { applicationModel } from "../model/application.js";


//GET  api/applications/
export const getApplications =async(req,res,next)=>{
    try {
        const{status,search,page,limit}=req.query
        const applications=await applicationModel.getApplications({
            search,
            status,
            page,
            limit
        })
        res.status(200).json(
            {
                success:true,
                message:applications.data.length>0?"Your applications":"No applications yet",
                data:applications
            }
        )
    } catch (error) {
        next(error)
    }
}

//GEt api/applications/:id
export const getSingleApplication=async(req,res,next)=>{
    try {
        const{id}=req.params
        const application=await applicationModel.findByID(id)
        if(!application){
            res.status(404)
            throw new Error("Application not found")
        }
        res.status(200).json(
            {
                success:true,
                message:"Your application",
                data:application
            }
        )
    } catch (error) {
        next(error)
    }
}

//POST api/applications/
export const createApplications=async(req,res,next)=>{
    try {
        const{company_name,job_title,job_type,status,applied_date,notes}=req.body
        const existing=await applicationModel.findByNameAndTitle(company_name,job_title,applied_date)
        if(existing){
            res.status(400)
            throw new Error("Application already exists")
        }
        const applications=await applicationModel.createApplication(company_name,job_title,job_type,status,applied_date,notes)
        res.status(200).json(
            {
                success:true,
                message:"New job Applications created",
                data:applications
            }
        )
    } catch (error) {
        next(error)
    }
}

//UPDATE api/applications/:id
export const updateApplications=async(req,res,next)=>{
    try {
        const{id}=req.params
        const applicationData=req.body
        const updated=await applicationModel.findByIdAndUpdate(id,applicationData)
        if(!updated){
            res.status(404);
            throw new Error("Application not found")
        }
        res.status(200).json(
            {
                success:true,
                message:"Updated Applications",
                data:updated
            }
        )
    } catch (error) {
        next(error)
    }
}

//DELETE api/applications/:id
export const deleteApplications=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const deletedApplication=await applicationModel.deleteApplication(id)

        if(!deletedApplication){
            res.status(404)
            throw new Error("Application not found")
        }
        res.status(200).json(
            {
                success:true,
                message:"Applications deleted",
                data:id
            }
        )
    } catch (error) {
        next(error)
    }
}
