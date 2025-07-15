import { IconButton, Tooltip } from "@mui/material";
import formatCurrencyBRL from "../utils/formatCurrency";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function ProductCard({ productId, productName, productPrice, productStockQuantity, categoryName, onEdit, onDelete }) {
    return (
        <div className="w-full min-h-[150px] max-h-[200px] flex flex-col justify-around my-2 px-4 py-2 bg-secondary rounded-lg">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-tertiary text-xl font-bold">{productName}</h3>
                    <p className="text-[#6A6A6A] text-sm">
                        Produto ID: <span className="text-tertiary">{productId}</span>
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
            <div>
                <p className="text-white">
                    Preço: <span className="text-tertiary">{formatCurrencyBRL(productPrice)}</span>
                </p>
                <p className="text-white">
                    Estoque: <span className="text-tertiary">{productStockQuantity}</span>
                </p>
                <p className="text-white">
                    Categoria: <span className="text-tertiary">{categoryName}</span>
                </p>
            </div>
        </div>
    );
}
