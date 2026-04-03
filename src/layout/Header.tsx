import {AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {
    return (
    <AppBar position="static" sx={{ backgroundColor: "#a5b4fc"}} >
        <Toolbar>
            <Typography variant="h6">
                Inventify Demo
            </Typography>
        </Toolbar>
    </AppBar>
    );
};
export default Header;
