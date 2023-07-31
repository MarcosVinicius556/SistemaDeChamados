import { useState, createContext, useEffect } from "react";
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword } from "firebase/auth";
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
    const[loadingAuth, setLoadingAuth] = useState(false)

    const navigate = useNavigate();

    function signIn(email, password) {
        console.log(email + " " + password );
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

    return(
        <AuthContext.Provider value={{
            signed: !!user, //!!Converte a variável para boolean,
            user,
            signIn,
            signUp,
            loadingAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;