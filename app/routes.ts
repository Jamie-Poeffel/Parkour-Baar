import { type RouteConfig, index, route } from "@react-router/dev/routes";


export default [
    index("routes/home.tsx"),
    route("/login/not-allowed", "routes/notallowed.tsx"),
    route("/login", "routes/login.tsx"),
    route("/user", "routes/user.tsx"),
] satisfies RouteConfig;