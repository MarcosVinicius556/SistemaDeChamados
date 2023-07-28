import { useState, createContext, useEffect } from "react";

/**
 * Criando contexto para autenticação da aplicação
 */
export const AuthContext = createContext({});

/**
 * Provendo dados da autenticação para toda a aplicação
 */
function AuthProvider({ children }) {

    const[user, setUser] = useState(null);

    function signIn(email, password) {
        console.log(email + " " + password );
    }

    return(
        <AuthContext.Provider value={{
            signed: !!user, //!!Converte a variável para boolean,
            user,
            signIn
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;