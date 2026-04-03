import { Link } from "react-router-dom"

const Sidebar = () => {
    return (
    <div className="w-64 bg-blue-100 text-black p-5">
        <h2 className="text-xl font-bold mb-6">
            Dashboard
        </h2>
        <ul className="space-y-4">
            {/* <li>
                <Link to="/users"
                className="hover:text-blue-400">
                    Users
                </Link>
            </li> */}
            <li>
                <Link to="/products"
                className="hover:text-blue-400">
                    Products
                </Link>
            </li>
        </ul>
    </div>
    )
}
export default Sidebar;