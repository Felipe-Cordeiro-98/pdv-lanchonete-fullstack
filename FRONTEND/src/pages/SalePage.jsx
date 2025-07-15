import {
    Button,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import InputSearch from "../components/InputSearch";
import { useState, useEffect, useRef, useMemo } from "react";
import api from "../services/api";
import { AnimatePresence, motion } from "motion/react";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PixIcon from "@mui/icons-material/Pix";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
import formatCurrency from "../utils/formatCurrency";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SalePage() {
    const [searchInput, setSearchInput] = useState("");
    const [products, setProducts] = useState([]);
    const [saleItems, setSaleItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isLoadingInput, setIsLoadingInput] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [showMobileItems, setShowMobileItems] = useState(false);

    const inputRef = useRef();

    useEffect(() => {
        inputRef.current?.focus();

        if (searchInput.trim() === "") {
            setProducts([]);
            setIsLoadingInput(false);
            return;
        }

        setIsLoadingInput(true);

        const timeout = setTimeout(() => {
            const searchProduct = async () => {
                try {
                    const res = await api.get(`/products/search?name=${searchInput}`);
                    setProducts(res.data.content);
                } catch (error) {
                    console.error("Erro ao buscar produto", error);
                } finally {
                    setIsLoadingInput(false);
                }
            };
            searchProduct();
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        if (saleItems.length === 0 && showMobileItems) {
            setShowMobileItems(false);
        }
    }, [saleItems, showMobileItems]);

    const handleChange = (event) => {
        const value = event.target.value;
        setSearchInput(value.trim() === "" ? "" : value);
    };

    const handleRowClick = (product) => {
        const existsProduct = saleItems.find((p) => p.id === product.id);

        if (existsProduct) {
            if (existsProduct.quantity >= product.stockQuantity) {
                toast.error("Quantidade máxima em estoque atingida.");
                return;
            }
            setSaleItems((prev) => prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)));
        } else {
            setSaleItems((prev) => [...prev, { ...product, quantity: 1 }]);
        }

        setSearchInput("");
        setProducts([]);
    };

    const handleRemoveItem = (productId) => {
        setSaleItems((prev) =>
            prev
                .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
                .filter((item) => item.quantity > 0)
        );
    };

    const handleButtonCancel = () => {
        setSaleItems([]);
        setPaymentMethod("");
    };

    const handleCreateSale = async () => {
        if (saleItems.length === 0) {
            toast.error("Nenhum produto adicionado à venda.");
            return;
        }

        if (!paymentMethod) {
            toast.error("Selecione um método de pagamento.");
            return;
        }

        setIsLoadingButton(true);

        const items = saleItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        }));

        const saleRequest = {
            items,
            payments: [
                {
                    amountToPay: totalValueItems,
                    amountPaid: totalValueItems,
                    paymentMethod: paymentMethod.toUpperCase(),
                },
            ],
        };

        try {
            await api.post("/sales", saleRequest);
            toast.success("Venda realizada.");
            setSaleItems([]);
            setPaymentMethod("");
        } catch (error) {
            console.error("Erro ao efetuar venda", error);
            toast.error("Erro ao efetuar venda.");
        } finally {
            setIsLoadingButton(false);
        }

        handleButtonCancel();
    };

    const shouldShowTable = !isLoadingInput && searchInput.trim() !== "" && products.length > 0;
    const shouldShowEmptyMessage = !isLoadingInput && searchInput.trim() !== "" && products.length === 0;
    const shouldShowLoading = isLoadingInput && searchInput.trim() !== "";

    const totalValueItems = useMemo(() => {
        return saleItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [saleItems]);

    const cellStyle = {
        color: "white",
        backgroundColor: "#2C2C2C",
        borderColor: "#3A3A3A",
    };

    const rowStyle = {
        color: "white",
        borderColor: "#222222",
    };

    const CartBadge = styled(Badge)`
        & .${badgeClasses.badge} {
            top: -12px;
            right: -6px;
        }
    `;

    return (
        <div className="md:flex-row w-full h-full flex flex-col overflow-hidden relative">
            <div className="w-full flex justify-center">
                <div className="max-w-[550px] w-full px-5 mt-[25px]">
                    <InputSearch
                        inputRef={inputRef}
                        onChange={handleChange}
                        value={searchInput}
                        placeholder="Buscar produto"
                    />

                    <AnimatePresence mode="wait">
                        {shouldShowTable && (
                            <motion.div
                                key="table"
                                className="mt-2 relative z-[999]"
                                initial={{ scaleY: 0, opacity: 0 }}
                                animate={{ scaleY: 1, opacity: 1 }}
                                exit={{ scaleY: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                style={{ originY: 0 }}
                            >
                                <TableContainer sx={{ borderRadius: "8px" }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={cellStyle}>Produto</TableCell>
                                                <TableCell sx={cellStyle}>Preço</TableCell>
                                                <TableCell sx={cellStyle}>Estoque</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {products.map((prod) => (
                                                <TableRow
                                                    key={prod.id}
                                                    hover
                                                    onClick={() => handleRowClick(prod)}
                                                    sx={{
                                                        backgroundColor: "#2C2C2C",
                                                        cursor: "pointer",
                                                        "&:hover td": {
                                                            backgroundColor: "#333",
                                                        },
                                                    }}
                                                >
                                                    <TableCell sx={rowStyle}>{prod.name}</TableCell>
                                                    <TableCell sx={rowStyle}>{formatCurrency(prod.price)}</TableCell>
                                                    <TableCell sx={rowStyle}>{prod.stockQuantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </motion.div>
                        )}
                        {shouldShowEmptyMessage && (
                            <motion.div
                                key="no-products"
                                className="mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="h-10 flex justify-center items-center bg-secondary rounded-lg">
                                    <p className="text-tertiary">Nenhum produto encontrado.</p>
                                </div>
                            </motion.div>
                        )}
                        {shouldShowLoading && (
                            <motion.div
                                key="loading"
                                className="mt-2 flex justify-center items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CircularProgress size={28} sx={{ color: "#C8C8C8" }} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {saleItems.length > 0 && (
                    <motion.div
                        key="payment-panel"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:max-w-[330px] md:block hidden w-full h-full border-l border-secondary overflow-hidden"
                    >
                        <div className="h-[56px] flex justify-center items-center gap-2 border-b border-secondary">
                            <AccountBalanceWalletRoundedIcon sx={{ color: "white" }} />
                            <h3 className="text-white font-semibold">Pagamento</h3>
                        </div>
                        <div className="h-[calc(100%-56px)]">
                            <div className="h-[calc(100%-88px)]">
                                <div className="h-[calc(100%-48px)] flex flex-col justify-between p-2">
                                    {/* container table items */}
                                    <div className="h-[calc(100%-31px)]">
                                        <TableContainer
                                            sx={{ borderRadius: "8px", maxHeight: "100%", overflowY: "auto" }}
                                        >
                                            <Table
                                                stickyHeader
                                                size="small"
                                                sx={{
                                                    tableLayout: "fixed",
                                                    width: "100%",
                                                }}
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell
                                                            sx={{
                                                                color: "white",
                                                                backgroundColor: "#2C2C2C",
                                                                borderColor: "#3A3A3A",
                                                                padding: "8px 4px",
                                                            }}
                                                        >
                                                            Produto
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                width: "40px",
                                                                color: "white",
                                                                backgroundColor: "#2C2C2C",
                                                                borderColor: "#3A3A3A",
                                                                padding: "8px 4px",
                                                            }}
                                                        >
                                                            Qtd
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                color: "white",
                                                                backgroundColor: "#2C2C2C",
                                                                borderColor: "#3A3A3A",
                                                                padding: "8px 4px",
                                                            }}
                                                        >
                                                            Subtotal
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                width: "40px",
                                                                color: "white",
                                                                backgroundColor: "#2C2C2C",
                                                                borderColor: "#3A3A3A",
                                                                padding: "8px 4px",
                                                            }}
                                                        ></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {saleItems.map((item) => (
                                                        <TableRow key={item.id} sx={{ backgroundColor: "#2C2C2C" }}>
                                                            <Tooltip title={item.name}>
                                                                <TableCell
                                                                    sx={{
                                                                        width: "100px",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                        color: "white",
                                                                        borderColor: "#222222",
                                                                        padding: "12px 4px",
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </TableCell>
                                                            </Tooltip>
                                                            <TableCell
                                                                sx={{
                                                                    color: "white",
                                                                    borderColor: "#222222",
                                                                    padding: "12px 4px",
                                                                }}
                                                            >
                                                                {item.quantity}
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{
                                                                    color: "white",
                                                                    borderColor: "#222222",
                                                                    padding: "12px 4px",
                                                                }}
                                                            >
                                                                {formatCurrency(item.price * item.quantity)}
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{
                                                                    color: "white",
                                                                    borderColor: "#222222",
                                                                    padding: 0,
                                                                }}
                                                            >
                                                                <IconButton onClick={() => handleRemoveItem(item.id)}>
                                                                    <RemoveCircleRoundedIcon
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
                                    </div>

                                    {/* value total items */}
                                    <div className="flex justify-end items-center mt-2 pr-2 text-white">
                                        <p className="font-semibold">Total: {formatCurrency(totalValueItems)}</p>
                                    </div>
                                </div>

                                {/* paymentMethod */}
                                <div className="h-12 flex justify-evenly items-center border-t border-secondary">
                                    <Tooltip title="Dinheiro">
                                        <IconButton
                                            onClick={() => setPaymentMethod((prev) => (prev === "cash" ? "" : "cash"))}
                                        >
                                            <AttachMoneyIcon
                                                className={`${
                                                    paymentMethod === "cash" ? "text-quaternary" : "text-white"
                                                }`}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cartão de crédito/débito">
                                        <IconButton
                                            onClick={() => setPaymentMethod((prev) => (prev === "card" ? "" : "card"))}
                                        >
                                            <CreditCardIcon
                                                className={`${
                                                    paymentMethod === "card" ? "text-quaternary" : "text-white"
                                                }`}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Pix">
                                        <IconButton
                                            onClick={() => setPaymentMethod((prev) => (prev === "pix" ? "" : "pix"))}
                                        >
                                            <PixIcon
                                                className={`${
                                                    paymentMethod === "pix" ? "text-quaternary" : "text-white"
                                                }`}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>

                            {/* buttons confirm cancel */}
                            <div className="h-[88px] flex flex-col justify-evenly border-t border-secondary">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    onClick={handleCreateSale}
                                    disabled={!paymentMethod}
                                    loading={isLoadingButton}
                                    loadingPosition="start"
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
                                <Button variant="contained" color="error" onClick={handleButtonCancel}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* mobile sale panel */}
            <AnimatePresence mode="wait">
                {saleItems.length > 0 && (
                    <motion.div
                        key="mobile-sale-panel"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden max-w-[550px] h-[50%] w-full flex flex-col justify-end absolute bottom-0 left-0 right-0 mx-auto mb-[25px] px-5"
                    >
                        <AnimatePresence initial={false}>
                            {showMobileItems && (
                                <motion.div
                                    key="mobile-items"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <TableContainer
                                        sx={{
                                            borderTopLeftRadius: "8px",
                                            borderTopRightRadius: "8px",
                                            maxHeight: "100%",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            size="small"
                                            sx={{
                                                tableLayout: "fixed",
                                                width: "100%",
                                            }}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            color: "white",
                                                            backgroundColor: "#2C2C2C",
                                                            borderColor: "#3A3A3A",
                                                        }}
                                                    >
                                                        Produto
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            width: "40px",
                                                            color: "white",
                                                            backgroundColor: "#2C2C2C",
                                                            borderColor: "#3A3A3A",
                                                        }}
                                                    >
                                                        Qtd
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            width: "120px",
                                                            color: "white",
                                                            backgroundColor: "#2C2C2C",
                                                            borderColor: "#3A3A3A",
                                                        }}
                                                    >
                                                        Subtotal
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            width: "40px",
                                                            color: "white",
                                                            backgroundColor: "#2C2C2C",
                                                            borderColor: "#3A3A3A",
                                                        }}
                                                    ></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {saleItems.map((item) => (
                                                    <TableRow key={item.id} sx={{ backgroundColor: "#2C2C2C" }}>
                                                        <Tooltip title={item.name}>
                                                            <TableCell
                                                                sx={{
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap",
                                                                    color: "white",
                                                                    borderColor: "#222222",
                                                                }}
                                                            >
                                                                {item.name}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell
                                                            sx={{
                                                                width: "40px",
                                                                color: "white",
                                                                borderColor: "#222222",
                                                            }}
                                                        >
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                width: "120px",
                                                                color: "white",
                                                                borderColor: "#222222",
                                                            }}
                                                        >
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                width: "40px",
                                                                color: "white",
                                                                borderColor: "#222222",
                                                                padding: 0,
                                                            }}
                                                        >
                                                            <IconButton onClick={() => handleRemoveItem(item.id)}>
                                                                <RemoveCircleRoundedIcon
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

                                    {/* paymentMethod */}
                                    <div className="h-10 flex justify-evenly items-center bg-secondary border-t border-tertiary">
                                        <Tooltip title="Dinheiro">
                                            <IconButton
                                                onClick={() =>
                                                    setPaymentMethod((prev) => (prev === "cash" ? "" : "cash"))
                                                }
                                            >
                                                <AttachMoneyIcon
                                                    className={`${
                                                        paymentMethod === "cash" ? "text-quaternary" : "text-white"
                                                    }`}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Cartão de crédito/débito">
                                            <IconButton
                                                onClick={() =>
                                                    setPaymentMethod((prev) => (prev === "card" ? "" : "card"))
                                                }
                                            >
                                                <CreditCardIcon
                                                    className={`${
                                                        paymentMethod === "card" ? "text-quaternary" : "text-white"
                                                    }`}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Pix">
                                            <IconButton
                                                onClick={() =>
                                                    setPaymentMethod((prev) => (prev === "pix" ? "" : "pix"))
                                                }
                                            >
                                                <PixIcon
                                                    className={`${
                                                        paymentMethod === "pix" ? "text-quaternary" : "text-white"
                                                    }`}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div
                            className={`${
                                showMobileItems ? "rounded-b-lg" : "rounded-lg"
                            } w-full h-12 flex justify-between bg-secondary rounded-b-lg`}
                        >
                            <div className="flex items-center">
                                <div className="h-full flex mx-4 pt-1">
                                    <IconButton>
                                        <ShoppingCartIcon sx={{ color: "#C8C8C8" }} />
                                        <CartBadge badgeContent={saleItems.length} color="primary" overlap="circular" />
                                    </IconButton>
                                </div>
                                <p className="text-tertiary text-md">
                                    Total: <span className="font-semibold">{formatCurrency(totalValueItems)}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="contained"
                                    onClick={handleCreateSale}
                                    loading={isLoadingButton}
                                    loadingPosition="start"
                                    disabled={!paymentMethod}
                                    sx={{
                                        backgroundColor: "#8946A6",
                                        borderRadius: "16px",
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
                                {showMobileItems ? (
                                    <IconButton onClick={() => setShowMobileItems(false)}>
                                        <KeyboardArrowDownRoundedIcon sx={{ color: "#C8C8C8" }} />
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={() => setShowMobileItems(true)}>
                                        <KeyboardArrowUpRoundedIcon sx={{ color: "#C8C8C8" }} />
                                    </IconButton>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
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
