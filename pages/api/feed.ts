import { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJwt } from "../../middlewares/validarTokenJwt";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { SeguidorModel } from "../../models/seguidorModel";
import { politicaCORS } from "../../middlewares/politicaCORS";


const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
        if (req.method === 'GET') {
            //receber informação do id do usuario 
            //que eu quero buscar o feed
            //informação vem do query
            if (req?.query?.id) {
                //agora que tenho id do usuario
                //validar validade do usuario no banco
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if (!usuario) {
                    res.status(400).json({ erro: 'usuario não encontrado!' })

                }
                //buscar na tabela de publicações 
                //todas as publicações com id do usuario

                const publicacoes = await PublicacaoModel
                    .find({ idUsuario: usuario._id })
                    .sort({ data: -1 });

                return res.status(400).json(publicacoes);
            }else{

                const {userId}= req.query;
                const usuarioLogado= await UsuarioModel.findById(userId);
                if(!usuarioLogado){
                    return res.status(400).json({erro: 'Usuario não encontrado'});
                };

                const seguidores = await SeguidorModel.find({usuarioId : usuarioLogado._id});
                const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId);

                const publicacoes = await PublicacaoModel.find({
                    $or : [
                        {idUsuario : usuarioLogado._id},
                        {idUsuario : seguidoresIds}
                    ]
                })
                .sort({data : -1});

                const result =[];
                for(const publicacao of publicacoes) {
                    const usuarioDaPublicacao = await UsuarioModel.findById(publicacao.idUsuario);
                    if(usuarioDaPublicacao){
                        const final = {...publicacao._doc, usuario: {
                            nome: usuarioDaPublicacao.nome,
                            avatar: usuarioDaPublicacao.avatar
                        }} 
                        result.push(final);
                    }
                }

                
                return res.status(200).json(result);

            }
        }
        res.status(405).json({ erro: 'Método informado invalido' })

    } catch (e){
        console.log(e);
}
res.status(400).json({ erro: 'Não foi possível obter o feed!' })
}
export default politicaCORS (validarTokenJwt(conectarMongoDB(feedEndpoint)));

function sort(arg0: { data: number; }) {
    throw new Error("Function not implemented.");
}

