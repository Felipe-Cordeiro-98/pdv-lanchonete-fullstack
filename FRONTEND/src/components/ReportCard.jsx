import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import formatCurrency from "../utils/formatCurrency";
import { useState } from "react";

export default function ReportCard({ date, totalItems, totalValue, products }) {
    const [open, setOpen] = useState(false);

    const handleShowModal = () => {
        setOpen(!open);
    };

    const cellStyle = {
        color: "white",
        backgroundColor: "#2C2C2C",
        borderColor: "#3A3A3A",
    };

    const rowStyle = {
        color: "white",
        borderColor: "#222222",
    };

    return (
        <div className="bg-[#333] mb-2 rounded-md">
            <div className="flex justify-between p-2 hover:cursor-pointer" onClick={handleShowModal}>
                <div className="text-center text-white">
                    <h3 className="font-semibold">Data</h3>
                    <p className="text-tertiary">{date}</p>
                </div>
                <div className="text-center text-white">
                    <h3 className="font-semibold">Qtd.</h3>
                    <p className="text-tertiary">{totalItems}</p>
                </div>
                <div className="text-center text-white">
                    <h3 className="font-semibold">Valor total</h3>
                    <p className="text-tertiary">{formatCurrency(totalValue)}</p>
                </div>

                <IconButton onClick={handleShowModal}>
                    {open ? (
                        <KeyboardArrowUpIcon sx={{ color: "#8C8C8C" }} />
                    ) : (
                        <KeyboardArrowDownIcon sx={{ color: "#8C8C8C" }} />
                    )}
                </IconButton>
            </div>
            {open && (
                <TableContainer
                    sx={{
                        height: "100%",
                        backgroundColor: "#2C2C2C",
                        overflowY: "auto",
                        borderBottomLeftRadius: "8px",
                        borderBottomRightRadius: "8px",
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={cellStyle}>Produto</TableCell>
                                <TableCell sx={cellStyle}>Qtd.</TableCell>
                                <TableCell sx={cellStyle}>Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((prod) => (
                                <TableRow key={prod.productId}>
                                    <TableCell sx={rowStyle}>{prod.productNameAtSale}</TableCell>
                                    <TableCell sx={rowStyle}>{prod.quantity}</TableCell>
                                    <TableCell sx={rowStyle}>{formatCurrency(prod.subtotal)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
