// converts degress to radians
export const rad = x => (x * Math.PI) / 180;

// converts radians to degrees
export const deg = x => (x * 180) / Math.PI;

export const map = (n, start1, stop1, start2, stop2) => (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;

export const choose = list => list[Math.floor(Math.random() * list.length)];
