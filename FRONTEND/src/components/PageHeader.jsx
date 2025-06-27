import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function PageHeader({ title, buttonText, handleChange, handleClick, searchValue, isLoading }) {
    return (
        <div className="w-full h-12 flex justify-between items-center px-6 my-10">
            <div className="h-full flex items-center">
                <h2 className="mr-9 text-2xl text-white font-semibold">{title}</h2>
                <Paper
                    component="form"
                    onSubmit={(event) => event.preventDefault()}
                    sx={{
                        p: "2px 4px",
                        display: "flex",
                        alignItems: "center",
                        width: 400,
                        height: 35,
                        backgroundColor: "#2C2C2C",
                        borderRadius: "25px",
                    }}
                >
                    <IconButton type="button" sx={{ p: "10px", color: "white" }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{
                            mx: 1,
                            flex: 1,
                            color: "white",
                            "::placeholder": {
                                color: "white",
                            },
                        }}
                        placeholder="Buscar"
                        inputProps={{ "aria-label": "search products" }}
                        onChange={handleChange}
                        value={searchValue}
                    />
                </Paper>
            </div>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="medium"
                loadingPosition="start"
                loading={isLoading}
                onClick={handleClick}
                sx={{
                    backgroundColor: "#8946A6",
                    borderRadius: "25px",
                    height: "35px",
                    textTransform: "none",
                    "&.Mui-disabled": {
                        backgroundColor: "#54346B",
                        color: "#606060",
                    },
                }}
            >
                {buttonText}
            </Button>
        </div>
    );
}
