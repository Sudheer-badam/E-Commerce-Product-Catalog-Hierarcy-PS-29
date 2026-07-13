const str = "Badam Sudheer | 86885-09699 | Scan QR Code | ADDR:RAMALAYAM STREET , NADIGADDA, 522615 | TXN:ljlsdjwlwjdsfdlsdajw | EMAIL:sudheerbadam67@gmail.com";
const parts = str.split(' | ');
console.log(parts);

const emailRaw = parts.find(p => p.startsWith('EMAIL:'));
const email = emailRaw ? emailRaw.replace('EMAIL:', '').trim() : null;
console.log('Found email:', email);
