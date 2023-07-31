import { AuthContext } from "../../contexts/auth";
import { useContext } from "react";

function Dashboard() {
    const {logout} = useContext(AuthContext);

    async function handleLogout(){
        await logout();
    }

    return(
        <div>
            Dashboard
            <button onClick={() => handleLogout}>Sair da conta</button>
        </div>
    );
}

export default Dashboard;