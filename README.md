# Tutorial para Teste da Aplicação SchoolManagerFront:

# 1. Inicialização do Projeto
# Faça o download dos projetos backend e frontend. Coloque ambos para rodar localmente. Ao iniciar a aplicação, você será direcionado à tela de login.

# OBS: Como o banco de dados é em memória, é necessário realizar o cadastro de um usuário antes de qualquer ação.

# 2. Cadastro de Usuário
# Na tela de registro, utilize um e-mail válido e uma senha que atenda aos critérios abaixo:

    Nome: TESTE (ou qualquer nome)
    E-mail válido: Ex: teste@gmail.com
    Senha: Deve conter no mínimo 8 caracteres, incluindo:
        1 letra maiúscula
        1 número
        1 caractere especial
        Exemplo: Root@123
    Confirmar Senha: Igual à senha informada

# 3. Autorização de Acesso
# Após o cadastro, é necessário atribuir autorizações ao usuário. Você pode fazer isso de duas formas:

    Antes de logar: cadastrando pelo endpoint ou tela de autorizações
    Depois de logar: acessando a tela "Autorizações" no menu lateral

# OBS: As funcionalidades da aplicação dependem das autorizações cadastradas. Caso não haja permissões, o backend irá bloquear as operações. Para testes, recomenda-se adicionar todas as autorizações disponíveis.

# 4. Login
# Utilize as credenciais cadastradas:

    E-mail: teste@gmail.com
    Senha: Root@123

# 5. Cadastro de Escolas
# Ao logar, o sistema redireciona para a listagem de alunos. Entretanto, recomenda-se iniciar pela tela de Escolas, pois é necessário cadastrar ao menos uma escola antes de criar alunos.

# Funcionalidades disponíveis:

    Adicionar escola
    Editar escola
    Excluir escola
    Visualizar detalhes da escola
    Buscar escolas por nome e lista geral das mesmas

# 6. Cadastro de Alunos
# Após cadastrar as escolas, acesse a tela de Alunos.

# Funcionalidades disponíveis:

    Adicionar aluno
    Editar aluno
    Excluir aluno
    Visualizar detalhes do aluno
    Buscar alunos por nome ou CPF e lista geral dos mesmos

# Utilize um CPF válido para testes seja cpf real ou criado no gerador de CPFs. Exemplos que pode ser utilizados:

    53119739006
    09166575079
    92515713092

# OBS: O preenchimento do endereço é automático ao informar um CEP válido, via consulta à API de CEP.

# 7. Autorizações
# Se não tiver feito anteriormente, utilize a tela de Autorizações para adicionar permissões de acesso aos usuários.

# 8. Logout
# Utilize o botão de Logout (ícone no topo da tela) para encerrar a sessão e retornar à tela de login.
