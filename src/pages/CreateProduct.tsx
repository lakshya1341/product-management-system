import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

type ApprovalStatus="pending"|"approved"|"rejected"
type Approval={
 status:ApprovalStatus
 timestamp:string|null
}
type Approvals={
 Lakshya:Approval
 "Imran Sir":Approval
 "Kartik Sir":Approval
}
type Product={
 id:string
 title:string
 category:string
 image:string
 approvals:Approvals
}
type FormData={
 title:string
 category:string
 image:FileList
}
const API_URL="http://69b2bbabe06ef68ddd9616f6.mockapi.io/products"
const AUDIT_API="http://69b2bbabe06ef68ddd9616f6.mockapi.io/audit"

const CreateProduct=()=>{
 const navigate=useNavigate()
 const { id } = useParams()
 const [searchParams] = useSearchParams()
 const search = searchParams.get("search") || ""
 const time = new Date().toISOString()

 const user=JSON.parse(localStorage.getItem("user")||"{}")

 const {register,handleSubmit,reset}=useForm<FormData>()

 const approvalUsers:(keyof Approvals)[]=[
  "Lakshya",
  "Imran Sir",
  "Kartik Sir"
 ]
  const [product, setProduct] = useState<Product | null>(null)
  const [approvals, setApprovals] = useState<Approvals>({
    Lakshya: { status: "pending", timestamp: null },
    "Imran Sir": { status: "pending", timestamp: null },
    "Kartik Sir": { status: "pending", timestamp: null }
  })
  const [pendingApprovals, setPendingApprovals] = useState<Approvals>(approvals)
  const resetApprovals = () : Approvals => ({
   Lakshya:{status:"pending",timestamp:null},
   "Imran Sir":{status:"pending",timestamp:null},
   "Kartik Sir":{status:"pending",timestamp:null}
  })
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`)
        const data = await res.json()
        setProduct(data)
        setApprovals(data.approvals)
        setPendingApprovals(data.approvals)
        reset({
          title: data.title,
          category: data.category
        })
      } catch (error) {
        console.log("Error fetching product", error)
      }
    }
    if (id) {
      fetchProduct()
    }
  }, [id, reset])

 const handleAction=(userKey:keyof Approvals,action:string)=>{

  const updated={
   ...pendingApprovals,
   [userKey]:{
    status:action as ApprovalStatus,
    timestamp:time
   }
  }
  if(action==="rejected"){
   const index=approvalUsers.indexOf(userKey)
   for(let i=index+1;i<approvalUsers.length;i++){
    updated[approvalUsers[i]]={
     status:"pending",
     timestamp:null
    }
   }
  }
 
  setPendingApprovals(updated)
 }
 const onSubmit=async(data:FormData)=>{
  const file=data.image?.[0]
  const imageUrl=file?URL.createObjectURL(file):product?.image||""

  if(product){
  const auditLogs:any[]=[]

  if(product.title !== data.title){
    auditLogs.push({
      productId:String(product.id),
      user:user.name,
      field:"title",
      oldValue:product.title,
      newValue:data.title,
      action:"edit",
      timestamp:time
    })
  }
  if(product.category !== data.category){
    auditLogs.push({
      productId:String(product.id),
      user:user.name,
      field:"category",
      oldValue:product.category,
      newValue:data.category,
      action:"edit",
      timestamp:time
    })
  }
  if(product.image !== imageUrl){
    auditLogs.push({
      productId:String(product.id),
      user:user.name,
      field:"image",
      oldValue:product.image,
      newValue:imageUrl,
      action:"edit",
      timestamp:time
    })
  }
  
  const changed = 
    product.title !== data.title ||
    product.category !== data.category||
    product.image !== imageUrl

  const finalApprovals = changed ? resetApprovals() : pendingApprovals

  setApprovals(finalApprovals)
  setPendingApprovals(finalApprovals)

  const updatedProduct={
    ...product,
    title:data.title,
    category:data.category,
    image:imageUrl,
    approvals: finalApprovals
   }
   await fetch(`${API_URL}/${product.id}`,{
    method:"PUT",
    headers:{
     "Content-Type":"application/json"
    },
    body:JSON.stringify(updatedProduct)
   })
   await Promise.all(
    auditLogs.map(log =>
      fetch(AUDIT_API,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(log)
      })
    )
   )
  }else{
   const newProduct={
    title:data.title,
    category:data.category,
    image:imageUrl,
    approvals:pendingApprovals
   }
   await fetch(API_URL,{
    method:"POST",
    headers:{
     "Content-Type":"application/json"
    },
    body:JSON.stringify(newProduct)
   })
  }
  navigate(`/products?search=${search}`)
 }
 const isLakshya=user?.name==="Lakshya"
//  const canEditImage=user?.name==="Lakshya"||user?.name==="Imran Sir"||user?.name==="Kartik Sir"

 return(
  <div>
   <h1 className="text-2xl font-bold mb-4">
    {product?"Edit Product":"Create Product"}
   </h1>
   <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
    <input
     {...register("title")}
     placeholder="Title"
     disabled={!isLakshya}
     className="border p-2 w-full"
    />
    <input
     {...register("category")}
     placeholder="Category"
     disabled={!isLakshya}
     className="border p-2 w-full"
    />
    <input
     type="file"
     {...register("image")}
    //  disabled={!canEditImage}
     className="border p-2 w-full"
    />
    <button
     type="submit"
     className="bg-blue-500 text-white px-4 py-2 rounded"
    >
     Submit
    </button>
   </form>
   {id && (
   <div className="mt-6">
    <h2 className="font-bold mb-2">
     Approval Matrix
    </h2>
    <table className="w-full border">
     <thead>
      <tr className="bg-gray-100">
       <th className="p-2">Approver</th>
       <th className="p-2">Status</th>
       {/* <th className="p-2">Timestamp</th> */}
       <th className="p-2">Action</th>
      </tr>
     </thead>

     <tbody>
      {approvalUsers.map((userKey,index)=>{
       const previousUser=approvalUsers[index-1]
       const disabled=
        user?.name!==userKey||
        approvals[userKey].status!=="pending"||
        (index>0&&approvals[previousUser].status!=="approved")
       return(
        <tr key={userKey} className="border-t">
         <td className="p-2">{userKey}</td>
         <td className="p-2">
          {approvals[userKey].status}
         </td>
         {/* <td className="p-2">
          {approvals[userKey].timestamp||"-"}
         </td> */}
         <td className="p-2">
          <select
           disabled={disabled}
           value={pendingApprovals[userKey].status ==="pending" ? "" : pendingApprovals[userKey].status}
           onChange={(e)=>handleAction(userKey,e.target.value)}
           className="border p-1">
           <option value="">Select Action</option>
           <option value="approved">Approve</option>
           <option value="rejected">Reject</option>
          </select>
         </td>
        </tr>
       )
      })}
     </tbody>
    </table>
   </div>
    )}
  </div>
 )}
export default CreateProduct
