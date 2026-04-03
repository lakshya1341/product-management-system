import Sidebar from "./Sidebar"
import Header from "./Header"

interface LayoutProps {
    children: React.ReactNode;
}
const Layout = ({children}: LayoutProps) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header/>
                <main className="p-6 bg-blue-200 flex-1">
                    {children}
                </main>
            </div>
        </div>

    )
}
export default Layout;
