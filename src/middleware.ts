import { type NextRequest, NextResponse } from "next/server";

const publicPaths = [
	"/",
	"/search",
	"/sponsor",
	"/changes",
	"/pricing",
	"/about",
	"/auth",
	"/api",
	"/docs",
];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isPublic = publicPaths.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`),
	);

	if (isPublic) {
		return NextResponse.next();
	}

	const sessionCookie =
		request.cookies.get("better-auth.session_token") ||
		request.cookies.get("__Secure-better-auth.session_token");

	if (!sessionCookie) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|images|public).*)"],
};
