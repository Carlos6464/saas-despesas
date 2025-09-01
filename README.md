# Plano de Projeto: SaaS de Controle de Despesas Pessoais v3.2

**Data da Última Revisão:** 1 de Setembro de 2025
**Status:** Visão Estratégica Aprovada

## Sumário Executivo

Este documento detalha o plano de desenvolvimento para um software como serviço (SaaS) de controle de despesas pessoais. A solução visa atender a uma lacuna no mercado brasileiro para usuários que buscam simplicidade e facilidade de uso.

O sistema será composto por duas áreas principais:
1.  **Área do Cliente:** Focada no registro intuitivo de despesas.
2.  **Área Administrativa:** Para a gestão completa da plataforma, clientes e pagamentos.

O modelo de negócio será de assinatura mensal, validado desde o MVP com um período de teste de 14 dias. A visão de longo prazo inclui um **plano premium com um Agente de IA**, que permitirá o registro de despesas via WhatsApp.

- **Stack Tecnológica:** FastAPI (Python), Angular, PrimeNG/TailwindCSS, PostgreSQL, Docker.
- **Infraestrutura:** Vercel (Frontend) e Render (Backend/DB).
- **Tecnologias Futuras:** WhatsApp Business API, Modelos de NLP/LLM (ex: OpenAI API, Gemini API).

---

## 1. Estratégia e Filosofia de Desenvolvimento

- **MVP Comercial:** O foco do Mínimo Produto Viável é validar o produto e o modelo de negócio simultaneamente.
- **Controle de Acesso Baseado em Função (RBAC):** A arquitetura será construída sobre uma clara separação entre as funções de "Cliente" e "Administrador".
- **Desenvolvimento Ágil e Segurança por Padrão:** Ciclos curtos de desenvolvimento e segurança como pilar inegociável do projeto.

---

## 2. Arquitetura da Solução (Modelo C4)

A arquitetura é documentada em três níveis de abstração para garantir clareza.

### Nível 1: Diagrama de Contexto do Sistema

*Visão macro do sistema, seus usuários e as interações com sistemas externos.*

```mermaid
C4Context
  title Diagrama de Contexto v3 - SaaS com Agente IA

  Person(cliente, "Cliente", "Pessoa que paga para controlar suas despesas pessoais.")
  Person(admin, "Administrador", "Funcionário que gerencia a plataforma.")

  System_Boundary(b1, "SaaS de Despesas") {
    System(meu_saas, "Plataforma de Despesas", "Nosso sistema SaaS com áreas distintas para clientes e administradores, e um motor de IA.")
  }

  System_Ext(stripe, "Stripe", "API para processamento de pagamentos.")
  System_Ext(email_service, "Serviço de E-mail", "Serviço para envio de e-mails transacionais.")
  System_Ext(whatsapp, "WhatsApp", "Plataforma de mensagens usada para registro rápido de despesas.")

  %% Relações do Cliente
  Rel(cliente, meu_saas, "Usa para configurar a conta e ver relatórios", "HTTPS")
  Rel_Back(cliente, stripe, "Fornece dados de pagamento durante o checkout", "HTTPS")
  Rel(cliente, whatsapp, "Envia mensagens com despesas", "WhatsApp")
  
  %% Relações do Administrador
  Rel(admin, meu_saas, "Gerencia a plataforma", "HTTPS")

  %% Relações do Sistema
  Rel(meu_saas, email_service, "Envia e-mails transacionais", "API/HTTPS")
  Rel(meu_saas, stripe, "Processa pagamentos", "API/HTTPS")
  Rel_Back(meu_saas, whatsapp, "Recebe mensagens via Webhook", "API/HTTPS")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

### Nível 2: Diagrama de Contêineres

*Zoom no sistema, mostrando seus principais blocos de construção (Frontend, Backend, DB).*

```mermaid
C4Container
  title Diagrama de Contêineres v3 - SaaS com Agente IA
  
  Person(usuario, "Usuário (Cliente/Admin)", "Pessoa que interage com o sistema.")

  System_Ext(stripe, "Stripe", "Processador de pagamentos.")
  System_Ext(email_service, "Serviço de E-mail", "Serviço para envio de e-mails transacionais.")
  System_Ext(whatsapp, "WhatsApp", "Plataforma de mensagens.")

  System_Boundary(c1, "Nossa Aplicação SaaS") {
    Container(frontend, "Aplicação Web (Frontend)", "Angular, PrimeNG", "A interface do usuário para gestão da conta e visualização.")
    Container(backend, "API (Backend)", "FastAPI (Python)", "Lida com a lógica de negócio, RBAC e agora também com o processamento de mensagens de IA.")
    ContainerDb(db, "Banco de Dados", "PostgreSQL", "Armazena todos os dados, incluindo a associação de contas com números de WhatsApp.")
  }

  %% Fluxos
  Rel(usuario, frontend, "Acessa e interage com a aplicação", "HTTPS")
  Rel(frontend, backend, "Faz chamadas de API", "JSON/HTTPS")
  Rel(backend, db, "Lê e Escreve", "TCP/IP")
  Rel(backend, email_service, "Envia e-mails")
  Rel(backend, stripe, "Gerencia assinaturas")
  
  %% Fluxo do Agente IA
  Rel(usuario, whatsapp, "Envia mensagem com a despesa")
  Rel(whatsapp, backend, "Notifica sobre nova mensagem (Webhook)", "JSON/HTTPS")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

### Nível 3: Diagrama de Componentes do Backend

*Detalha a estrutura interna da API Backend e seus principais módulos.*

```mermaid
C4Component
  title Diagrama de Componentes v3 - API Backend com Agente IA

  %% Sistemas Externos
  Container(frontend, "Frontend")
  System_Ext(stripe, "Stripe")
  System_Ext(email_service, "Serviço de E-mail")
  ContainerDb(db, "Banco de Dados")
  System_Ext(whatsapp, "WhatsApp")
  System_Ext(llm_service, "Serviço de IA (LLM)", "Ex: OpenAI, Gemini", "Processa texto e extrai dados estruturados.")


  Container_Boundary(c1, "API (Backend)") {
    Component(routers, "API Routers")
    Component(auth_component, "Componente de Autenticação")
    Component(expense_service, "Serviço de Despesas")
    Component(subscription_service, "Serviço de Assinaturas")
    Component(admin_service, "Serviço de Admin")
    Component(orm, "Camada de Acesso a Dados (ORM)")
    Component(stripe_gateway, "Gateway do Stripe")
    Component(email_gateway, "Gateway de E-mail")

    %% Novos Componentes para o Agente IA
    Component(ai_ingestion_service, "Serviço de Ingestão IA", "Python", "Recebe webhooks do WhatsApp, chama o serviço de IA e salva a despesa.")
    Component(llm_gateway, "Gateway do LLM", "Python / SDK", "Encapsula a comunicação com o modelo de linguagem (ex: OpenAI).")
  }

  %% Relacionamentos
  %% Fluxo de entrada
  Rel(frontend, routers, "Faz chamadas de API")
  Rel(routers, auth_component, "Verifica autenticação")

  %% Direcionamento dos Routers para os Serviços
  Rel(routers, expense_service, "Direciona requisições de despesas")
  Rel(routers, subscription_service, "Direciona requisições de assinaturas")
  Rel(routers, admin_service, "Direciona requisições de admin")

  %% Interação dos Serviços
  Rel(expense_service, orm, "Usa para persistir dados")
  Rel(admin_service, orm, "Usa para ler dados")
  Rel(subscription_service, orm, "Usa para atualizar assinaturas")
  Rel(auth_component, orm, "Usa para verificar usuários")
  Rel(orm, db, "Lê e Escreve")

  %% Comunicação com Gateways Externos
  Rel(subscription_service, stripe_gateway, "Usa para interagir com o Stripe")
  Rel(stripe_gateway, stripe, "Faz chamadas à API do Stripe", "API/HTTPS")
  Rel(admin_service, email_gateway, "Usa para enviar e-mails")
  Rel(email_gateway, email_service, "Faz chamadas à API de E-mail", "API/HTTPS")
  
  %% Fluxo do Webhook do WhatsApp
  Rel(whatsapp, routers, "Envia Webhook de Mensagem")
  Rel(routers, ai_ingestion_service, "Direciona o webhook")
  Rel(ai_ingestion_service, llm_gateway, "Pede para processar o texto")
  Rel(llm_gateway, llm_service, "Chama API do modelo de IA")
  Rel(ai_ingestion_service, expense_service, "Usa para salvar a despesa processada")
```

---

## 3. Modelo de Dados (Visão Geral)

A persistência dos dados será feita em um banco de dados relacional (PostgreSQL). As principais entidades do sistema são:

-   **Usuário (User):** Armazena informações de login, perfil, **função (role)** (Cliente/Admin), status da assinatura e o número de WhatsApp associado (para o plano IA).
-   **Despesa (Expense):** Contém os detalhes de cada transação (valor, descrição, data). Associada a um usuário e a uma categoria.
-   **Categoria (Category):** Define as categorias de gastos. Se a associação com o usuário for nula (`user_id = NULL`), a categoria é considerada **Global** e disponível para todos. Caso contrário, é uma categoria pessoal.

*Nota: O schema detalhado do banco de dados será mantido em um documento técnico separado.*

---

## 4. Roadmap de Desenvolvimento

### Fase 0: Fundação (Duração: ~1 Semana)
-   **Objetivo:** Preparar todo o ambiente de desenvolvimento e infraestrutura.
-   **Tarefas:** Criar repositório Git; Iniciar projetos Angular e FastAPI; Configurar Docker e CI/CD básico; Criar contas nos serviços de nuvem.

### Fase 1: MVP - Lançamento Comercial (Duração: 3-4 Meses)
-   **Objetivo:** Lançar a primeira versão pública, funcional e capaz de gerar receita.
-   **Módulo do Cliente:**
    -   [ ] Autenticação (Cadastro, Login, Logout).
    -   [ ] CRUD de categorias pessoais.
    -   [ ] CRUD de despesas.
    -   [ ] Dashboard com total de gastos do mês.
-   **Módulo de Assinaturas:**
    -   [ ] Integração completa com Stripe (Checkout e Webhooks).
    -   [ ] Lógica de trial de 14 dias.
    -   [ ] Acesso ao Portal do Cliente Stripe para autogestão.
-   **Módulo do Administrador:**
    -   [ ] Autenticação segura baseada em `role`.
    -   [ ] Dashboard com métricas chave.
    -   [ ] Visualização de lista de clientes e status.
    -   [ ] CRUD de categorias globais.

### Fase 2: Primeiras Melhorias (Pós-Lançamento) (Duração: ~2 Meses)
-   **Objetivo:** Adicionar funcionalidades de alto valor com base no feedback inicial.
-   **Tarefas:** Melhorias no Dashboard do Cliente (gráficos); Cadastro de Despesas Recorrentes; Filtros e Busca de despesas; Fluxo de Recuperação de Senha; Melhorias no Painel Admin.

### Fase 3: Amadurecimento do Produto (Duração: ~3 Meses)
-   **Objetivo:** Aumentar a retenção de usuários com funcionalidades avançadas.
-   **Tarefas:** Metas de Orçamento; Relatórios (PDF/CSV); Múltiplas "Carteiras"; Tema Escuro (Dark Mode).

### Fase 4: Inovação com IA (Segundo Ciclo de Desenvolvimento)
-   **Objetivo:** Introduzir um diferencial competitivo único e justificar um novo plano de assinatura de maior valor.
-   **Modelo de Negócio:**
    -   [ ] Criar um novo plano de assinatura ("Plano IA") com preço superior.
    -   [ ] Atualizar a UI para refletir os diferentes planos.
-   **Checklist de Features:**
    -   [ ] Implementar fluxo de configuração e validação do número de WhatsApp do cliente.
    -   [ ] Desenvolver o serviço de backend para receber webhooks do WhatsApp.
    -   [ ] Integrar com um serviço de LLM para processar o texto das mensagens.
    -   [ ] Implementar a lógica para salvar a despesa extraída na conta do usuário correto.
    -   [ ] Implementar mensagens de confirmação de volta para o usuário via WhatsApp.
