import jwt from "jsonwebtoken";
import axios from "axios";

async function Validator(cookie) {
    const headers = {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0',
        'Cookie': decodeURIComponent(cookie.replace(/\r?\n|\r/g, '')),
    }
    try {
        // const response = await axios.get("https://leetcode.com/api/submissions/?offset=0&limit=20&lastkey=", {
        //     headers: headers,
        // })
        let leet = cookie.split(";").map((c) => c.trim()).find((el) => el.startsWith("LEETCODE_SESSION="));
        if (leet) {
            let leetToken = leet.split("=")[1];
            let decodedToken = jwt.decode(leetToken);
            return decodedToken;
        } else {
            return { error: true, message: "Invalid Token", status: 400 };
        }
    } catch (e) {
        if (e.status === 401) {
            return { error: true, message: "Invalid Cookie" }
        }
        return { error: true, message: e.message, };
    }
}

export default Validator;