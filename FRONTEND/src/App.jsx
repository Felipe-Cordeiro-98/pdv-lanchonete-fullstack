import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ThemeProvider>
    );
}