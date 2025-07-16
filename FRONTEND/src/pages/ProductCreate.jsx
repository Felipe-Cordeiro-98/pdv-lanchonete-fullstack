import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";

export default function ProductCreate() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get("categories");
            setCategories(res.data);
        } catch (error) {
            console.error("Erro ao buscar categorias", error);
        }
    };

    const handleSaveProduct = async (data) => {
        setLoading(true);
        try {
            await api.post("products", {
                name: data.name,
                price: data.price,
                stockQuantity: data.stockQuantity,
                categoryId: data.categoryId,
            });
            toast.success("Produto cadastrado com sucesso!", {
                onClose: () => navigate("/products"),
            });
        } catch (error) {
            console.error("Erro ao cadastrar produto", error);
            toast.error("Erro ao cadastrar produto.", {
                autoClose: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full">
            <ProductForm pageTitle="Cadastrar Produto" categories={categories} handleForm={handleSaveProduct} loading={loading} />
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
