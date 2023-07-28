import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC8Cm1KV0bRg85mOrgdIUqdqc-IM2_ZLV8",
    authDomain: "tickets-35852.firebaseapp.com",
    projectId: "tickets-35852",
    storageBucket: "tickets-35852.appspot.com",
    messagingSenderId: "836835090056",
    appId: "1:836835090056:web:ed6035215f66035b67493d",
    measurementId: "G-NKHJZFTWC8"
};

/**
 * Incializando Configuração do banco
 */
const firebaseApp = initializeApp(firebaseConfig);

/**
 * Inicializando autenticação
 */
const auth = getAuth(firebaseApp);

/**
 * Inicializando conexão com o banco
 */
const db = getFirestore(firebaseApp);

/**
 * Inicializando conexão com o servidor 
 * que irá armazenar os arquivos do usuário
 */
const storage = getStorage(firebaseApp);

export { auth, db, storage };
