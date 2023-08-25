import { useContext } from 'react';
import avatarImg  from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
import './header.css'

function Header() {

    const{ user } = useContext(AuthContext);

    return(
        <div className='sidebar'>
           <div>
                <img 
                 src={ user.avatarUrl === null ? avatarImg : user.avatarUrl }
                 alt="foto do usuario" 
                 />
           </div>

           <Link to="/dashboard">
                <FiHome color='#fff' size={24} />
                <span>Chamados</span>
           </Link>
           <Link to="/customers">
                <FiUser color='#fff' size={24} />
                <span>Clientes</span>
           </Link>
           <Link to="/profile">
                <FiSettings color='#fff' size={24} />
                <span>Perfil</span>
           </Link>
           <span>
               <i>Desenvolvido por <br />
               Marcos Vinicius Angeli Costa</i>
           </span>
        </div>
    );
}

export default Header;