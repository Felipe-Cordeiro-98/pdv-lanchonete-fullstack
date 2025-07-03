import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Box } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";

export default function ModalCategoria({
    open,
    onClose,
    onSave,
    categoryName,
    setCategoryName,
    isEdit = false,
    categoryId = null,
}) {
    return (
        <Dialog
            onClose={onClose}
            open={open}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: "#191A19",
                        borderRadius: 2,
                        minWidth: 450,
                        padding: '12px'
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#C8C8C8",
                    fontSize: "1rem",
                    fontWeight: "bold",
                }}
            >
                <CategoryIcon />
                {isEdit ? "Atualizar categoria" : "Adicionar nova categoria"}
            </DialogTitle>

            <DialogContent sx={{ pt: 1.5 }}>
                {isEdit && (
                    <Box mb={1}>
                        <Typography fontSize="14px" color="#7A7A7A">
                            Categoria ID:{" "}
                            <Typography component="span" fontSize="14px" color="#FFFFFF">
                                {categoryId}
                            </Typography>
                        </Typography>
                    </Box>
                )}

                <Typography fontSize="14px" color="#7A7A7A" mb={0.5} component="label" htmlFor="category-name">
                    Categoria
                </Typography>

                <TextField
                    id="category-name"
                    fullWidth
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Digite o nome da categoria"
                    variant="outlined"
                    autoFocus
                    InputProps={{
                        sx: {
                            backgroundColor: "#2C2C2C",
                            color: "#FFFFFF",
                            fontSize: "14px",
                            "&::placeholder": {
                                color: "#C8C8C8",
                            },
                        },
                    }}
                    inputProps={{
                        style: {
                            color: "#C8C8C8",
                            fontSize: "14px",
                        },
                    }}
                />
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" sx={{ color: "#C8C8C8", borderColor: "#C8C8C8" }} onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" sx={{ backgroundColor: "#8946A6", color: "#fff" }} onClick={onSave}>
                    {isEdit ? "Atualizar" : "Salvar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
