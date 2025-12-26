import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const shopid = 515;

export const getUserData = () => {
    try {
        const cookieValue = Cookies.get("ualum");
        if (!cookieValue) return null;

        const userData = JSON.parse(cookieValue);

        return {
            u_id: userData.u_id || null,
            user_id: userData.user_id || null,
            username: userData.user_name || null,
            email: userData.email || null,
            mobile: userData.mobile || null,
            first_name: userData.first_name || null,
            last_name: userData.last_name || null,
            roles: userData.roles || null,
        };
    } catch (error) {
        console.error("Error reading user data:", error);
        return null;
    }
};

export const getUserId = () => {
    try {
        const cookieValue = Cookies.get("ualum");
        if (!cookieValue) return null;

        const userData = JSON.parse(cookieValue);
        return userData.u_id || userData.user_id || userData.id || null; // 👈 main numeric ID
    } catch (error) {
        console.error("Error getting user ID:", error);
        return null;
    }
};


export const imagePrefix = "https://s3.ap-south-1.amazonaws.com/business.strackit.com/";