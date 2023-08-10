import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import './new.css';
import { toast } from 'react-toastify';

//Gera a referência da coleção a ser acessada
const listRef = collection(db, 'customers');

export default function New() {
    const { user } = useContext(AuthContext);

    const[ customers, setCustomers ] = useState([]);
    const[loadCustomer, setLoadCustomer] = useState(true);
    const[ customerSelected, setCustomerSelected ] = useState(0);

    const[ complemento, setComplemento ] = useState('');
    const[ assunto, setAssunto ] = useState('Suporte');
    const[ status, setStatus ] = useState('Aberto');

    useEffect(() => {
        async function loadCustomers(){
            //Buscando todos os dados da coleção referênciada
            const querySnap = await getDocs(listRef)
            .then((snapshot) => {  //Em caso de sucesso, pega o retorno e cria a lista de clientes
                let lista = [];
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    });
                });
                if(snapshot.docs.size === 0){
                    toast.error('Nenhuma empresa encontrada')
                    setCustomers([ { id: '1', nomeFantasia: 'freela'} ]);
                    setLoadCustomer(false);
                    return;
                }

                setCustomers(lista);
                setLoadCustomer(false);
            }).catch((error) => { //Caso falhe, cria um cliente fictício 
                console.log(error);
                toast.error("Erro ao buscar clientes, " + error);
                setLoadCustomer(false);
                setCustomers([ { id: '1', nomeFantasia: 'freela'} ]);
            })
        }
        loadCustomers();
    }, []);

    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value);
    }

    function handleChangeCustomer(e) {
        setCustomerSelected(e.target.value);
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Novo Chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile">
                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type="text" disabled={true} value="Carregando..." />
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {
                                        customers.map((item, index) => {
                                            return(
                                                <option key={index} value={index}>
                                                    {item.nomeFantasia}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita Tecnica'>Visita Técnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input 
                                type="radio"
                                name="radio" 
                                value="Aberto" 
                                onChange={handleOptionChange}
                                checked={ status === "Aberto" }
                            />
                            <span>Em aberto</span>

                            <input 
                                type="radio" 
                                name="radio" 
                                value="Progresso" 
                                onChange={handleOptionChange}
                                checked={ status === "Progresso" }
                            />
                            <span>Progresso</span>

                            <input 
                                type="radio" 
                                name="radio" 
                                value="Atendido" 
                                onChange={handleOptionChange}
                                checked={ status === "Atendido" }
                            />
                            <span>Atendido</span>
                        </div>

                        <label> Complemento </label>
                        <textarea 
                            type="text"
                            placeholder="Descreva sem problema (Opcional)"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />

                        <button type='submit'> Registrar </button>
                    </form>
                </div>
            </div>
        </div>
    )
}