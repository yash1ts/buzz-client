import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "./Home";
import ErrorPage from "../components/Error";
import NewCall from "../pages/NewCall";
import JoinCall from "../pages/JoinCall";

export default createBrowserRouter([
    {
        path: "/",
        element: < Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/new",
        element: <NewCall />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/join",
        element: <JoinCall />,
        errorElement: <ErrorPage />,
    }
]);