import { it , expect} from "bun:test";

// Configuration for the local test environment
const BASE_URL = "https://localhost:2000";
const headerVar = {
  "Origin": process.env.FRONT_END_URL || "http://localhost:3000"
};

it('should created new writer', async () => {
    const request = {
        username: "writer123",
        email: "writer@gmail.com",
        password: "Writer123{}[]"
    };
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
        headers: headerVar,
        body: JSON.stringify(request)
    });

    const data = await res.json();
    console.log("Create Response:", data);
    expect(res.status).toBe(201);
})

it('should get token', async () => {
    const res = await getToken();
    console.log(res);
    expect(res.status).toBe(200);
})

export const getToken = async () => {
    const request = {
        email: "writer@gmail.com",
        password: "Writer123{}[]"
    };
    const refreshToken = await fetch(`${BASE_URL}/login`, {
      method: "POST",
        headers: headerVar,
        body: JSON.stringify(request)
    });
    const authorization = await refreshToken.json();
    const token = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        headers: {
            ...headerVar,
            Cookie: `refresh-token=${authorization.token}`
        },
    })
    const res = await token.json();
    return authorization;
}