import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductFormPage from "../components/ProductFormPage";
import api from "../services/api";

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
            alert("Produto atualizado com sucesso!");
            navigate("/products");
        } catch (error) {
            console.error("Erro ao atualizar produto", error);
            alert("Erro ao atualizar produto.");
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
        </div>
    );
}
