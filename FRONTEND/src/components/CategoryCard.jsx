import { IconButton, Tooltip } from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function CategoryCard({ categoryId, categoryName, onEdit, onDelete }) {
    return (
        <div className="w-full min-h-[80px] max-h-[100px] flex flex-col justify-around mb-2 px-4 py-2 bg-secondary rounded-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-tertiary text-xl font-bold">{categoryName}</h3>
                    <p className="text-[#6A6A6A] text-sm">
                        Categoria ID: <span className="text-tertiary">{categoryId}</span>
                    </p>
                </div>
                <div className="flex">
                    <Tooltip title="Clique para editar">
                        <IconButton aria-label="edit" onClick={onEdit}>
                            <EditRoundedIcon sx={{ color: "#C8C8C8" }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Clique para excluir">
                        <IconButton aria-label="delete" onClick={onDelete}>
                            <DeleteRoundedIcon sx={{ color: "#FB2C36" }} />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
