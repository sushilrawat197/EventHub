import axios from "axios";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";
const { REFRESH_ACCESS_TOKEN } = endpoints;
import { clearUser } from "../../slices/userSlice";
import type { AppDispatch } from "../../reducers/store";
import { getCurrentUser } from "./userApi";
import { setLoading } from "../../slices/authSlice";

let refreshTimer: NodeJS.Timeout | null = null;


type RefreshTokenResponse = {
    statusCode:number;
    data: {
        accessTokenExpiry: string
    };
    message?: string;
};


export function refreshAccessToken() {
    return async (dispatch: AppDispatch): Promise<void> => {
        try {
            dispatch(setLoading(true));
            const response = await apiConnector<RefreshTokenResponse>({
                method: "POST",
                url: REFRESH_ACCESS_TOKEN,
                withCredentials: true,
                headers: {
                    "X-Client-Source": "WEB",
                },
            });

            if (response.data.statusCode === 200) {
                console.log("Fetching user...");
                await dispatch(getCurrentUser());
                console.log(response);
            }

            // console.log("REFRESH_ACCESS_TOKEN.....", response)
            const accessTokenExpiryString = response.data.data.accessTokenExpiry;
            // console.log("ACCESS TOKEN EXPIRY", accessTokenExpiryString);


            if (accessTokenExpiryString) {
                // ISO date ko Date object me convert karo
                const expiryDate = new Date(accessTokenExpiryString);
                const now = new Date();
                const diffMs = expiryDate.getTime() - now.getTime();

                // time before 1 min
                const timeToRefresh = diffMs - 60 * 1000;

                //  clear old timer
                if (refreshTimer) clearTimeout(refreshTimer);


                if (timeToRefresh > 0) {
                    refreshTimer = setTimeout(() => {
                        console.log(" Refreshing token before expiry...");
                        dispatch(refreshAccessToken());
                    }, timeToRefresh);

                    // console.log(
                    //     ` Next refresh scheduled in ${(timeToRefresh / 1000).toFixed(0)} seconds`
                    // );
                } else {
                    // Token already expired, refresh now
                    dispatch(refreshAccessToken());
                }

            }


        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error refreshing token:", error.response?.data);

                // Agar 401 aaya to refresh token expire -> logout
                if (error.response?.status === 401) {
                    console.warn("⚠ Refresh token expired, logging out user...");
                    dispatch(clearUser());
                    // navigate("/login"); // optional navigation
                }
            } else {
                console.error("Unknown error:", error);
            }

        } finally {
            dispatch(setLoading(false));
        }

    };
}

