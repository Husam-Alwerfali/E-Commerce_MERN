/**
 * Redirects user based on their role extracted from JWT token
 */
export const redirectBasedOnRole = (
  navigate: (path: string) => void,
  token?: string
) => {
  const tokenToUse = token || localStorage.getItem("token");

  if (!tokenToUse) {
    navigate("/");
    return;
  }

  try {
    const payload = JSON.parse(atob(tokenToUse.split(".")[1]));
    const userRole = payload.role || "user";

    if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("Error decoding token for redirect:", error);
    navigate("/");
  }
};

/**
 * Extracts user role from JWT token
 */
export const getUserRoleFromToken = (token?: string): string => {
  const tokenToUse = token || localStorage.getItem("token");

  if (!tokenToUse) {
    return "user";
  }

  try {
    const payload = JSON.parse(atob(tokenToUse.split(".")[1]));
    return payload.role || "user";
  } catch (error) {
    console.error("Error decoding token for role:", error);
    return "user";
  }
};
