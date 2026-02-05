export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/daily-tracker/:path*",
    "/tasks/:path*",
    "/content/:path*",
    "/business/:path*",
  ],
};
