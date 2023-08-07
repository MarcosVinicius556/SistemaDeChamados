import { useContext, useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";

import { FiSettings, FiUpload } from "react-icons/fi";
import avatar from '../../assets/avatar.png';
import { AuthContext } from "../../contexts/auth";
import './profile.css';

export default function Profile() {

    const{ user, storageUser, setUser, logout } = useContext(AuthContext);
    const[ avatarUrl, setAvatarUrl ] = useState(user && user.avatarUrl); //Se tiver imagem vai colocar, se não coloca null
    const[ imageAvatar, setImageAvatar ] = useState(null);
    const[ nome, setNome ] = useState( user && user.nome );
    const[ email, setEmail ] = useState( user && user.email );
    
    function handleFile(e) {
        //Verificar se foi selecionado alguma imagem
        if(e.target.files[0]){ 
            const image = e.target.files[0];
            //Somente será aceitos arquivos do tipo JPG e PNG
            if(image.type === 'image/jpeg' || image.type === 'image/png') {
                //Carregando a imagem selecionada para dentro de um state
                setImageAvatar(image); 
                //Gerando uma url a partir da imagem selecionada para poder exibir na tela
                setAvatarUrl(URL.createObjectURL(image));
            } else {
                alert('Envie uma imagem do tipo PNG ou JPG');
                setImageAvatar(null);
                return;
            }
        }
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Minha conta">
                    <FiSettings size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile">
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#fff" size={25} />
                            </span>

                            <input type="file" accept="image/*" onChange={handleFile}/> <br />
                            {avatarUrl === null 
                            ?(
                                <img src={ avatar } alt="foto de perfil" width={250} height={250}/>
                            ) : (
                                <img src={ avatarUrl } alt="foto de perfil" width={250} height={250}/>
                            )
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} placeholder="Seu nome" onChange={() => setNome(e.target.value)}/>

                        <label>Email</label>
                        <input type="email" value={email} placeholder="email@email.com" />

                        <input type="submit" placeholder="Salvar" />
                    </form>
                </div>            
                <div className="container">
                    <button className="logout-btn" onClick={() => logout() }>Sair</button>
                </div>
            </div>
        </div>
    );
}