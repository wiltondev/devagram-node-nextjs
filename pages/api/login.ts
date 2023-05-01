import  { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import{RespostaPadraMsg} from "../../types/RespostaPadraMsg"


const endpointLogin = (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraMsg>
) => {
    if(req.method ==='POST'){
        const { login, senha} = req.body;
        if(login ==='admin@admin.com' && 
            senha === 'Admin@123'){
               return res.status(200).json({msg: 'Usuario autenticado com sucesso'});
        }
        return res.status(405).json({erro: 'Usuario ou senha não encontrado'});
    }
    return res.status(405).json ({erro: 'Método informado não é valido'})

}
export default conectarMongoDB(endpointLogin);
