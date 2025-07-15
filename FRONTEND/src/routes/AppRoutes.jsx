import { Routes, Route } from "react-router-dom";
import LayoutPage from "../layouts/LayoutPage";

import ProductPage from "../pages/ProductPage";
import ProductCreate from "../pages/ProductCreate";
import ProductUpdate from "../pages/ProductUpdate";

import CategoryPage from "../pages/CategoryPage";
import SalePage from "../pages/SalePage";
import ReportPage from "../pages/ReportPage";

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
