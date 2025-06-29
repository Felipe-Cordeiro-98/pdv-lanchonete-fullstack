import PageHeader from "../components/PageHeader";
import { useEffect, useState } from "react";
import ModalDelete from "../components/ModalDelete";
import { useNavigate } from "react-router-dom";
import {
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
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import api from "../services/api";

export default function ProductPage() {
    const [isLoading, setIsloading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        await api
            .get("/products")
            .then((res) => setProducts(res.data.content))
            .catch((error) => console.error("Erro ao buscar produtos", error));
    };

    const handleCreateClick = () => {
        navigate("/products/create");
    };

    const handleEditClick = (item) => {
        navigate(`/products/update/${item.id}`);
    };

    const handleDeleteClick = () => {
        api.delete(`/products/${selectedItem.id}`)
        alert("Produto '" + selectedItem.name + "' deletado");
        setOpen(false);
        fetchProducts();
    };

    const showModal = (item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const handleSearchInput = (event) => {
        setSearchInput(event.target.value);
    };

    // pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className="h-screen py-10 px-6">
            <PageHeader
                title="Produtos"
                buttonText="Produto"
                handleChange={handleSearchInput}
                handleClick={handleCreateClick}
                placeholderInput="Buscar produto"
                searchValue={searchInput}
                isLoading={isLoading}
            />
            <div className="h-[calc(100%-88px)] my-10">
                <Paper sx={{ width: "100%", height: "100%" }}>
                    <TableContainer sx={{ maxHeight: 440, height: "calc(100% - 52px)", backgroundColor: "#5A6169" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", color: "white", backgroundColor: "#2C2C2C" }}>
                                        Id
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            color: "white",
                                            minWidth: "200px",
                                            backgroundColor: "#2C2C2C",
                                        }}
                                    >
                                        Produto
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "white", backgroundColor: "#2C2C2C" }}>
                                        Preço
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "white", backgroundColor: "#2C2C2C" }}>
                                        Quantidade
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "white", backgroundColor: "#2C2C2C" }}>
                                        Categoria
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            color: "white",
                                            backgroundColor: "#2C2C2C",
                                        }}
                                    >
                                        Ações
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                                    <TableRow key={item.id} sx={{ backgroundColor: "#EDEEF0" }}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>{item.stockQuantity}</TableCell>
                                        <TableCell>{item.categoryId}</TableCell>
                                        <TableCell sx={{ textAlign: "center" }}>
                                            <Tooltip title="Clique para editar">
                                                <IconButton aria-label="edit" onClick={() => handleEditClick(item)}>
                                                    <EditRoundedIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Clique para excluir">
                                                <IconButton aria-label="delete" onClick={() => showModal(item)}>
                                                    <DeleteRoundedIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={products.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Linhas por página"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`
                        }
                        sx={{
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
            <ModalDelete
                open={open}
                onClose={() => setOpen(false)}
                onDelete={handleDeleteClick}
                itemName={selectedItem?.name ?? "Produto"}
            />
        </div>
    );
}
