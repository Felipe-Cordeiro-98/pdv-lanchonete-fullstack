import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductFormPage from "../components/ProductFormPage";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";

export default function ProductUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get(`/products/${id}`).then((res) => setProduct(res.data));
        api.get("/categories").then((res) => setCategories(res.data));
    }, [id]);

    const handleSave = async (data) => {
        try {
            await api.put(`/products/${id}`, {
                name: data.name,
                price: data.price,
                stockQuantity: data.stockQuantity,
                categoryId: data.categoryId,
            });
            toast.success("Produto atualizado com sucesso!", {
                onClose: () => navigate("/products"),
            });
        } catch (error) {
            console.error("Erro ao atualizar produto", error);
            toast.error("Erro ao atualizar produto.", {
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="container h-full">
            <ProductFormPage
                title="Atualizar Produto"
                product={product}
                categories={categories}
                handleForm={handleSave}
                params={id}
            />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
}
