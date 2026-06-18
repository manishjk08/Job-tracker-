import pool from  '../config/db.js'

export const applicationModel={

    findByID:async(id)=>{
        const result=await pool.query(
         `SELECT * from applications where id=$1`,
        [id]   
        )
        return result.rows[0] 
    },

    findByNameAndTitle:async(company_name,job_title,applied_date)=>{
        const result=await pool.query(
            `SELECT * from applications WHERE company_name=$1 AND job_title=$2 AND applied_date=$3`,
            [company_name,job_title,applied_date]
        )
        return result.rows[0]
    },

    createApplication:async(company_name,job_title,job_type,status,applied_date,notes)=>{
        const result=await pool.query(
            `INSERT into applications(company_name,job_title,job_type,status,applied_date,notes)
            VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
            [company_name,job_title,job_type,status,applied_date,notes]
        )
        return result.rows[0]
    },
    
    getApplications:async({search,status,page=1,limit=5})=>{

        const values=[]
        let whereClauses=[]
        let index=1

        if(search){
            whereClauses.push(
                `(company_name ILIKE $${index} OR job_title ILIKE $${index} )`
            );
            values.push(`%${search}%`);
            index++
        }
        if(status){
            whereClauses.push(
                `status = $${index}`
            )
            values.push(status)
            index++
        }

        const WHERESQL=whereClauses.length? 
        `WHERE ${whereClauses.join(" AND ")}` 
        :"";

        const safePage=Math.max(1,parseInt(page)||1);
        const safeLimit=Math.min(100,parseInt(limit)||5)
        const offset=(safePage-1)*safeLimit

        
        const countQuery=`SELECT Count(*) from applications ${WHERESQL}`
        const countResult=await pool.query(countQuery,values)     
        const total=parseInt(countResult.rows[0].count)

        const dataQuery=
            `SELECT * FROM applications 
             ${WHERESQL}
             ORDER by created_at desc 
             LIMIT $${index} OFFSET $${index+1}`;
        
        const result=await pool.query(dataQuery,[...values,safeLimit,offset])

        return {
            data:result.rows,
            total,
            page:safePage,
            limit:safeLimit,
            totalPages:Math.ceil(total/safeLimit)
        }
    },

    findByIdAndUpdate:async(id,applicationData)=>{
        const keys=Object.keys(applicationData)
        const values=Object.values(applicationData)

        const setClause=keys.map((key,i)=>`${key} = $${i+1}`).join(", ")
        const query=
            `UPDATE applications
            SET ${setClause},updated_at=NOW()
            Where id=$${keys.length+1}
            Returning * `;

            const result=await pool.query(query,[...values,id])
            return result.rows[0]
    },

    deleteApplication:async(id)=>{
        const result=await pool.query(
            `DELETE from applications Where id=$1 RETURNING *`,
            [id]
        )
        return result.rows[0]
    }
    

}