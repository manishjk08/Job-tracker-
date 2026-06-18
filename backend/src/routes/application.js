import express from 'express'
import { createApplications, deleteApplications, getApplications, getSingleApplication, updateApplications } from '../controller/application.js'


const router=express.Router()

router.route('/')
.post(createApplications)
.get(getApplications)

router.route('/:id')
.get(getSingleApplication)
.patch(updateApplications)
.delete(deleteApplications)
export default router
