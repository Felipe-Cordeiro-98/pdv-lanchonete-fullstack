import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function LayoutPage() {
    return (
        <div className="w-screen h-dvh flex bg-primary">
            <Sidebar />
            <div className="w-full h-full">
                <Outlet />
            </div>
        </div>
    );
}
