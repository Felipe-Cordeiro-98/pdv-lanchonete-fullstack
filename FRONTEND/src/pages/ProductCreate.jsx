import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductFormPage from "../components/ProductFormPage";
import api from "../services/api";

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
            alert("Produto cadastrado com sucesso!");
            navigate("/products");
        } catch (error) {
            console.error("Erro ao cadastrar produto", error);
            alert("Erro ao cadastrar produto.");
        }
    };

    return (
        <div className="container h-full">
            <ProductFormPage title="Cadastrar Produto" categories={categories} handleForm={handleSave} />
        </div>
    );
}
