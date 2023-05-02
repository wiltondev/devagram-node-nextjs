import { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJwt } from "../middlewares/validarTokeJwt";

const usuarioEndPoint = ( req: NextApiRequest, res : NextApiResponse)=>{
    return res.status(200).json('Usuario autenticado com sucesso')
};
 export default validarTokenJwt(usuarioEndPoint)
