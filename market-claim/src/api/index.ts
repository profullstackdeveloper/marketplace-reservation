import { APIInstance } from "../utils/index"

const apiClient = new APIInstance(import.meta.env.VITE_API_URL as string).getInstance();

export const validateCode = async (code: string) => {
    const result = await apiClient.get('/api/verifyCode', {
        params: {
            code
        }
    });

    return result;
}

export const validateEmail = async (email: string) => {
    const result = await apiClient.get('/api/isEmailUsed', {
        params: {
            email
        }
    });

    return result;
}

export const validateWallet = async (wallet: string) => {
    const result = await apiClient.get('/api/isWalletUsed', {
        params: {
            wallet
        }
    });

    return result;
}

export const reserveData = async (code: string, email: string, wallet: string, signature: string) => {
    const result = await apiClient.post('/api/reserve', {
        code,
        email,
        wallet,
        signature
    });

    return result;
}