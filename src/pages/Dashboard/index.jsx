import Header from "../../components/Header";
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";

import { AuthContext } from "../../contexts/auth";
import { useContext } from "react";
import { Link } from "react-router-dom";

import './dashboard.css';

function Dashboard() {
    const {logout} = useContext(AuthContext);

    async function handleLogout(){
        await logout();
    }

    return(
        <div>
            <Header />
            
            <div className="content">
                <Title name="Tickets">
                    <FiMessageSquare size={25} />
                </Title>
                {/* 
                  * '<></>' == Fragments, funciona como 
                  * uma div, mas sem estilização,
                  * servindo para agrupar componentes 
                  */}
                <>
                    <Link to='/new' className="new">
                        <FiPlus color="#fff" size={25} />
                        Novo Chamado
                    </Link>
                    <table>
                        <thead>
                            <tr>
                                <th scope="column">Cliente</th>
                                <th scope="column">Assunto</th>
                                <th scope="column">Status</th>
                                <th scope="column">Cadastrado em</th>
                                <th scope="column">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="Cliente">Mercado Esquina</td>
                                <td data-label="Cliente">Suporte</td>
                                <td data-label="Cliente">Em Aberto</td>
                                <td data-label="Cliente">12/05/2023</td>
                                <td data-label="#">
                                    <button className="action" style={{ background: '#3583f6' }}>
                                        <FiSearch color="#fff" size={17} />
                                    </button>
                                    <button className="action" style={{ background: '#f6a935' }}>
                                        <FiEdit2 color="#fff" size={17} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            </div>
        </div>
    );
}

export default Dashboard;