import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InputSearch from "./InputSearch";

export default function PageHeader({ pageTitle, inputPlaceholder, inputChange, inputValue, handleButtonClick }) {
    const HeaderButton = () => (
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleButtonClick}
            sx={{
                height: "35px",
                padding: "4px 14px",
                borderRadius: "32px",
                textTransform: "none",
                backgroundColor: "#8946A6",
                "&.Mui-disabled": {
                    backgroundColor: "#54346B",
                    color: "#606060",
                },
            }}
        >
            {pageTitle}
        </Button>
    );

    return (
        <div className="md:h-[100px] md:flex-row md:justify-normal h-[130px] flex flex-col justify-evenly px-5">
            <div className="flex justify-between items-center">
                <h1 className="text-white font-semibold text-2xl">{pageTitle}</h1>
                <div className="md:hidden">
                    <HeaderButton />
                </div>
            </div>
            <div className="md:w-full md:flex md:justify-between md:items-center md:pl-5">
                <div className="md:max-w-[400px] md:w-full">
                    <InputSearch placeholder={inputPlaceholder} onChange={inputChange} value={inputValue} />
                </div>
                <div className="md:block hidden">
                    <HeaderButton />
                </div>
            </div>
        </div>
    );
}
