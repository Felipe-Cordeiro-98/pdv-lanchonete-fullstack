import {
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReportCard from "../components/ReportCard";
import formatCurrency from "../utils/formatCurrency";
import api from "../services/api";
import { format, subDays } from "date-fns";
import { useState } from "react";

export default function Report() {
    const [startDate, setStartDate] = useState(() => format(subDays(new Date(), 7), "yyyy-MM-dd"));
    const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);

    const [itemsSold, setItemsSold] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [averageValue, setAverageValue] = useState(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/reports?start=${startDate}&end=${endDate}`);
            const data = res.data;
            setSales(data);

            const total = data.reduce((sum, sale) => sum + sale.totalAmount, 0);
            const totalItems = data.reduce((sum, sale) => {
                return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
            }, 0);
            const average = data.length > 0 ? total / data.length : 0;

            setTotalSales(total);
            setItemsSold(totalItems);
            setAverageValue(average);
        } catch (error) {
            console.error("Erro ao buscar relatório", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!startDate && !endDate) return;
        if (new Date(startDate) > new Date(endDate)) {
            alert("A data inicial não pode ser maior que a final.");
            return;
        }

        fetchSales();
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
        <div className="h-full px-5 overflow-y-auto">
            <div className="py-5">
                <h1 className="text-2xl text-white font-semibold">Relatório de vendas</h1>
            </div>

            {/* filtro de datas */}
            <div className="flex flex-col md:flex-row mb-4">
                <form id="range-date" onSubmit={handleSubmit} className="md:flex md:w-full md:gap-2">
                    <fieldset className="w-full flex flex-col">
                        <label className="text-tertiary">Data Inicial</label>
                        <input
                            name="startDate"
                            type="date"
                            className="w-full h-10 px-4 border border-secondary bg-white rounded-lg"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </fieldset>
                    <fieldset className="w-full flex flex-col">
                        <label className="text-tertiary">Data Final</label>
                        <input
                            name="end-date"
                            type="date"
                            className="w-full h-10 px-4 mb-2 border border-secondary bg-white rounded-lg"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </fieldset>
                </form>
                <div className="md:flex md:items-end md:mb-2 md:ml-4">
                    <Button
                        variant="contained"
                        type="submit"
                        form="range-date"
                        loading={loading}
                        loadingPosition="start"
                        fullWidth={isMobile}
                        sx={{
                            width: isMobile ? "100%" : "120px",
                            height: "40px",
                            padding: "4px 22px",
                            borderRadius: "16px",
                            textTransform: "none",
                            backgroundColor: "#8946A6",
                            "&.Mui-disabled": {
                                backgroundColor: "#54346B",
                                color: "#606060",
                            },
                        }}
                    >
                        Buscar
                    </Button>
                </div>
            </div>

            {sales.length > 0 ? (
                <>
                    {/* Resumo */}
                    <div className="md:flex-row flex flex-col gap-2 mb-3">
                        <div className="w-full flex justify-between items-center p-3 shadow-md rounded-xl bg-secondary">
                            <p className="text-sm text-gray-500">Total de Vendas</p>
                            <p className="text-lg font-semibold text-green-600">{formatCurrency(totalSales)}</p>
                        </div>
                        <div className="w-full flex justify-between items-center p-3 shadow-md rounded-xl bg-secondary">
                            <p className="text-sm text-gray-500">Valor Médio</p>
                            <p className="text-lg font-semibold text-blue-600">{formatCurrency(averageValue)}</p>
                        </div>
                        <div className="w-full flex justify-between items-center p-3 shadow-md rounded-xl bg-secondary">
                            <p className="text-sm text-gray-500">Itens Vendidos</p>
                            <p className="text-lg font-semibold text-purple-600">{itemsSold}</p>
                        </div>
                    </div>

                    <div className="h-[calc(100%-227px)]">
                        <div className="md:block hidden">
                            <TableContainer
                                sx={{ height: "100%", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
                            >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={cellStyle}>Data</TableCell>
                                            <TableCell sx={cellStyle}>Qtd</TableCell>
                                            <TableCell sx={cellStyle}>Valor Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sales.map((sale) => (
                                            <TableRow key={sale.id}>
                                                <TableCell sx={rowStyle}>
                                                    {format(new Date(sale.date), "dd/MM/yyyy")}
                                                </TableCell>
                                                <TableCell sx={rowStyle}>
                                                    {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
                                                </TableCell>
                                                <TableCell sx={rowStyle}>{formatCurrency(sale.totalAmount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="md:hidden h-full overflow-y-auto">
                            {sales.map((sale) => (
                                <ReportCard
                                    key={sale.id}
                                    date={format(new Date(sale.date), "dd/MM/yyyy")}
                                    totalItems={sale.items.reduce((sum, saleItem) => sum + saleItem.quantity, 0)}
                                    totalValue={sale.totalAmount}
                                    products={sale.items}
                                />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="md:h-[calc(100%-160px)] h-[calc(100%-265px)] flex justify-center items-center">
                    <h3 className="text-tertiary text-center">Selecione uma data para visualizar o relatório.</h3>
                </div>
            )}
        </div>
    );
}
