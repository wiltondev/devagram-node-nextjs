import { NextApiRequest, NextApiResponse} from "next";
import { validarTokenJwt } from "../../middlewares/validarTokenJwt";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";

const usuarioEndpoint = (req : NextApiRequest, res : NextApiResponse)=>{

    return res.status(200).json('Usuario autenticado com sucesso')

}

export default validarTokenJwt(conectarMongoDB(usuarioEndpoint));