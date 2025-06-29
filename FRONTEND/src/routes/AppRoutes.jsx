import { Routes, Route } from "react-router-dom";
import LayoutPage from "../components/LayoutPage";
import SalePage from "../pages/SalePage";
import ProductPage from "../pages/ProductPage";
import CategoryPage from "../pages/CategoryPage";
import ReportPage from "../pages/ReportPage";
import ProductCreate from "../pages/ProductCreate";
import ProductUpdate from "../pages/ProductUpdate";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<LayoutPage />}>
                <Route path="/" element={<SalePage />} />

                <Route path="/products" element={<ProductPage />} />
                <Route path="/products/create" element={<ProductCreate />} />
                <Route path="/products/update/:id" element={<ProductUpdate />} />

                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/reports" element={<ReportPage />} />
            </Route>
        </Routes>
    );
}
