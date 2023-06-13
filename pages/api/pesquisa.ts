import { NextApiRequest, NextApiResponse} from "next";
import{RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJwt } from "../../middlewares/validarTokenJwt";
import { UsuarioModel } from "../../models/UsuarioModel";
import { politicaCORS } from "../../middlewares/politicaCORS";

const pesquisaEndPoint =

async (req: NextApiRequest, res : NextApiResponse<RespostaPadraoMsg| any[]>)=>{
    try {

        if(req.method ==='GET'){
            if(req?.query?.id){
                const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id)
                if(!usuarioEncontrado){
                    return res.status(400).json({erro: 'Usuario não encontrado '})
                }
                usuarioEncontrado.senha = null
                return res.status(200).json(usuarioEncontrado)

            }else{
                const {filtro}= req.query;
                if(!filtro || filtro.length < 2){
                    return res.status(400).json({erro: 'Favor informar pelo menos dois caracteres para a busca '})
                }
                const usuarioEncontrado  = await UsuarioModel.find({
                    $or:[{ nome:{$regex: filtro, $options:'i'}},
                        { email:{$regex: filtro, $options:'i'}},
                    ]
                          
                });
    
                return res.status(200).json(usuarioEncontrado)
    
            }



           

        }
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: 'Não foi possível buscar usuarios'})
        
    }

}

export default politicaCORS (validarTokenJwt(conectarMongoDB(pesquisaEndPoint)));
