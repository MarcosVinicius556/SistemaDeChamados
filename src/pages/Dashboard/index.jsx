import Header from "../../components/Header";
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";

import { AuthContext } from "../../contexts/auth";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/firebaseConnection";
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";

import './dashboard.css';

const listRef = collection(db, "chamados");

function Dashboard() {
    const {logout} = useContext(AuthContext);

    const[ chamados, setChamados ] = useState([]);
    const[ loading, setLoading ] = useState(true);
    const[ isEmpty, setIsEmpty ] = useState(false);

    useEffect(() => {
        async function loadChamados(){
            const q = query(
                listRef, //Passando a referência da coleção no banco
                orderBy('created', 'desc'), //Definindo como será ordenado o retorno
                limit(5) //Definindo um limite para a requisição
            );

            const querySnapshot = await getDocs(q);
            await updateState(querySnapshot);
            setLoading(false);
        }
        loadChamados();

        return () => { //Quando desmontar o componente

        }
    }, []);

    async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    status: doc.data().status,
                    complemento: doc.data().complemento,
                });
            });

            //Mantem o que já havia na lista, e adiciona o que retornou do banco
            setChamados(chamados => [...chamados, ...lista]);
        } else {
            setIsEmpty(true);
        }
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
                        {
                            chamados.length === 0 ? (
                                <div className="container dashboard">
                                    <span>Nenhum chamado encontrado</span>
                                    <Link to='/new' className="new">
                                        <FiPlus color="#fff" size={25} />
                                        Novo Chamado
                                    </Link>
                                </div>
                            ) : (
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
                                                <td data-label="Assunto">Suporte</td>
                                                <td data-label="Status">
                                                    <span className="badge" style={{ background: '#999' }}>
                                                        Em Aberto
                                                    </span>
                                                </td>
                                                <td data-label="Cadastrado">12/05/2023</td>
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
                            )
                        }
                        
                </>
            </div>
        </div>
    );
}

export default Dashboard;