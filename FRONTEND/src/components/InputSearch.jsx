import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

export default function InputSearch({ inputRef, onChange, value, placeholder }) {
    return (
        <div className="w-full">
            <TextField
                inputRef={inputRef}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                fullWidth
                sx={{
                    backgroundColor: "#2C2C2C",
                    borderRadius: "32px",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "32px",
                        height: "40px",
                        "&.Mui-focused fieldset": {
                            borderColor: "transparent",
                        },
                    },
                    "& input": {
                        color: "#FFFFFF",
                        "::placeholder": {
                            color: "#A9A9A9",
                            opacity: 1,
                        },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#C8C8C8" }} />
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
}
