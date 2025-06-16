# Manual de Instruções - Esfiharia Jamal

## Visão Geral

Este sistema foi desenvolvido para a Esfiharia Jamal, oferecendo uma plataforma completa para gestão de esfihas, pedidos e clientes. O sistema possui duas interfaces principais:

1. **Interface do Cliente**: Permite aos clientes visualizar o cardápio, fazer pedidos e acompanhar o status.
2. **Interface do Administrador**: Permite gerenciar esfihas, preços e pedidos.

## Requisitos do Sistema

- Servidor com suporte a Python 3.11+
- MySQL Database
- Node.js 20+ (para desenvolvimento frontend)

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Backend (Flask)**: Localizado na pasta `/app`
- **Frontend (React)**: Localizado na pasta `/frontend`

## Instruções de Instalação

### Backend (Flask)

1. Navegue até a pasta do backend:
   ```
   cd /caminho/para/esfiharia_jamal/app
   ```

2. Ative o ambiente virtual:
   ```
   source venv/bin/activate
   ```

3. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```

4. Configure o banco de dados MySQL (já configurado por padrão com as seguintes credenciais):
   - Host: localhost
   - Porta: 3306
   - Usuário: root
   - Senha: password
   - Banco de dados: mydb

5. Inicie o servidor Flask:
   ```
   python -m src.main
   ```

### Frontend (React)

1. Navegue até a pasta do frontend:
   ```
   cd /caminho/para/esfiharia_jamal/frontend
   ```

2. Instale as dependências:
   ```
   pnpm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```
   pnpm run dev
   ```

## Guia de Uso

### Para Clientes

1. **Visualizar Cardápio**:
   - Acesse a página inicial para ver todas as esfihas disponíveis
   - Use os filtros de categoria para encontrar esfihas específicas

2. **Fazer um Pedido**:
   - Adicione esfihas ao carrinho
   - Ajuste quantidades conforme necessário
   - Adicione observações específicas para cada item
   - Clique em "Carrinho" para finalizar o pedido
   - Preencha seus dados pessoais e escolha a forma de entrega
   - Selecione o método de pagamento
   - Confirme o pedido

3. **Acompanhar Pedido**:
   - Use seu número de telefone para consultar o status do pedido
   - Verifique atualizações de status em tempo real

### Para Administradores

1. **Acessar Área Administrativa**:
   - Clique no botão "Área Admin" no canto superior direito

2. **Gerenciar Esfihas**:
   - Adicione novas esfihas com nome, descrição, preço e categoria
   - Edite informações de esfihas existentes
   - Atualize preços rapidamente (basta alterar o valor e clicar fora do campo)
   - Marque esfihas como disponíveis ou indisponíveis

3. **Gerenciar Pedidos**:
   - Visualize todos os pedidos recebidos
   - Filtre pedidos por status
   - Atualize o status dos pedidos (pendente, aprovado, em preparação, etc.)
   - Veja detalhes completos de cada pedido

## Fluxo de Status de Pedidos

Os pedidos seguem o seguinte fluxo de status:

1. **Pendente**: Pedido recebido, aguardando aprovação
2. **Aprovado**: Pedido confirmado pela esfiharia
3. **Em Preparação**: Esfihas sendo preparadas
4. **A Caminho**: Pedido saiu para entrega (se for entrega)
5. **Pronto para Retirada**: Pedido pronto para ser retirado pelo cliente (se for retirada)
6. **Entregue**: Pedido finalizado com sucesso
7. **Recusado**: Pedido não aceito pela esfiharia
8. **Cancelado**: Pedido cancelado pelo cliente (só é possível nos status Pendente e Aprovado)

## Edição de Preços

A edição de preços foi desenvolvida para ser extremamente simples:

1. Na área administrativa, acesse "Gestão de Esfihas"
2. Localize a esfiha cujo preço deseja alterar
3. Clique no campo de preço, digite o novo valor e clique fora do campo
4. O preço será atualizado automaticamente, sem necessidade de confirmação adicional

## Suporte e Contato

Para suporte técnico ou dúvidas sobre o sistema, entre em contato:

- Email: suporte@esfihariajamal.com.br
- Telefone: (XX) XXXX-XXXX

---

© 2025 Esfiharia Jamal - Todos os direitos reservados
