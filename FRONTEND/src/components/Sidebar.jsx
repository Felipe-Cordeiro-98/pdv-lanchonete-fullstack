import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";

import { NavLink } from "react-router-dom";
import { useState } from "react";

const openedMixin = (theme) => ({
    width: 250,
    overflowX: "hidden",
    backgroundColor: "#2C2C2C",
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
});

const closedMixin = (theme) => ({
    width: 64,
    overflowX: "hidden",
    backgroundColor: "#2C2C2C",
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme }) => ({
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                "& .MuiDrawer-paper": openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                "& .MuiDrawer-paper": closedMixin(theme),
            },
        },
    ],
}));

export default function Sidebar() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen((prev) => !prev);
    };

    const navItems = [
        { to: "/", label: "Vendas", icon: <ShoppingCartRoundedIcon fontSize="medium" /> },
        { to: "/products", label: "Produtos", icon: <Inventory2RoundedIcon fontSize="medium" /> },
        { to: "/categories", label: "Categorias", icon: <CategoryIcon fontSize="medium" /> },
        { to: "/reports", label: "Relatórios", icon: <BarChartIcon fontSize="medium" /> },
    ];

    return (
        <Box sx={{ display: "flex", minWidth: "65px" }}>
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? "250px" : "64px",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    zIndex: 1200,
                }}
            >
                <DrawerHeader sx={{ justifyContent: open ? "flex-end" : "center" }}>
                    <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
                        {open ? (
                            theme.direction === "rtl" ? (
                                <ChevronRightIcon sx={{ color: "white" }} />
                            ) : (
                                <ChevronLeftIcon sx={{ color: "white" }} />
                            )
                        ) : (
                            <MenuRoundedIcon sx={{ color: "white" }} />
                        )}
                    </IconButton>
                </DrawerHeader>
                <List>
                    {navItems.map(({ to, label, icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `${
                                    isActive ? "bg-quaternary" : "hover:bg-[#3A3A3A]"
                                } no-underline text-white block rounded-md mx-2`
                            }
                        >
                            <ListItem disablePadding sx={{ display: "block" }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? "initial" : "center",
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: "white",
                                        }}
                                    >
                                        {icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={label}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            color: "white",
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </NavLink>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}
