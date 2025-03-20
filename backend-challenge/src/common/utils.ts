import crypto from 'crypto';

const CODE_LENGTH = 8;
const SEGMENT_LENGTH = 4;

export const generateInviteCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
        const idx = crypto.randomInt(0, chars.length);
        code += chars[idx];
    }
    // Insert separator
    return `${code.substr(0, SEGMENT_LENGTH)}${code.substr(
        SEGMENT_LENGTH
    )}`;
};