import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

export default function ModalDelete({ open, onClose, onDelete, itemName }) {
    return (
        <Dialog
            onClose={onClose}
            open={open}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: "#191A19",
                        borderRadius: 2,
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    color: "#FD3535",
                    fontSize: "1rem",
                    fontWeight: "bold",
                }}
            >
                <ReportProblemOutlinedIcon fontSize="medium" /> CONFIRMAÇÃO DE EXCLUSÃO
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: "#C8C8C8" }}>
                    Tem certeza de que deseja excluir "{itemName}"
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" sx={{ color: "#C8C8C8", borderColor: "#C8C8C8" }} onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" sx={{ backgroundColor: "#FD3535" }} onClick={onDelete}>
                    Deletar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
