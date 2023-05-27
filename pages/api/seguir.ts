import { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { validarTokenJwt } from "../../middlewares/validarTokenJwt";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";

const endPointSeguir = ( req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>)=>{
    try {
        
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: 'Não foi possível seguir/desseguir o usuario informado'});
        
    }
}
export default validarTokenJwt(conectarMongoDB(endPointSeguir));



