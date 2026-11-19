import { useEffect, useState } from "react";
import { UserService } from "../service/user/user.service";
import { CookieHelper } from "../helper/cookie.helper";
import { unwrap } from "../lib/apiResponse";

/**
 * Return user details from server use in component
 * @returns
 */
export function useUser(context = null) {
  const [user, setUser] = useState<any>(null);

  const getUserDetails = async () => {
    try {
      const token = CookieHelper.get({ key: "token", context }) || "";
      const res = await UserService.getUserDetails({ token, context });
      const userData = unwrap(res);
      setUser(userData || null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return user;
}

/**
 * Return user details from server use in serversideprops
 * @returns
 */
export async function getUser(context = null) {
  try {
    const token = CookieHelper.get({ key: "token", context }) || "";
    const res = await UserService.getUserDetails({ token, context });
    return unwrap(res) || null;
  } catch {
    return null;
  }
}
