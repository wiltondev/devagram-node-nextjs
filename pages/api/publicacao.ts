import type { NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'; // Corrigi o nome do serviço de upload
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { UsuarioModel } from '../../models/UsuarioModel';
import { politicaCORS } from '../../middlewares/politicaCORS';
import multer from 'multer';
import fileType from 'file-type';
import mime from 'mime-types';


const handler = nc()
    .use(upload.single('file')) // Corrigi o nome da função de upload
    .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
        try {
            const { userId } = req.query;
            const usuario = await UsuarioModel.findById(userId);
            if (!usuario) {
                return res.status(400).json({ erro: 'Usuario nao encontrado' });
            }

            if (!req.body) { // Removi a verificação desnecessária
                return res.status(400).json({ erro: 'Parametros de entrada nao informados' });
            }

            const { descricao } = req.body;

            if (!descricao || descricao.length < 2) {
                return res.status(400).json({ erro: 'Descricao nao e valida' });
            }

            const { file } = req;

            const mimeType = mime.lookup(file.originalname);

            if (!mimeType || !['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'].includes(mimeType)) {
                return res.status(400).json({ erro: 'Apenas imagens são permitidas (jpg, png, gif).' });
            }



            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario: usuario._id,
                descricao,
                foto: image.media.url,
                data: new Date(),
                comentarios: [],
                likes: [],
            };

            usuario.publicacoes++;
            await UsuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario);

            await PublicacaoModel.create(publicacao);
            return res.status(200).json({ msg: 'Publicacao criada com sucesso' });
        } catch (e) {
            console.error(e);
            return res.status(400).json({ erro: 'Erro ao cadastrar publicacao' });
        }
    })

    .put(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
        try {
            const { publicacaoId } = req.query;
            const { descricao, file } = req.body;

            // Adicione validação para a descrição ou URL da imagem, se necessário.

            const updatedData: { descricao?: string; foto?: string } = {};
            if (descricao) updatedData.descricao = descricao;
            if (file) updatedData.foto = file;

            const publicacao = await PublicacaoModel.findByIdAndUpdate(publicacaoId, updatedData, { new: true });
            if (!publicacao) {
                return res.status(404).json({ erro: 'Publicação não encontrada' });
            }

            return res.status(200).json({ msg: 'Publicação atualizada com sucesso' });
        } catch (e) {
            console.error(e);
            return res.status(400).json({ erro: 'Erro ao atualizar publicação' });
        }
    })

    .delete(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
        try {
            const { publicacaoId } = req.query;

            // Execute a operação de exclusão
            const publicacao = await PublicacaoModel.findByIdAndDelete(publicacaoId);
            if (!publicacao) {
                return res.status(404).json({ erro: 'Publicação não encontrada' });
            }

            // Atualize a contagem de publicações do usuário, se necessário
            await UsuarioModel.findByIdAndUpdate(publicacao.idUsuario, { $inc: { publicacoes: -1 } });

            return res.status(200).json({ msg: 'Publicação deletada com sucesso' });
        } catch (e) {
            console.error(e);
            return res.status(400).json({ erro: 'Erro ao deletar publicação' });
        }
    });

export const config = {
    api: {
        bodyParser: false,
    },
};

export default politicaCORS(validarTokenJWT(conectarMongoDB(handler)));
