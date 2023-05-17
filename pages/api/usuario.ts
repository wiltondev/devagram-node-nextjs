import { NextApiRequest, NextApiResponse} from "next";
import{RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'
import { validarTokenJwt } from "../../middlewares/validarTokenJwt";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";

const usuarioEndpoint = async (req : NextApiRequest, res :             NextApiResponse<RespostaPadraoMsg | any >)=>{
    // dados do usuario logado 
    //id do usuario
    try{
        const{userId}= req?.query;
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha=null;
        return res.status(200).json(usuario);

    }catch(e){
        console.log(e)
        return res.status(400).json({erro: 'Não foi possível obter informações do usuario'})
    }
   
}

export default validarTokenJwt(conectarMongoDB(usuarioEndpoint));