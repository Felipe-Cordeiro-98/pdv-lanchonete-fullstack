import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductFormPage from "../components/ProductFormPage";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";

export default function ProductCreate() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get("/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Erro ao carregar categorias", err));
    }, []);

    const handleSave = async (data) => {
        try {
            await api.post("/products", {
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
        }
    };

    return (
        <div className="container h-full">
            <ProductFormPage title="Cadastrar Produto" categories={categories} handleForm={handleSave} />
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
