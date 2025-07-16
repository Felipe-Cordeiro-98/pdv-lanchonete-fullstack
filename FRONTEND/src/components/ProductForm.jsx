import { Button, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";

const LabelRequired = ({ text, htmlFor }) => (
    <label htmlFor={htmlFor} className="text-[#6A6A6A]">
        {text}
        <span className="text-red-500">*</span>
    </label>
);

export default function ProductForm({ pageTitle, product, categories, handleForm, params, loading }) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            price: "",
            stockQuantity: "",
            categoryId: "",
        },
    });

    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        if (product) {
            reset({
                name: product.name || "",
                price: product.price || "",
                stockQuantity: product.stockQuantity || "",
                categoryId: product.category?.id || "",
            });
        }
    }, [product, reset]);

    const onSubmit = (data) => {
        handleForm(data);
    };

    return (
        <div className="h-full px-5">
            {/* title page */}
            <div className="h-[100px] flex flex-col justify-center">
                <h1 className="text-white font-semibold text-2xl">{pageTitle}</h1>
                {params && (
                    <p className="text-[#6A6A6A]">
                        Produto ID: <span className="text-tertiary">{params}</span>
                    </p>
                )}
            </div>

            <div className="md:justify-center w-full h-[calc(100%-100px)] flex flex-col justify-evenly items-center overflow-y-auto">
                {/* form */}
                <form
                    id="product-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="max-w-[550px] w-full flex flex-col gap-3"
                >
                    {/* input name */}
                    <fieldset className="flex flex-col">
                        <LabelRequired text="Nome" htmlFor="name" />
                        <input
                            id="name"
                            placeholder="Nome do produto"
                            className="max-w-[550px] w-full h-9 px-2 bg-secondary text-tertiary rounded-lg placeholder:text-sm"
                            {...register("name", { required: "O nome é obrigatório" })}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </fieldset>

                    {/* input price */}
                    <fieldset className="flex flex-col">
                        <LabelRequired text="Preço" htmlFor="price" />
                        <Controller
                            name="price"
                            control={control}
                            rules={{ required: "O preço é obrigatório" }}
                            render={({ field }) => (
                                <NumericFormat
                                    id="price"
                                    placeholder="Preço por unidade"
                                    className="max-w-[550px] w-full h-9 px-2 bg-secondary text-tertiary rounded-lg placeholder:text-sm"
                                    value={field.value}
                                    onValueChange={(values) => {
                                        field.onChange(values.floatValue);
                                    }}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix="R$ "
                                    decimalScale={2}
                                    fixedDecimalScale
                                    allowNegative={false}
                                />
                            )}
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </fieldset>

                    {/* input stockQuantity */}
                    <fieldset className="flex flex-col">
                        <LabelRequired text="Quantidade" htmlFor="stockQuantity" />
                        <input
                            id="stockQuantity"
                            type="number"
                            placeholder="Unidades disponíveis"
                            className="max-w-[550px] w-full h-9 px-2 bg-secondary text-tertiary rounded-lg placeholder:text-sm"
                            {...register("stockQuantity", {
                                required: "A quantidade é obrigatório",
                                min: {
                                    value: 1,
                                    message: "A quantidade deve ser pelo menos 1",
                                },
                                valueAsNumber: true,
                            })}
                        />
                        {errors.stockQuantity && (
                            <p className="text-red-500 text-sm mt-1">{errors.stockQuantity.message}</p>
                        )}
                    </fieldset>

                    {/* select  category */}
                    <fieldset className="flex flex-col">
                        <LabelRequired text="Categoria" htmlFor="category" />
                        <select
                            id="category"
                            className="max-w-[550px] w-full h-9 px-2 bg-secondary text-tertiary rounded-lg placeholder:text-sm"
                            {...register("categoryId", { required: "Selecione uma categoria", valueAsNumber: true })}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                    </fieldset>
                </form>

                {/* buttons save discart */}
                <div className="md:flex-row md:mx-auto md:justify-end max-w-[550px] w-full flex flex-col items-center gap-5 mt-4">
                    <Button
                        variant="contained"
                        type="submit"
                        form="product-form"
                        fullWidth
                        loading={loading}
                        loadingPosition="start"
                        sx={{
                            maxWidth: "550px",
                            width: isMobile ? "100%" : "120px",
                            height: "40px",
                            backgroundColor: "#8946A6",
                            color: "#C8C8C8",
                            borderRadius: "40px",
                            textTransform: "none",
                            "&.Mui-disabled": {
                                backgroundColor: "#8946A6",
                                color: "#fff",
                                cursor: "not-allowed",
                                opacity: 0.5,
                            },
                        }}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Salvar
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        disabled={loading}
                        sx={{
                            maxWidth: "550px",
                            width: isMobile ? "100%" : "120px",
                            height: "40px",
                            color: "#8946A6",
                            borderColor: "#8946A6",
                            borderRadius: "40px",
                            textTransform: "none",
                            "&.Mui-disabled": {
                                cursor: "not-allowed",
                                color: "#8946A6",
                                borderColor: "#8946A6",
                                opacity: 0.8,
                            },
                        }}
                        onClick={() => navigate(-1)}
                    >
                        Descartar
                    </Button>
                </div>
            </div>
        </div>
    );
}
