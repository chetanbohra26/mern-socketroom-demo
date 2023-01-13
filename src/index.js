import React from "react";
import ReactDOM from "react-dom/client";
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";

import "react-toastify/dist/ReactToastify.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { store } from "./store";
import App from "./App";

import Login from "./components/Login";
import Home from "./components/Home";
import Intro from "./components/Intro";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Provider store={store}>
				<App />
			</Provider>
		),
		children: [
			{ path: "/login", element: <Login /> },
			{ path: "/home", element: <Home /> },
			{ path: "/", element: <Intro /> },
		],
	},
	{
		path: "*",
		element: <Navigate to="/" replace />,
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	//<React.StrictMode>
	<RouterProvider router={router} />
	//</React.StrictMode>
);
