import { useContext, useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";

import { FiSettings, FiUpload } from "react-icons/fi";
import avatar from '../../assets/avatar.png';
import { AuthContext } from "../../contexts/auth";
import './profile.css';

import { db, storage } from '../../services/firebaseConnection';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, //Referencia da imagem
         uploadBytes, //Método para enviar a imagem
         getDownloadURL //URL para acesso da nova imagem
        } from "firebase/storage";

import { toast } from "react-toastify";

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

    async function handleUpload() {
        const currentUid = user.uid;

        //Referência e caminho onde a foto deverá ser salva
        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

        //Fazendo o envio da imagem para o firebase
        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot) => {
            //Recebe a url da foto salva na resposta da requisição
            getDownloadURL(snapshot.ref).then(async (downloadUrl) => { 
                let urlFoto = downloadUrl;

                const docRef = doc(db, 'users', user.uid);
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome: nome,
                }).then(() => {
                    //Monta o objeto com os dados atualizados
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto,
                    }
                    //Atualiza na aplicação
                    setUser(data);
                    //Atualiza no Storage
                    storageUser(data);

                    toast.success('atualizado com sucesso');
                }).catch(() => {
                    toast.error('Não foi possível atualizar');
                    console.log(error);
                });
            })
        }).catch((error) => {
            toast.failed('Não foi possível atualizar');
            console.log(error);
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        //Verificando se precisará atualizar a foto de perfil ou não
        if(imageAvatar === null && nome !== '') {
            //Criando referência do usuário no banco
            const docRef = doc(db, 'users', user.uid);
            //Atualizando o usuário no banco
            await updateDoc(docRef, {
                nome: nome,
            }).then(() => {
                //Monta o objeto com os dados atualizados
                let data = {
                    ...user,
                    nome: nome
                }
                //Atualiza na aplicação
                setUser(data);
                //Atualiza no Storage
                storageUser(data);

                toast.success('atualizado com sucesso');
            }).catch((error) => {
                toast.error('Não foi possível atualizar');
                console.log(error);
            })
        } else if(nome !== '' && imageAvatar !== null) {
            handleUpload();
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
                    <form className="form-profile" onSubmit={handleSubmit}>
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
                        <input type="text" value={nome} placeholder="Seu nome" onChange={(e) => setNome(e.target.value)}/>

                        <label>Email</label>
                        <input type="email" value={email} placeholder="email@email.com" disabled/>

                        <button type="submit"> Salvar </button>
                    </form>
                </div>            
                <div className="container">
                    <button className="logout-btn" onClick={() => logout() }>Sair</button>
                </div>
            </div>
        </div>
    );
}