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

import PageHeader from "../components/PageHeader";
import ModalDelete from "../components/ModalDelete";
import ModalCategory from "../components/ModalCategory";

import { useEffect, useState } from "react";
import api from "../services/api";

export default function CategoryPage() {
    const [isLoading, setIsloading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalCategory, setOpenModalCategory] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        await api
            .get("/categories")
            .then((res) => setCategories(res.data))
            .catch((error) => console.error("Erro ao buscar categorias", error));
    };

    const handleSaveCategory = async () => {
        if (!categoryName.trim()) return;

        try {
            if (isEdit) {
                await api.put(`/categories/${editCategoryId}`, {
                    name: categoryName.trim(),
                });
            } else {
                await api.post("/categories", {
                    name: categoryName.trim(),
                });
            }

            setCategoryName("");
            setEditCategoryId(null);
            setIsEdit(false);
            setOpenModalCategory(false);

            fetchCategories();
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
        }
    };

    const handleCreateClick = () => {
        setCategoryName("");
        setEditCategoryId(null);
        setIsEdit(false);
        setOpenModalCategory(true);
    };

    const handleEditClick = (item) => {
        setCategoryName(item.name);
        setEditCategoryId(item.id);
        setIsEdit(true);
        setOpenModalCategory(true);
    };

    const handleDeleteClick = () => {
        api.delete(`/categories/${selectedItem.id}`);
        alert("Categoria '" + selectedItem.name + "' deletado");
        setOpenModalDelete(false);
        fetchCategories();
    };

    const showModalDelete = (item) => {
        setSelectedItem(item);
        setOpenModalDelete(true);
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
                title="Categoria"
                buttonText="Categoria"
                handleChange={handleSearchInput}
                handleClick={handleCreateClick}
                placeholderInput="Buscar categoria"
                searchValue={searchInput}
                isLoading={isLoading}
            />
            <div className="h-[calc(100%-88px)] my-10">
                {categories.length > 0 ? (
                    <Paper sx={{ width: "100%", height: "100%" }}>
                        <TableContainer
                            sx={{ maxHeight: 440, height: "calc(100% - 52px)", backgroundColor: "#5A6169" }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{ fontWeight: "bold", color: "white", backgroundColor: "#2C2C2C" }}
                                        >
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
                                    {categories
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .sort((a, b) => a.id - b.id)
                                        .map((item) => (
                                            <TableRow key={item.id} sx={{ backgroundColor: "#EDEEF0" }}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell sx={{ textAlign: "center" }}>
                                                    <Tooltip title="Clique para editar">
                                                        <IconButton
                                                            aria-label="edit"
                                                            onClick={() => handleEditClick(item)}
                                                        >
                                                            <EditRoundedIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Clique para excluir">
                                                        <IconButton
                                                            aria-label="delete"
                                                            onClick={() => showModalDelete(item)}
                                                        >
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
                            count={categories.length}
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
                ) : (
                    <div className="w-full h-full flex justify-center items-center">
                        <p className="text-gray-600">Nenhuma categoria adicionada.</p>
                    </div>
                )}
            </div>
            <ModalCategory
                open={openModalCategory}
                onClose={() => {
                    setOpenModalCategory(false);
                    setCategoryName("");
                    setEditCategoryId(null);
                    setIsEdit(false);
                }}
                onSave={handleSaveCategory}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                isEdit={isEdit}
                categoryId={editCategoryId}
            />
            <ModalDelete
                open={openModalDelete}
                onClose={() => setOpenModalDelete(false)}
                onDelete={handleDeleteClick}
                itemName={selectedItem?.name ?? "Categoria"}
            />
        </div>
    );
}
