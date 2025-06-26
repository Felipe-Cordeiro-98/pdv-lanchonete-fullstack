import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="min-w-[280px] h-full border-r border-secondary">
            <div className="h-[150px] flex justify-center items-center">
                <h3 className="text-lg text-white font-bold">LOGO</h3>
            </div>
            <nav className="h-[calc(100%-150px)] overflow-y-auto">
                <ul className="px-6">
                    {/* Link para Vendas */}
                    <li className="my-2 text-lg text-white ">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `${
                                    isActive ? "bg-quaternary" : "hover:bg-secondary"
                                } flex items-center gap-2 px-6 py-2 rounded-md`
                            }
                        >
                            <ShoppingCartRoundedIcon fontSize="medium" /> Vendas
                        </NavLink>
                    </li>
                    {/* Link para Produtos */}
                    <li className="my-2 text-lg text-white rounded-md">
                        <NavLink
                            to="/products"
                            className={({ isActive }) =>
                                `${
                                    isActive ? "bg-quaternary" : "hover:bg-secondary"
                                } flex items-center gap-2 px-6 py-2 rounded-md`
                            }
                        >
                            <Inventory2RoundedIcon fontSize="medium" /> Produtos
                        </NavLink>
                    </li>
                    {/* Link para Categorias */}
                    <li className="my-2 text-lg text-white rounded-md hover:bg-secondary">
                        <NavLink
                            to="/categories"
                            className={({ isActive }) =>
                                `${
                                    isActive ? "bg-quaternary" : "hover:bg-secondary"
                                } flex items-center gap-2 px-6 py-2 rounded-md`
                            }
                        >
                            <CategoryIcon fontSize="medium" /> Categorias
                        </NavLink>
                    </li>
                    {/* Link para Relatórios */}
                    <li className="my-2 text-lg text-white rounded-md hover:bg-secondary">
                        <NavLink
                            to="/reports"
                            className={({ isActive }) =>
                                `${
                                    isActive ? "bg-quaternary" : "hover:bg-secondary"
                                } flex items-center gap-2 px-6 py-2 rounded-md`
                            }
                        >
                            <BarChartIcon fontSize="medium" /> Relatórios
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
