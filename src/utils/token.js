import jwtDecode from "jwt-decode";

const setToken = (token) => {
	localStorage.setItem("token", token);
};

const getToken = () => {
	return localStorage.getItem("token");
};

const removeToken = () => {
	localStorage.removeItem("token");
};

const getPayload = () => {
	const token = getToken();
	if (!token) return;

	try {
		return jwtDecode(token);
	} catch (err) {
		console.error("Invalid token stored");
		removeToken();
		return;
	}
};

export { setToken, getToken, removeToken, getPayload };
