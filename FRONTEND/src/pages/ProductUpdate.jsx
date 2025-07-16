import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";

export default function ProductUpdate() {
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProductId(id);
        fetchCategories();
    }, [id]);

    const fetchProductId = async (id) => {
        try {
            const res = await api.get(`products/${id}`);
            setProduct(res.data);
        } catch (error) {
            console.error("Erro ao buscar produto por id", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("categories");
            setCategories(res.data);
        } catch (error) {
            console.error("Erro ao buscar categorias", error);
        }
    };

    const handleUpdateProduct = async (data) => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full">
            <ProductForm
                pageTitle="Atualizar Produto"
                product={product}
                categories={categories}
                handleForm={handleUpdateProduct}
                params={id}
                loading={loading}
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
