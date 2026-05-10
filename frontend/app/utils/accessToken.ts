class token {
    constructor(private accessToken : string | null = null) { }
    getToken = () => {
        return this.accessToken;
    }
    setToken = (value : string | null) => {
        this.accessToken = value;
        return this.accessToken;
    }
}

export const accessToken = new token();