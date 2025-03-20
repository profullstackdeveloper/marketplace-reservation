import crypto from 'crypto';
import bcrypt from 'bcrypt';

const CODE_LENGTH = 8;
const CODE_SEPARATOR = '-';
const SEGMENT_LENGTH = 4;

export const generateInviteCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
        const idx = crypto.randomInt(0, chars.length);
        code += chars[idx];
    }
    // Insert separator
    return `${code.substr(0, SEGMENT_LENGTH)}${CODE_SEPARATOR}${code.substr(
        SEGMENT_LENGTH
    )}`;
};

export const hashInviteCode = async (code: string): Promise<string> => {
    const hash = crypto.createHash('sha256');
    hash.update(code);
    return hash.digest('hex');
};

export const compareInviteCode = async (
    code: string,
    hash: string
): Promise<boolean> => {
    return await bcrypt.compare(code, hash);
};
