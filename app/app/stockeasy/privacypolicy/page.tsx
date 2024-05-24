import { Divider } from '@nextui-org/react';
import Markdown from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm'

const Page = () => {

    return (
        <div >
            <div className="max-w-3xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-4">Política de Privacidade do StockEasy</h1>
                <p className="mb-6">Bem-vindo ao StockEasy! A sua privacidade é importante para nós. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais ao usar nosso aplicativo. Ao utilizar o StockEasy, você concorda com as práticas descritas nesta política.</p>
                <h2 className="text-xl font-bold mb-2">1. Informações Coletadas</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">1.1 Informações Pessoais</h3>
                    <p>Coletamos as seguintes informações pessoais dos varejistas e seus colaboradores:</p>
                    <ul className="list-disc pl-6">
                        <li>Nome</li>
                        <li>Email</li>
                        <li>Endereço IP</li>
                    </ul>
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">1.2 Dados de Uso</h3>
                    <p>Podemos coletar dados de uso somente dentro do aplicativo para melhorar sua experiência e a funcionalidade do StockEasy. Esses dados de uso incluem:</p>
                    <ul className="list-disc pl-6">
                        <li>Ações realizadas dentro do aplicativo</li>
                        <li>Tempo de uso do aplicativo</li>
                        <li>Frequência de acesso</li>
                    </ul>
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">1.3 Uso da Câmera</h3>
                    <p>O aplicativo pode solicitar acesso à câmera do dispositivo para as seguintes finalidades:</p>
                    <ul className="list-disc pl-6">
                        <li>Consulta de produtos</li>
                        <li>Vinculação de novas fotos aos produtos</li>
                    </ul>
                </div>
                <h2 className="text-xl font-bold mb-2">2. Uso das Informações Coletadas</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">2.1 Criação de Perfil</h3>
                    <p>As informações pessoais coletadas são utilizadas exclusivamente para a criação e manutenção do perfil do colaborador dentro do aplicativo.</p>
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">2.2 Vinculação de Sessão</h3>
                    <p>O endereço IP é utilizado para vincular a sessão ativa no momento em que o usuário acessa o aplicativo.</p>
                </div>
                <h2 className="text-xl font-bold mb-2">3. Exclusão de Dados</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">3.1 Exclusão de Dados pelo Varejista</h3>
                    <p>Os dados dos colaboradores podem ser excluídos a qualquer momento pelos varejistas através das ferramentas fornecidas no aplicativo. Ao solicitar a exclusão dos dados, todos os dados pessoais do colaborador serão removidos permanentemente dos nossos sistemas.</p>
                </div>
                <h2 className="text-xl font-bold mb-2">4. Segurança das Informações</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">4.1 Medidas de Segurança</h3>
                    <p>Adotamos medidas de segurança adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, lembramos que nenhum método de transmissão pela internet ou de armazenamento eletrônico é 100% seguro.</p>
                </div>
                <h2 className="text-xl font-bold mb-2">5. Não Coleta de Dados de Localização</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">5.1 Informações de Localização</h3>
                    <p>Não coletamos dados de localização dos usuários. O único dado relacionado à localização que utilizamos é o endereço IP, exclusivamente para fins de vinculação de sessão conforme descrito acima.</p>
                </div>
                <h2 className="text-xl font-bold mb-2">6. Alterações a esta Política de Privacidade</h2>
                <p>Podemos atualizar esta Política de Privacidade de tempos em tempos para refletir mudanças em nossas práticas ou em leis aplicáveis. Notificaremos os usuários sobre quaisquer alterações significativas por meio do aplicativo ou por outros meios apropriados.</p>
                <h2 className="text-xl font-bold mb-2">7. Contato</h2>
                <p>Se você tiver quaisquer perguntas ou preocupações sobre esta Política de Privacidade, entre em contato conosco através do email birdra1n@proton.me.</p>
                <Divider className='mt-10' />
                <p>Data da última atualização: 24/05/2024</p>
                <p>Esta Política de Privacidade foi elaborada para garantir que suas informações pessoais sejam tratadas com respeito e protegidas de acordo com as melhores práticas de segurança e privacidade. Agradecemos por confiar no StockEasy.</p>

            </div>
        </div>
    )
}

export default Page;