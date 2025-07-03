import { Button } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function ProductFormPage({ title, product, categories, handleForm, params }) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    
    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                price: product.price.toFixed(2),
                stockQuantity: product.stockQuantity,
                categoryId: product.categoryId,
            });
        }
    }, [product, reset]);

    const onSubmit = (data) => {
        handleForm(data);
    };

    return (
        <div className="h-full flex flex-col justify-center mx-28 px-6 py-10">
            <div className={`${params ? "h-16 flex-col" : "h-12"} flex px-4`}>
                <h2 className="text-2xl text-tertiary font-semibold">{title}</h2>
                {params && (
                    <p className="text-[#6A6A6A]">
                        Produto ID: <span className="text-tertiary">{params}</span>
                    </p>
                )}
            </div>
            <div className="flex flex-col justify-between">
                <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="h-full flex">
                    <div className="w-[50%] h-full flex flex-col justify-center gap-5 p-4">
                        {/* Nome */}
                        <fieldset className="flex flex-col">
                            <label className="text-[#6A6A6A] text-sm">
                                Nome<span className="text-red-500">*</span>
                            </label>
                            <input
                                placeholder="Ex: Coxinha de frango"
                                className="h-[35px] bg-secondary text-tertiary rounded px-2 placeholder-tertiary placeholder:text-sm"
                                {...register("name", { required: "O nome é obrigatório" })}
                            />
                            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
                        </fieldset>

                        {/* Preço */}
                        <fieldset className="flex flex-col">
                            <label className="text-[#6A6A6A] text-sm">
                                Preço<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Ex: 4.50"
                                className="h-[35px] bg-secondary text-tertiary rounded px-2 placeholder-tertiary placeholder:text-sm"
                                {...register("price", {
                                    required: "O preço é obrigatório",
                                    min: {
                                        value: 0.01,
                                        message: "O preço deve ser maior que zero",
                                    },
                                })}
                            />
                            {errors.price && <span className="text-red-500 text-sm mt-1">{errors.price.message}</span>}
                        </fieldset>
                    </div>

                    <div className="w-[50%] h-full flex flex-col justify-center gap-5 p-4">
                        {/* Quantidade */}
                        <fieldset className="flex flex-col">
                            <label className="text-[#6A6A6A] text-sm">
                                Quantidade<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Ex: 10 unidades"
                                className="h-[35px] bg-secondary text-tertiary rounded px-2 placeholder-tertiary placeholder:text-sm"
                                {...register("stockQuantity", {
                                    required: "A quantidade é obrigatória",
                                    min: {
                                        value: 1,
                                        message: "A quantidade deve ser pelo menos 1",
                                    },
                                    valueAsNumber: true,
                                })}
                            />
                            {errors.stockQuantity && (
                                <span className="text-red-500 text-sm mt-1">{errors.stockQuantity.message}</span>
                            )}
                        </fieldset>

                        {/* Categoria */}
                        <fieldset className="flex flex-col">
                            <label className="text-[#6A6A6A] text-sm">
                                Categoria<span className="text-red-500">*</span>
                            </label>
                            <select
                                className="h-[35px] bg-secondary text-tertiary rounded px-2 text-sm"
                                {...register("categoryId", {
                                    required: "Selecione uma categoria",
                                })}
                            >
                                <option value="">Selecione uma categoria</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <span className="text-red-500 text-sm mt-1">{errors.categoryId.message}</span>
                            )}
                        </fieldset>
                    </div>
                </form>

                {/* Botões */}
                <div className="flex justify-end gap-5 mt-4">
                    <Button
                        variant="outlined"
                        sx={{
                            width: "120px",
                            height: "35px",
                            color: "#8946A6",
                            borderColor: "#8946A6",
                            borderRadius: "40px",
                            textTransform: "none",
                        }}
                        onClick={() => navigate(-1)}
                    >
                        Descartar
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        form="product-form"
                        sx={{
                            width: "120px",
                            height: "35px",
                            backgroundColor: "#8946A6",
                            color: "#C8C8C8",
                            borderRadius: "40px",
                            textTransform: "none",
                        }}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Salvar
                    </Button>
                </div>
            </div>
        </div>
    );
}
