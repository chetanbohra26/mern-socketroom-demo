import axios from "axios";

import { config } from "../config";

const httpCall = async (httpConf) => {
	try {
		if (!httpConf.headers) {
			httpConf.headers = {};
		}
		if (!httpConf.headers.timeout) {
			httpConf.headers.timeout = config.HTTP_REQ_TIMEOUT;
		}
		const response = await axios({
			...httpConf,
			url: `${config.apiURL}/${httpConf.url}`,
		});

		return response.data;
	} catch (err) {
		console.log(err);
		const { response } = err;
		if (response && response.data) return response.data;
		else
			return {
				success: false,
				message: "Unable to get response",
			};
	}
};

export const loginRequest = async (email, password) => {
	const res = await httpCall({
		method: "POST",
		url: "v1/auth/login",
		data: {
			email,
			password,
		},
	});

	//console.log(res);
	return res;
};

export const registerRequest = async (name, email, password) => {
	const res = await httpCall({
		method: "POST",
		url: "v1/auth/register",
		data: {
			name,
			email,
			password,
		},
	});

	//console.log(res);
	return res;
};
