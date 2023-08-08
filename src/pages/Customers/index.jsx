import { useState } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser } from 'react-icons/fi';

import './customers.css';

export default function Customers() {

    const[ nome, setNome ] = useState('');
    const[ cnpj, setCnpj ] = useState('');
    const[ endereco, setEndereco ] = useState('');

    function handleRegister(e) {
        e.preventDefault();
    }

    return(
        <div>
          <Header />  
          <div className="content">
            <Title name="Clientes">
                <FiUser size={25} />
            </Title>
            <div className="container">
                <form className='form-profile' onSubmit={handleRegister}>
                    <label>Nome Fantasia</label>
                    <input 
                     type="text" 
                     placeholder='Nome da Empresa'
                     onChange={(e) => setNome(e.target.value)}
                     />
                     <label>CNPJ</label>
                    <input 
                     type="number" 
                     placeholder='CNPJ da empresa'
                     onChange={(e) => setCnpj(e.target.value)}
                     />
                     <label>Endereço</label>
                    <input 
                     type="text" 
                     placeholder='Endereço da Empresa'
                     onChange={(e) => setEndereco(e.target.value)}
                     />

                     <button type='submit'>
                        Salvar
                     </button>
                </form>
            </div>
          </div>
        </div>
    )
}