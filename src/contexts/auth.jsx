import { useState, createContext, useEffect } from "react";
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

/**
 * Criando contexto para autenticação da aplicação
 */
export const AuthContext = createContext({});

/**
 * Provendo dados da autenticação para toda a aplicação
 */
function AuthProvider({ children }) {

    const[user, setUser] = useState(null);
    const[loadingAuth, setLoadingAuth] = useState(false);
    const[loading, setLoading] = useState();

    useEffect(() => {
        async function loadUser(){
            /**Busca o usuário que estava logado no sistema(Permanencia de login) */
            const storageUser = localStorage.getItem("@ticketsPRO");

            /**Se encontrar um usuário logado, passa para a aplicação */
            if(storageUser) {
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);
        }   

        loadUser();
    }, []);

    const navigate = useNavigate();

    async function signIn(email, password) {
        setLoadingAuth(true);
        await signInWithEmailAndPassword(auth, email, password)
        .then(async (value) => {
            let uid = value.user.uid; //Pegando UID retornado pelo banco ao fazer login

            const docRef = doc(db, 'users', uid); //Montando a referência do usuário
            const docSnap = await getDoc(docRef); //Fazendo a busca do usuário
            console.log(docSnap.data);
            let data = { //Montado objeto do usuário para a aplicação
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl,
            };

            setUser(data); //Passa o usuário para a aplicação
            storageUser(data); //Guarda os dados do usuário que logou
            setLoadingAuth(false);
            toast.success('Bem-vindo de volta!');
            navigate('/dashboard'); //Direciona para a dashboard do sistema
            })
        .catch((error) => {
            console.log(error);
            setLoadingAuth(false)
            toast.error('Ocorreu um erro ao fazer login');
        });
    }

    /**
     * @apiNote Cadastro de novo usuário 
     * @param {string} email 
     * @param {string} password 
     * @param {string} name 
     */
    async function signUp(email, password, name) {
        setLoadingAuth(true);
        await createUserWithEmailAndPassword(auth, email, password) //Passando dados da criação do usuário pro firebase
              .then(async (value) => { //Pegando retorno caso ocorra tudo certo
                    let uid = value.user.uid;

                    await setDoc(doc(db, 'users', uid), { //Criando um novo registro no banco, algo como: users > uid > dados do usuário
                        //Dados do usuário
                        nome: name,
                        avatarUrl: null
                    })
                     .then(() => {
                        let data = { //Montado objeto do usuário para a aplicação
                            uid: value.user.uid,
                            nome: name,
                            email: value.user.email,
                            avatarUrl: null
                        };
                        setUser(data); //Passando usuário para o contexto da aplicação
                        storageUser(data);
                        setLoadingAuth(false);
                        toast.success('Seja bem-vindo ao sistema!');
                        navigate('/dashboard'); //Após a conta estar criada, direciona o usuário para a página de dashboard

                    })
                }).catch((error) => {
                console.log(error);
                setLoadingAuth(false);
              });
    }

    /**
     * @apiNote Salva os dados do usuário logado no localStorage
     * @param {User} data 
     */
    function storageUser(data) {
        localStorage.setItem('@ticketsPRO', JSON.stringify(data));
    }

    async function logout() {
        await signOut(auth);
        localStorage.removeItem("@ticketsPRO");
        setUser(null);
    }


    return(
        <AuthContext.Provider value={{
            signed: !!user, //!!Converte a variável para boolean,
            user,
            signIn,
            signUp,
            signOut,
            loadingAuth,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;