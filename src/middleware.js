// export const onRequest = (context, next) => {
// 	console.log("onRequest", context.url.pathname);
// 	if (context.url.pathname === "/admin") {
// 		return context.rewrite(
// 			new Request(new URL("/admin/index.html", context.url), {
// 				headers: {
// 					"x-redirect-to": context.url.pathname,
// 				},
// 			})
// 		);
// 	}
// 	return next();
// };
