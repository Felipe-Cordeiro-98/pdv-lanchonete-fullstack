import {
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
import ModalDelete from "../components/ModalDelete";
import ModalCategory from "../components/ModalCategory";

import { useEffect, useState } from "react";
import api from "../services/api";
import InfiniteScroll from "react-infinite-scroll-component";
import CategoryCard from "../components/CategoryCard";
import { toast, ToastContainer } from "react-toastify";

export default function CategoryPage() {
    const [searchInput, setSearchInput] = useState("");
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalCategory, setOpenModalCategory] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // desktop
    const [desktopCategories, setDesktopCategories] = useState([]);
    const [desktopPage, setDesktopPage] = useState(0);
    const [totalElementsPage, setTotalElementsPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // mobile
    const [mobileCategories, setMobileCategories] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        if (isMobile) {
            handleInfiniteScroll();
            return;
        }
        fetchCategories();
    }, [isMobile, desktopPage, rowsPerPage]);

    const handleInfiniteScroll = async () => {
        const res = await api.get("/categories");
        setMobileCategories(res.data);
        setHasMore(false);
    };

    const fetchCategories = async () => {
        const res = await api.get("/categories");
        setDesktopCategories(res.data);
        setTotalElementsPage(res.data.lenght);
    };

    const handleSaveCategory = async () => {
        if (!categoryName.trim()) return;

        if (isEdit) {
            try {
                await api.put(`/categories/${editCategoryId}`, {
                    name: categoryName.trim(),
                });
                toast.success("Categoria atualizada com sucesso.");
            } catch (error) {
                console.error("Erro ao editar categoria", error);
                toast.error("Erro ao editar categoria");
            }
        } else {
            try {
                await api.post("/categories", {
                    name: categoryName.trim(),
                });
                toast.success("Categoria criada com sucesso.");
            } catch (error) {
                console.error("Erro ao cadastrar categoria", error);
                toast.error("Erro ao cadastrar categoria");
            }
        }
        setCategoryName("");
        setEditCategoryId(null);
        setIsEdit(false);
        setOpenModalCategory(false);

        fetchCategories();
    };

    const handleCreateCategory = () => {
        setCategoryName("");
        setEditCategoryId(null);
        setIsEdit(false);
        setOpenModalCategory(true);
    };

    const handleEditCategory = (item) => {
        setCategoryName(item.name);
        setEditCategoryId(item.id);
        setIsEdit(true);
        setOpenModalCategory(true);
    };

    const handleDeleteCategory = async () => {
        try {
            await api.delete(`/categories/${selectedItem.id}`);
            toast.success("Categoria excluida com sucesso.");
        } catch (error) {
            console.error("Erro ao excluir categoria", error);
            toast.error("Erro ao excluir categoria");
        }
        setOpenModalDelete(false);
        fetchCategories();
    };

    const showModalDelete = (item) => {
        setSelectedItem(item);
        setOpenModalDelete(true);
    };

    // search input
    const handleSearchInput = (event) => {
        setSearchInput(event.target.value);
    };

    // pagination
    const handleChangePage = (event, newPage) => {
        setDesktopPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setDesktopPage(0);
    };

    // style table
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
                pageTitle="Categoria"
                inputPlaceholder="Buscar categoria"
                inputChange={handleSearchInput}
                inputValue={searchInput}
                handleButtonClick={handleCreateCategory}
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
                                        <TableCell sx={cellStyle}>Categoria</TableCell>
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
                                    {desktopCategories.map((cat) => (
                                        <TableRow key={cat.id}>
                                            <TableCell sx={[rowStyle, { display: { xs: "none", md: "table-cell" } }]}>
                                                {cat.id}
                                            </TableCell>
                                            <TableCell sx={rowStyle}>{cat.name}</TableCell>
                                            <TableCell
                                                sx={[
                                                    rowStyle,
                                                    { display: { xs: "none", md: "table-cell" }, textAlign: "center" },
                                                ]}
                                            >
                                                <Tooltip title="Clique para editar">
                                                    <IconButton
                                                        aria-label="edit"
                                                        onClick={() => handleEditCategory(cat)}
                                                    >
                                                        <EditRoundedIcon sx={{ color: "#C8C8C8" }} />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Clique para excluir">
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => showModalDelete(cat)}
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
                            rowsPerPageOptions={[{ label: "All", value: totalElementsPage }]}
                            component="div"
                            count={desktopCategories.length}
                            rowsPerPage={desktopCategories.length}
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
                        dataLength={mobileCategories.length}
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
                        {mobileCategories.map((cat) => (
                            <CategoryCard
                                key={cat.id}
                                categoryId={cat.id}
                                categoryName={cat.name}
                                onEdit={() => handleEditCategory(cat)}
                                onDelete={() => showModalDelete(cat)}
                            />
                        ))}
                    </InfiniteScroll>
                </div>
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
                onDelete={handleDeleteCategory}
                itemName={selectedItem?.name ?? "Categoria"}
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
