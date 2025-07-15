import {
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import PageHeader from "../components/PageHeader";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import formatCurrencyBRL from "../utils/formatCurrency";
import ProductCard from "../components/ProductCard";
import InfiniteScroll from "react-infinite-scroll-component";
import ModalDelete from "../components/ModalDelete";
import { toast, ToastContainer } from "react-toastify";

export default function ProductPage() {
    const [searchInput, setSearchInput] = useState("");
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    //mobile
    const [mobileProducts, setMobileProducts] = useState([]);
    const [mobilePage, setMobilePage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    //desktop
    const [desktopProducts, setDesktopProducts] = useState([]);
    const [desktopPage, setDesktopPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalElementsPage, setTotalElementsPage] = useState(0);

    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        if (isMobile) {
            fetchInitialMobileProducts();
            return;
        }
        fetchDesktopProducts();
    }, [isMobile, desktopPage, rowsPerPage]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchInput.trim() === "") {
                if (isMobile) {
                    fetchInitialMobileProducts();
                } else {
                    fetchDesktopProducts();
                }
                return;
            }

            const searchProduct = async () => {
                try {
                    const res = await api.get(`/products/search?name=${searchInput}`);
                    if (isMobile) {
                        setMobileProducts(res.data.content);
                        setHasMore(false);
                    } else {
                        setDesktopProducts(res.data.content);
                        setTotalElementsPage(res.data.content.length);
                    }
                } catch (error) {
                    console.error("Erro ao buscar produto", error);
                }
            };
            searchProduct();
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchInput, isMobile]);

    const fetchInitialMobileProducts = async () => {
        try {
            const res = await api.get("/products?page=0&size=10");
            setMobileProducts(res.data.content);
            setHasMore(!res.data.last);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInfiniteScroll = async () => {
        try {
            const res = await api.get(`/products?page=${mobilePage}&size=10`);
            setMobileProducts((prev) => [...prev, ...res.data.content]);
            setMobilePage((prev) => prev + 1);
            setHasMore(!res.data.last);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDesktopProducts = useCallback(async () => {
        try {
            const res = await api.get(`/products?page=${desktopPage}&size=${rowsPerPage}`);
            setDesktopProducts(res.data.content);
            setTotalElementsPage(res.data.totalElements);
        } catch (error) {
            console.error(error);
        }
    }, [desktopPage, rowsPerPage]);

    const handleChange = (event) => {
        const value = event.target.value;
        setSearchInput(value.trim() === "" ? "" : value);
    };

    const handleCreateProduct = () => {
        navigate("/products/create");
    };

    const handleEditProduct = (productId) => {
        navigate(`/products/update/${productId}`);
    };

    const handleDeleteProduct = async () => {
        try {
            await api.delete(`/products/${selectedItem.id}`);
            toast.success("Produto excluido com sucesso.");
        } catch (error) {
            console.error("Erro ao excluir produto", error);
            toast.error("Erro ao excluir produto");
        } finally {
            setOpenModalDelete(false);
            if (isMobile) {
                setMobilePage(1);
                setMobileProducts([]);
                setHasMore(true);
                fetchInitialMobileProducts();
            } else {
                fetchDesktopProducts();
            }
        }
    };

    const showModalDelete = (item) => {
        setSelectedItem(item);
        setOpenModalDelete(true);
    };

    // pagination
    const handleChangePage = (event, newPage) => {
        setDesktopPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setDesktopPage(0);
    };

    const cellStyle = {
        color: "white",
        borderColor: "#3A3A3A",
        backgroundColor: "#333",
    };

    const rowStyle = {
        color: "white",
        borderColor: "#222222",
        backgroundColor: "#2C2C2C",
    };

    return (
        <div className="h-full">
            <PageHeader
                pageTitle="Produto"
                inputPlaceholder="Buscar produto"
                inputChange={handleChange}
                inputValue={searchInput}
                handleButtonClick={handleCreateProduct}
            />
            <div className="md:h-[calc(100%-100px)] h-[calc(100%-130px)] px-5">
                <div className="md:block hidden h-full">
                    <Paper sx={{ height: "calc(100% - 100px)", borderRadius: "8px", backgroundColor: "#2C2C2C" }}>
                        <TableContainer
                            sx={{ height: "100%", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={[cellStyle, { display: { xs: "none", md: "table-cell" } }]}>
                                            Id
                                        </TableCell>
                                        <TableCell sx={cellStyle}>Produto</TableCell>
                                        <TableCell sx={cellStyle}>Valor</TableCell>
                                        <TableCell sx={cellStyle}>Qtd.</TableCell>
                                        <TableCell
                                            sx={[
                                                cellStyle,
                                                { display: { xs: "none", md: "table-cell" }, textAlign: "center" },
                                            ]}
                                        >
                                            Ações
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {desktopProducts.map((prod) => (
                                        <TableRow key={prod.id}>
                                            <TableCell sx={[rowStyle, { display: { xs: "none", md: "table-cell" } }]}>
                                                {prod.id}
                                            </TableCell>
                                            <TableCell sx={rowStyle}>{prod.name}</TableCell>
                                            <TableCell sx={rowStyle}>{formatCurrencyBRL(prod.price)}</TableCell>
                                            <TableCell sx={rowStyle}>{prod.stockQuantity}</TableCell>
                                            <TableCell
                                                sx={[
                                                    rowStyle,
                                                    { display: { xs: "none", md: "table-cell" }, textAlign: "center" },
                                                ]}
                                            >
                                                <Tooltip title="Clique para editar">
                                                    <IconButton
                                                        aria-label="edit"
                                                        onClick={() => handleEditProduct(prod.id)}
                                                    >
                                                        <EditRoundedIcon sx={{ color: "#C8C8C8" }} />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Clique para excluir">
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => showModalDelete(prod)}
                                                    >
                                                        <DeleteRoundedIcon sx={{ color: "#FB2C36" }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 15, 35, { label: "All", value: totalElementsPage }]}
                            component="div"
                            count={totalElementsPage}
                            rowsPerPage={rowsPerPage}
                            page={desktopPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Linhas por página"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
                            }
                            sx={{
                                borderBottomLeftRadius: "8px",
                                borderBottomRightRadius: "8px",
                                backgroundColor: "#2C2C2C",
                                color: "white",
                                ".MuiSelect-icon": {
                                    color: "white",
                                },
                                ".Mui-disabled": {
                                    color: "#7C7C7C",
                                },
                            }}
                        />
                    </Paper>
                </div>
                <div className="md:hidden lg:h-[calc(100%-130px)] h-full overflow-y-auto" id="scrollableDiv">
                    <InfiniteScroll
                        dataLength={mobileProducts.length}
                        next={handleInfiniteScroll}
                        hasMore={hasMore}
                        scrollableTarget="scrollableDiv"
                        loader={
                            <div className="my-4 flex justify-center">
                                <CircularProgress size={28} sx={{ color: "#C8C8C8" }} />
                            </div>
                        }
                        endMessage={<p className="text-gray-500 text-center pt-2 pb-4">Fim da lista</p>}
                    >
                        {mobileProducts.map((prod) => (
                            <ProductCard
                                key={prod.id}
                                productId={prod.id}
                                productName={prod.name}
                                productPrice={prod.price}
                                productStockQuantity={prod.stockQuantity}
                                categoryName={prod.category?.name || "-"}
                                onEdit={() => handleEditProduct(prod.id)}
                                onDelete={() => showModalDelete(prod)}
                            />
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
            <ModalDelete
                open={openModalDelete}
                onClose={() => setOpenModalDelete(false)}
                onDelete={handleDeleteProduct}
                itemName={selectedItem?.name ?? "Produto"}
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
