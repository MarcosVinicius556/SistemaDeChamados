import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";


/* Antes de acessar uma rota, este componente será chamado,
   E se o usuário estiver logado ele liberará o acesso a rota
*/

export default function Private({ children }) { 
    const { signed, loading } = useContext(AuthContext);

    if(loading) //enquanto busca os dados do usuário mostra uma tela de carregamento
        return (
            <div>Carregando...</div>
        )

    if(!signed) //Caso não esteja logado, retorna para a sessão de login
        return <Navigate to="/" />
    return children;
}