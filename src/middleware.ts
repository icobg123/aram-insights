import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/"];

const isPublic = (path: string) => {
  const exactPaths = publicPaths.filter((x) => !x.endsWith("*"));
  const wildcardPaths = publicPaths.filter((x) => x.endsWith("*"));

  // Check if the path exactly matches any of the exactPaths
  if (exactPaths.includes(path)) {
    return true;
  }

  // Check if the path matches the wildcardPaths by checking if the path starts with the wildcard part
  const matchingWildcardPath = wildcardPaths.find((x) => {
    const wildcardPart = x.replace("*", "");
    return path.startsWith(wildcardPart);
  });
  // Only the final part of a path is considered when determining if it's public or not.
  // Parent paths are not treated as public unless explicitly specified with a wildcard path.
  return !!matchingWildcardPath;
};
export default function middleware(req: NextRequest) {
  if (isPublic(req.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/", req.url));
}
export const config = {
  matcher: "/((?!_next/image|_next/static|.*\\..*|favicon.ico).*)",
};
