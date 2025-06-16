# TODO List for Esfiharia Jamal Site Integration

## Phase 1: Análise dos documentos e estrutura do projeto
- [x] Extrair o projeto zip.
- [x] Extrair o conteúdo do DOCX de análise.
- [x] Ler o conteúdo do DOCX de análise para identificar funcionalidades existentes e faltantes.
- [x] Explorar a estrutura do projeto (frontend e backend).
- [x] Ler package.json e requirements.txt.
- [x] Instalar dependências do backend.
- [x] Ler arquivos chave do backend (main.py, routes/pedido.py).
- [x] Ler arquivos chave do frontend (App.tsx, main.tsx).

## Phase 2: Implementação do sistema e funcionalidades
- [x] Implementar a lógica do carrinho de compras no frontend (adicionar/remover itens, calcular total).
- [x] Conectar o frontend do carrinho com a rota de criação de pedidos no backend.
- [x] Implementar a funcionalidade do menu mobile no frontend.
- [x] Implementar o envio real dos formulários de contato e newsletter no frontend.
- [ ] Criar ou ajustar as rotas do backend para receber dados dos formulários de contato e newsletter.
- [x] Substituir links placeholder (#) por URLs reais (WhatsApp, telefone, iFood).
- [x] Adicionar conteúdo para a seção "Sobre Nós".
- [ ] Adicionar seções placeholder para "Avaliações ou depoimentos" e "FAQs".
- [ ] Configurar variáveis de ambiente para o backend (SECRET_KEY, JWT_SECRET_KEY, STRIPE_WEBHOOK_SECRET).
- [ ] Implementar a integração com Stripe no frontend (se necessário, a rota de criação de Payment Intent já existe no backend).

## Phase 3: Testes e validação
- [x] Testar a funcionalidade completa do carrinho de compras (adicionar, remover, finalizar pedido).
- [ ] Testar o envio dos formulários.
- [x] Testar o menu mobile em diferentes tamanhos de tela.
- [x] Verificar se os links de pedido estão funcionando corretamente.
- [ ] Testar a integração com Stripe (se implementada no frontend).
- [x] Realizar testes gerais de navegação e responsividade do site.

## Phase 4: Deploy e entrega
- [ ] Preparar o projeto para deploy (build do frontend, configuração do backend).
- [ ] Realizar o deploy do backend.
- [ ] Realizar o deploy do frontend.
- [ ] Fornecer as URLs de acesso ao usuário.


