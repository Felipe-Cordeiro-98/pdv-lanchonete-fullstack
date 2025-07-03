import {
    Button,
    IconButton,
    InputBase,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PixIcon from "@mui/icons-material/Pix";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

import { useState, useEffect } from "react";

import api from "../services/api";

export default function SalePage() {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [saleItems, setSaleItems] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (searchValue.trim() === "") {
            setProducts([]);
            return;
        }

        const timeout = setTimeout(() => {
            const searchProduct = async () => {
                try {
                    const res = await api.get(`/products/search?name=${searchValue}`);
                    setProducts(res.data.content);
                } catch (error) {
                    console.error("Erro ao buscar produto", error);
                }
            };
            searchProduct();
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchValue]);

    /**
     * @param {React.ChangeEvent<HTMLInputElement>} event
     */
    const handleChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleAddToSale = (prod) => {
        setSaleItems((prev) => {
            const existingItem = prev.find((item) => item.id === prod.id);

            if (existingItem) {
                if (existingItem.quantity >= prod.stockQuantity) {
                    alert("Quantidade máxima em estoque atingida.");
                    return prev;
                }

                return prev.map((item) => (item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item));
            }
            return [...prev, { ...prod, quantity: 1 }];
        });

        setSearchValue("");
        setProducts([]);
    };

    const handleRemoveItem = (itemId) => {
        setSaleItems((prevItems) =>
            prevItems
                .map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item))
                .filter((item) => item.quantity > 0)
        );
    };

    const handleCreateSale = async () => {
        const items = saleItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        }));

        const amountToPay = saleItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const saleRequest = {
            items,
            payments: [
                {
                    amountToPay,
                    amountPaid: amountToPay,
                    paymentMethod: paymentMethod.toUpperCase(),
                },
            ],
        };

        try {
            await api.post("/sales", saleRequest);
            alert("Venda realizada.");
            setSaleItems([]);
            setPaymentMethod("");
        } catch (error) {
            console.error("Erro ao efetuar venda", error);
            alert("Erro ao efetuar venda.");
        }
    };

    return (
        <div className="h-screen flex">
            <div className="w-full h-full pt-10 px-6">
                <div className="h-12 flex items-center justify-center">
                    <Paper
                        component="form"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            height: 35,
                            backgroundColor: "#2C2C2C",
                            px: 1,
                            py: 0.5,
                            borderRadius: "25px",
                        }}
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <IconButton type="submit" sx={{ p: "8px" }} aria-label="search">
                            <SearchIcon sx={{ color: "#C8C8C8" }} />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, color: "#C8C8C8" }}
                            placeholder="Digite para buscar"
                            value={searchValue}
                            onChange={handleChange}
                        />
                    </Paper>
                </div>
                <div className="h-[calc(100%-88px)] px-[22px]">
                    {products.length > 0 && (
                        <div className="h-full flex flex-col text-white">
                            <div className="sticky top-0 z-10">
                                <table className="w-full table-fixed">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2">Produto</th>
                                            <th className="text-left px-4 py-2">Preço</th>
                                            <th className="text-left px-4 py-2">Estoque</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div className="overflow-y-auto flex-1">
                                <table className="w-full table-fixed border-separate border-spacing-y-2">
                                    <tbody className="text-black">
                                        {products.map((prod) => (
                                            <tr
                                                key={prod.id}
                                                onClick={() => handleAddToSale(prod)}
                                                className="bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-300"
                                            >
                                                <td className="px-4 py-2 rounded-l-lg">{prod.name}</td>
                                                <td className="px-4 py-2">
                                                    {prod.price.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                </td>
                                                <td className="px-4 py-2 rounded-r-lg">{prod.stockQuantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="h-full border-l border-secondary text-white">
                <div className="h-[56px] border-b border-secondary p-4 text-center font-semibold">
                    <h3>
                        <AccountBalanceWalletRoundedIcon /> Pagamento
                    </h3>
                </div>
                <div className="h-[calc(100%-56px)]">
                    <div className="h-[calc(100%-88px)]">
                        <div className="h-[calc(100%-48px)] flex flex-col justify-between p-2">
                            <div className="w-[330px] h-[calc(100%-44px)]">
                                {saleItems.length >= 1 ? (
                                    <TableContainer component={Paper} sx={{ maxHeight: "100%", overflowY: "auto" }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="max-w-[100px]">Produto</TableCell>
                                                    <TableCell sx={{ width: 40, padding: 1 }}>Qtd</TableCell>
                                                    <TableCell sx={{ width: 80, padding: 1 }}>Subtotal</TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {saleItems.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <Tooltip title={item.name}>
                                                            <TableCell className="max-w-[100px] truncate">
                                                                {item.name}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell sx={{ width: 40, padding: 1 }}>
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell
                                                            className="text-nowrap"
                                                            sx={{ width: 80, padding: 1 }}
                                                        >
                                                            {(item.price * item.quantity).toLocaleString("pt-BR", {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            })}
                                                        </TableCell>
                                                        <TableCell sx={{ padding: 0 }}>
                                                            <IconButton onClick={() => handleRemoveItem(item.id)}>
                                                                <RemoveCircleOutlineRoundedIcon
                                                                    fontSize="small"
                                                                    color="error"
                                                                />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <div className="h-full flex justify-center items-center">
                                        <p className="text-sm text-tertiary">Nenhum item adicionado.</p>
                                    </div>
                                )}
                            </div>
                            <div className="py-2 border-t border-secondary mt-2 text-right pr-2 text-white">
                                <p className="font-semibold">
                                    Total:{" "}
                                    {saleItems
                                        .reduce((acc, item) => acc + item.quantity * item.price, 0)
                                        .toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                </p>
                            </div>
                        </div>

                        <div className="h-12 flex justify-evenly items-center border-t border-secondary">
                            <Tooltip title="Dinheiro">
                                <IconButton onClick={() => setPaymentMethod((prev) => (prev === "cash" ? "" : "cash"))}>
                                    <AttachMoneyIcon
                                        className={`${paymentMethod === "cash" && "text-quaternary"} text-white`}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cartão de crédito/débito">
                                <IconButton onClick={() => setPaymentMethod((prev) => (prev === "card" ? "" : "card"))}>
                                    <CreditCardIcon
                                        className={`${paymentMethod === "card" && "text-quaternary"} text-white`}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Pix">
                                <IconButton onClick={() => setPaymentMethod((prev) => (prev === "pix" ? "" : "pix"))}>
                                    <PixIcon className={`${paymentMethod === "pix" && "text-quaternary"} text-white`} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="border-t border-secondary h-[88px] flex flex-col justify-evenly">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleCreateSale()}
                            disabled={!paymentMethod}
                            sx={{
                                "&.Mui-disabled": {
                                    backgroundColor: "#9e9e9e",
                                    color: "#fff",
                                    cursor: "not-allowed",
                                    opacity: 0.8,
                                },
                            }}
                        >
                            Finalizar
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                setSaleItems([]);
                                setPaymentMethod("");
                            }}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
