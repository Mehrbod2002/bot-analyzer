export type Action =
  | 'read'
  | 'write'
  | 'media';

export const actionsObject: Record<string, string> = {
  read: 'read',
  write: 'write',
  media: 'media',
};

export const SymbolSide: Record<string, string> = {
  forex: "forex",
  commodity: "commodity",
  index: "index",
  crypto: "crypto",
  stock: "stock",
  fiat: "fiat",
};

export const SymbolType: Record<string, string> = {
  payment: "payment",
  metatrader: "metatrader",
};

export const firebaseConfig = {
  apiKey: "AIzaSyCUe-tja_qrfUgxdvOJs-Z7fpMt7d_EMtQ",
  authDomain: "carat-b4654.firebaseapp.com",
  projectId: "carat-b4654",
  storageBucket: "carat-b4654.appspot.com",
  messagingSenderId: "774391439124",
  appId: "1:774391439124:web:52799fbc6eec99ff6b2c01",
  measurementId: "G-5061FGNKYJ"
};