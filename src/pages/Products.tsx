import { useEffect,useState} from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

const API_URL="http://69b2bbabe06ef68ddd9616f6.mockapi.io/products"
const AUDIT_API="http://69b2bbabe06ef68ddd9616f6.mockapi.io/audit"

const Products=()=>{
 const navigate=useNavigate()
 const [products,setProducts]=useState<any[]>([])


//  filter
 const [searchParams,setSearchParams] = useSearchParams()
 const search = searchParams.get("search") || ""
//  filter working
 const filteredProducts = products.filter((product)=>
 product.title.toLowerCase().includes(search.toLowerCase()) ||
 product.category.toLowerCase().includes(search.toLowerCase())
)

// pagination
 const[currentPage,SetCurrentPage]=useState(1)
 const itemsPerPage=20
 const startIndex=(currentPage-1)*itemsPerPage
 const endIndex=startIndex+itemsPerPage
 const paginatedproducts = filteredProducts.slice(startIndex,endIndex)

// getting products from api
 const fetchProducts=async()=>{
  try{
   const response=await fetch(API_URL)
   const data=await response.json()
   setProducts(data)
  }catch(error){
   console.log("Error fetching products",error)
  }
 }
//  calling function to run api
 useEffect(()=>{
  fetchProducts()
 },[])

 const handleCreateProduct=()=>{
  navigate("/product/create")
 }

 const handleEditProduct=(product:any)=>{
  navigate(`/product/edit/${product.id}?search=${search}`)
 }

//  delete single and send to api
 const handleDelete=async(id:string)=>{
  try{
   await fetch(`${API_URL}/${id}`,{
    method:"DELETE"
   })
   fetchProducts()
  }catch(error){
   console.log("Delete error",error)
  }
 }

//  multiple delete
 const[loading,setLoading] = useState(false)
 const [selectedIds,setSelectedIds] = useState<string[]>([])
//  function to select multiple
const handleSelect = (id:string)=>{
 if(selectedIds.includes(id)){
  setSelectedIds(selectedIds.filter(item => item !== id))
 }else{
  setSelectedIds([...selectedIds,id])
 }
}
// function to delete multiple
const handleDeleteSelected = async () => {
    const confirm = window.confirm("Are you sure you want to delete selected products?")
    if(!confirm){
        setSelectedIds([])
        return}
        // loader
        setLoading(true)
    try{
    await Promise.all(
        selectedIds.map(id =>
            fetch(`${API_URL}/${id}`,
                {method:"DELETE"}) ))
  fetchProducts()
  setSelectedIds([])
}catch(error){
    console.log("Not able to delete",error) }
    setLoading(false)
}


// approval show on i button
 const [selectedProduct,setSelectedProduct]=useState<any|null>(null)
 const handleShowApprovals=(product:any)=>{
  setSelectedProduct(product)
 }

// download audits 
const downloadAudit= async(productId:string)=>{
    try{
        const res = await fetch(`${AUDIT_API}?productId=${productId}`)
        const audits = await res.json()
        let csv = "User,Field,Old Value,New Value,Action,Timestamp\n"
        audits.forEach((a:any)=>{
        csv += `${a.user},${a.field},${a.oldValue},${a.newValue},${a.action},${a.timestamp}\n`
        })
        const blob = new Blob([csv],{type:"text/csv"})
        const link = document.createElement("a")
        
        link.href = URL.createObjectURL(blob)
        link.download = `audit-${productId}.csv`
        link.click()

    } catch(error){
    console.log("Download error",error)
    }
}

// to show status fully approved
//  const isFullyApproved=(product:any)=>{
//   return(
//    product.approvals?.Lakshya?.status==="approved" &&
//    product.approvals?.["Imran Sir"]?.status==="approved" &&
//    product.approvals?.["Kartik Sir"]?.status==="approved"
//   )
//  }

 return(
  <div>
   <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">
     Products Listing Page
    </h1>

    <button
     onClick={handleCreateProduct}
     className="bg-green-500 text-white px-4 py-2 rounded"
    >
     + Add Product
    </button>
   </div>
   
   <div className="flex justify-between items-center mb-6">
    {/* filter wokring */}
   <input
    type="text"
    placeholder="Search by title or category..."
    value={search}
    onChange={(e)=>setSearchParams({search:e.target.value})}
    className="border p-2 mb-4 w-64 rounded"
    />

    {/* multi delete button  */}
    <button
        onClick={handleDeleteSelected}
        disabled={loading || selectedIds.length===0}
        className={ `text-white px-4 py-2 rounded ml-2  ${
                loading || selectedIds.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
        }`}
        >
            {loading ? "Loading..." : "Delete Selected"}
        {/* Delete Selected */}
    </button>
    </div>

   <table className="w-full bg-white">
    <thead>
     <tr className="bg-gray-100">
     <th className="p-3">Select</th>
      <th className="p-3">ID</th>
      <th className="p-3">Title</th>
      <th className="p-3">Category</th>
      <th className="p-3">Image</th>
      {/* <th className="p-3">Status</th> */}
      <th className="p-3">Action</th>
      <th className="p-3">Approvals</th>
      <th className="p-3">Audit Log</th>
     </tr>
    </thead>

    <tbody>
     {paginatedproducts.map((product)=>(
      <tr key={product.id} className="border-t">
        <td className="p-3">
        {/* checkbox  */}
        <input
            type="checkbox"
            checked={selectedIds.includes(product.id)}
            onChange={()=>handleSelect(product.id)}
            />
        </td>

       <td className="p-3">{product.id}</td>
       <td className="p-3">{product.title}</td>
       <td className="p-3">{product.category}</td>
       <td className="p-3">
        <img
         src={product.image}
         alt={product.title}
         className="w-16 h-16 object-cover rounded"
        />
       </td>
       {/* <td className="p-3">
        {isFullyApproved(product)?
         <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
          Fully Approved
         </span>:
         <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm">
          Pending
         </span>
        }
       </td> */}
       <td className="p-3">
        <button
         onClick={()=>handleEditProduct(product)}
         className="bg-blue-500 text-white px-3 py-1 rounded">
         Edit
        </button>

        <button
         onClick={()=>handleDelete(product.id)}
         className="bg-red-500 text-white px-3 py-1 rounded ml-2">
         Delete
        </button>
       </td>

       <td className="p-3">
        <button
         onClick={()=>handleShowApprovals(product)}
         className="bg-yellow-500 text-white px-2 py-1 rounded">
         See details
        </button>
       </td>

       <td className="p-3">
        <button
        onClick={()=>downloadAudit(product.id)}
        className="bg-green-500 text-white px-2 py-1 rounded">
            Download
        </button>
       </td>

      </tr>
     ))}
    </tbody>
   </table>

   {selectedProduct &&(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

     <div className="bg-white p-6 rounded shadow-lg">

      <h2 className="text-lg font-bold mb-4">
       Approval Status
      </h2>

      <table className="w-full border">
       <thead>
        <tr className="bg-gray-100">
         <th className="p-2">Approver</th>
         <th className="p-2">Status</th>
         <th className="p-2">Timestamp</th>
        </tr>
       </thead>

       <tbody>
        <tr>
         <td className="p-2">Lakshya</td>
         <td className="p-2">{selectedProduct.approvals?.Lakshya?.status}</td>
         <td className="p-2">{selectedProduct.approvals?.Lakshya?.timestamp||"-"}</td>
        </tr>

        <tr>
         <td className="p-2">Imran Sir</td>
         <td className="p-2">{selectedProduct.approvals?.["Imran Sir"]?.status}</td>
         <td className="p-2">{selectedProduct.approvals?.["Imran Sir"]?.timestamp||"-"}</td>
        </tr>

        <tr>
         <td className="p-2">Kartik Sir</td>
         <td className="p-2">{selectedProduct.approvals?.["Kartik Sir"]?.status}</td>
         <td className="p-2">{selectedProduct.approvals?.["Kartik Sir"]?.timestamp||"-"}</td>
        </tr>
       </tbody>
      </table>

      <button
       onClick={()=>setSelectedProduct(null)}
       className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
       Close
      </button>

     </div>

    </div>
   )}

   <div className="flex gap-2 mt-4">
    <button
     disabled={currentPage===1}
     onClick={()=>SetCurrentPage(currentPage-1)}
     className="px-3 py-1 bg-gray-300 rounded">
     Prev
    </button>

    <button
     disabled={endIndex>=filteredProducts.length}
     onClick={()=>SetCurrentPage(currentPage+1)}
     className="px-3 py-1 bg-gray-300 rounded"
    >
     Next
    </button>
   </div>

  </div>
 )
}

export default Products
