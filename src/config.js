const commonConfig = {
	HTTP_REQ_TIMEOUT: 10 * 1000,
};

const prodConfig = {
	apiURL: "/api",
	localServerURL: "/",
	...commonConfig,
};
const devConfig = {
	apiURL: "http://localhost:7500/api",
	localServerURL: "http://localhost:7500",
	...commonConfig,
};

export const config =
	process.env.NODE_ENV === "development" ? devConfig : prodConfig;
