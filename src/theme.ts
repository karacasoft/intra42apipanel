import { createTheme } from "@material-ui/core";
import { cyan, purple } from "@material-ui/core/colors";

const theme = createTheme({
    palette: {
        primary: {
            main: cyan[300],
        },
        secondary: {
            main: purple[500],
        }
    }
});

export default theme;