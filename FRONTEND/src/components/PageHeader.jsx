import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function PageHeader({ title, buttonText, handleChange, handleClick, searchValue, placeholderInput, isLoading }) {
    return (
        <div className="h-12 flex justify-between items-center">
            <div className="h-full flex items-center">
                <h2 className="mr-9 text-2xl text-white font-semibold">{title}</h2>
                <Paper
                    component="form"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: 300,
                        height: 35,
                        backgroundColor: "#2C2C2C",
                        px: 1,
                        py: 0.5,
                        borderRadius: "25px",
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <IconButton type="submit" sx={{ p: "8px" }} aria-label="search">
                        <SearchIcon sx={{ color: "#C8C8C8" }} />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1, color: "#C8C8C8" }}
                        placeholder={placeholderInput}
                        value={searchValue}
                        onChange={handleChange}
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
