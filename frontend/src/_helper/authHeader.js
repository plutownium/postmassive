// FROM:
// https://jasonwatmore.com/post/2020/04/22/react-email-sign-up-with-verification-authentication-forgot-password
// the "Fetch Wrapper" part

// The authHeader() function is used to automatically add a JWT auth token to
// the HTTP Authorization header of the request if the user is logged in and
// the request is to the application api url.
import Cookies from "js-cookie";

import { userValue } from "../auth/use-auth";

export function getOptions(url) {
    return {
        method: "GET",
        headers: authHeader(url),
    };
}

export function postOptions(url, body) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(url),
        },
        credentials: "include",
        // body: JSON.stringify(body),
    };
}

export function putOptions(url, body) {
    return {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(url),
        },
        // body: JSON.stringify(body),
    };
}

// prefixed with underscored because delete is a reserved word in javascript
export function _deleteOptions(url) {
    return {
        method: "DELETE",
        headers: authHeader(url),
    };
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = userValue();
    if (!user) {
        return {};
    }
    const isLoggedIn = user && user.jwtToken;
    const isApiUrl = url.startsWith(process.env.REACT_APP_API_URL);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${Cookies.get("jwt")}` };
    } else {
        return {};
    }
}

// TODO: It might be nice to copy this style of catch-all "handleResponse" into the api

// function handleResponse(response) {
//     return response.text().then((text) => {
//         const data = text && JSON.parse(text);

//         if (!response.ok) {
//             if (
//                 [401, 403].includes(response.status) &&
//                 accountService.userValue
//             ) {
//                 // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
//                 accountService.logout();
//             }

//             const error = (data && data.message) || response.statusText;
//             return Promise.reject(error);
//         }

//         return data;
//     });
// }
