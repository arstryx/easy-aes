/*
 * Advanced Encryption Standard (AES)
 * Author: Arsenii Zakharenko (https://github.com/arstryx/simple-aes)
 * See details in readme.md
 * 
 */



/********************* Initial Settings *********************/

const key_length = 128; // possible 128 / 192 / 256 bits

const Nb = 4; // 4 bytes per word fixed for AES

const Nk = key_length / 32; // number of 4B words per key

const Nr = Nk + 6; // number of rounds for selected key_length





/********************* Tables *********************/

const Sbox = [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
                        0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
                        0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
                        0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
                        0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
                        0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
                        0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
                        0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
                        0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
                        0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
                        0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
                        0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
                        0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
                        0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
                        0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
                        0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

const InvSbox = [
                0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
                0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
                0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
                0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
                0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
                0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
                0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
                0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
                0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
                0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
                0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
                0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
                0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
                0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
                0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
                0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
            ];

const Rcon = [ [0x00, 0x00, 0x00, 0x00],
                     [0x01, 0x00, 0x00, 0x00],
                     [0x02, 0x00, 0x00, 0x00],
                     [0x04, 0x00, 0x00, 0x00],
                     [0x08, 0x00, 0x00, 0x00],
                     [0x10, 0x00, 0x00, 0x00],
                     [0x20, 0x00, 0x00, 0x00],
                     [0x40, 0x00, 0x00, 0x00],
                     [0x80, 0x00, 0x00, 0x00],
                     [0x1b, 0x00, 0x00, 0x00],
                     [0x36, 0x00, 0x00, 0x00] ];





/********************* Main Functions *********************/

// For the whole message
async function encrypt(message, password) {
    let encoder = new TextEncoder();
    message = encoder.encode(message);
    password = encoder.encode(password);
    message = pad_message(message);

    let key_schedule = key_expansion(await generate_key(password));

    let encrypted = new Uint8Array(message.length);
    for (let i = 0; i < message.length; i += 16) {
        let block = message.slice(i, i + 16);
        let encryptedBlock = cipher(block, key_schedule);
        encrypted.set(encryptedBlock, i);
    }

    return bytes_to_base64(encrypted);
}

// For one 16B block
function cipher(input, w) {

    // Create 2-D 4*4B state from 1-D 16B input
    let state = [[], [], [], []];
    for (let i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

    // Do all encrypting steps
    state = add_round_key(state, w, 0);
    for (let round=1; round<Nr; round++) {
        state = sub_bytes(state);
        state = shift_row(state);
        state = mix_columns(state);
        state = add_round_key(state, w, round);
    }
    state = sub_bytes(state);
    state = shift_row(state);
    state = add_round_key(state, w, Nr, Nb);

    // Output again as 1-D array
    let output = new Array(4 * Nb);
    for (let i=0; i < 4 * Nb; i++) {
        output[i] = state[i % 4][Math.floor(i / 4)];
    }
    return output;
}



async function decrypt(message, password){
    let encoder = new TextEncoder();
    message = base64_to_bytes(message);
    password = encoder.encode(password);

    let key_schedule = key_expansion(await generate_key(password));

    let decoder = new TextDecoder();
    let decrypted = new Uint8Array(message.length);
    for (let i = 0; i < message.length; i += 16) {
        let block = message.slice(i, i + 16);
        let encryptedBlock = decipher(block, key_schedule);
        decrypted.set(encryptedBlock, i);
    }
    console.log(decrypted);
    return decoder.decode(decrypted).replace(/\u0000/g, '');

}

function decipher(input, w) {
    let state = [[], [], [], []];


    for (let i = 0; i < 4 * Nb; i++) {
        state[i % 4][Math.floor(i / 4)] = input[i];
    }


    state = add_round_key(state, w, Nr);

    for (let round = Nr - 1; round >= 1; round--) {
        state = inv_shift_row(state);
        state = inv_sub_bytes(state);
        state = add_round_key(state, w, round);
        state = inv_mix_columns(state);
    }


    state = inv_shift_row(state);
    state = inv_sub_bytes(state);
    state = add_round_key(state, w, 0);

    let output = new Array(4 * Nb);
    for (let i = 0; i < 4 * Nb; i++) {
        output[i] = state[i % 4][Math.floor(i / 4)];
    }

    return output;
}






/********************* Internal Functions *********************/

function key_expansion(key){


    w = new Array(Nb * (Nr + 1));

    temp = new Array(4); // word temp

    for (let i = 0; i < Nk; i++) {
        w[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
    }

    for (let i = Nk; i < Nb * (Nr + 1); i++) {

        w[i] = new Array(4);
        
        for (let t = 0; t < 4; t++) {
            temp[t] = w[i - 1][t];
        }

        if (i % Nk == 0) {
            temp = sub_word(rot_word(temp));
            for (let t=0; t < 4; t++) {
                temp[t] ^= Rcon[i / Nk][t];
            }
        }
        else if (Nk > 6 && i % Nk == 4) {
            temp = sub_word(temp);
        }
        for (let t = 0; t < 4; t++) {
            w[i][t] = w[i - Nk][t] ^ temp[t];
        }
    }

    return w;


    function sub_word(word) {
        for (let i = 0; i < 4; i++) {
            word[i] = Sbox[word[i]];
        }
        return word;
    }

    function rot_word(word) {
        let tmp = word[0];
        for (let i = 0; i < 3; i++) {
            word[i] = word[i+1];
        }
        word[3] = tmp;
        return word;
    }
}

function sub_bytes(state) {
    for (let r=0; r < 4; r++) {
        for (let c= 0; c < Nb; c++) {
            state[r][c] = Sbox[state[r][c]];
        }
    }
    return state;
}

function shift_row(state) {
    let t = new Array(4);
    for (let r= 1; r < 4; r++) {
        for (let c= 0; c < 4; c++) t[c] = state[r][(c + r) % Nb];
        for (let c= 0; c < 4; c++) state[r][c] = t[c];
    }
    return state;
}

function mix_columns(state) {
    for (let c = 0; c < 4; c++) {
        let a = new Array(4);
        let b = new Array(4);
        for (let i= 0; i < 4; i++) {
            a[i] = state[i][c];
            b[i] = state[i][c] & 0x80 ? state[i][c] << 1 ^ 0x011b : state[i][c] << 1;
        }

        state[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // 2*a0 + 3*a1 + a2 + a3
        state[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 * 2*a1 + 3*a2 + a3
        state[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + 2*a2 + 3*a3
        state[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // 3*a0 + a1 + a2 + 2*a3
    }
    return state;
}

function add_round_key(state, w, round) {
    for (let r= 0; r < 4; r++) {
        for (let c= 0; c < Nb; c++) {
            state[r][c] ^= w[round * 4 + c][r];
        }
    }
    return state;
}

function inv_mix_columns(s) {
    for (let c = 0; c < 4; c++) {
        let a = new Array(4);
        for (let i = 0; i < 4; i++) {
            a[i] = s[i][c];
        }

        s[0][c] = mul(0x0E, a[0]) ^ mul(0x0B, a[1]) ^ mul(0x0D, a[2]) ^ mul(0x09, a[3]);
        s[1][c] = mul(0x09, a[0]) ^ mul(0x0E, a[1]) ^ mul(0x0B, a[2]) ^ mul(0x0D, a[3]);
        s[2][c] = mul(0x0D, a[0]) ^ mul(0x09, a[1]) ^ mul(0x0E, a[2]) ^ mul(0x0B, a[3]);
        s[3][c] = mul(0x0B, a[0]) ^ mul(0x0D, a[1]) ^ mul(0x09, a[2]) ^ mul(0x0E, a[3]);
    }
    return s;

    function mul(a, b) {
        let p = 0;
        for (let counter = 0; counter < 8; counter++) {
            if (b & 1) {
                p ^= a;
            }
            let hiBitSet = a & 0x80;
            a <<= 1;
            if (hiBitSet) a ^= 0x1b;
            b >>= 1;
        }
        return p & 0xFF;
    }
}

function inv_sub_bytes(s) {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < Nb; c++) s[r][c] = InvSbox[s[r][c]];
    }
    return s;
}

function inv_shift_row(s) {
    let t = new Array(4);
    for (let r = 1; r < 4; r++) {
        for (let c = 0; c < 4; c++) t[(c + r) % Nb] = s[r][c];
        for (let c = 0; c < 4; c++) s[r][c] = t[c];
    }
    return s;
}




/********************* Additional Functions *********************/

function pad_message(message) {
    let padLength = 16 - (message.length % 16);
    let paddedMessage = new Uint8Array(message.length + padLength);
    paddedMessage.set(message);
    return paddedMessage;
}

function bytes_to_base64(bytes) {
    return btoa(String.fromCharCode(...bytes));
}

function base64_to_bytes(base64) {
    return new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
}

async function generate_key(password) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", password);
    const hashArray = new Uint8Array(hashBuffer);
    return hashArray.slice(0, Nk * 4);
}



