# spring-mvc-template — Especificação Técnica

> Padrão de Biblioteca Compartilhada com Spring Boot  
> Versão 1.0 | Junho 2026

---

## Sumário

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [lib-messages](#2-lib-messages)
3. [Catálogo de Mensagens](#3-catálogo-de-mensagens)
4. [Padrão de Resposta](#4-padrão-de-resposta)
5. [service-api-core](#5-service-api-core)
6. [Como Adicionar um Novo Projeto Consumidor](#6-como-adicionar-um-novo-projeto-consumidor)
7. [Como Estender o Catálogo de Mensagens](#7-como-estender-o-catálogo-de-mensagens)

---

## 1. Visão Geral da Arquitetura

Este repositório adota o padrão de **biblioteca compartilhada** para centralizar toda a infraestrutura de respostas e exceções em um único módulo Maven reutilizável, permitindo que múltiplos projetos Spring Boot consumam o mesmo catálogo de mensagens sem duplicação de código.

### Estrutura de Projetos

```
spring-mvc-template/
├── service-api/              ← projeto original (mantido intacto)
├── lib-messages/             ← biblioteca Maven (jar)
│   └── src/main/java/spring/template/infra/
│       ├── business/         ← exceções e handler global
│       └── response/         ← envelope de resposta
└── service-api-core/         ← Spring Boot consumindo lib-messages
    └── src/main/java/spring/template/
        └── app/              ← Model, AppService, AppController
```

### Fluxo de Dependência

```
lib-messages  →  mvn install  →  ~/.m2  →  <dependency> em qualquer projeto
```

O `GlobalExceptionHandler` registrado na lib é detectado automaticamente pelo component scan do Spring Boot quando o pacote `spring.template.infra` está incluído no scan.

---

## 2. lib-messages

Biblioteca Maven pura (`packaging jar`) que contém toda a infraestrutura de mensagens, respostas padronizadas e tratamento de exceções de negócio.

### Coordenadas Maven

```xml
<groupId>com.izatec</groupId>
<artifactId>lib-messages</artifactId>
<version>1.0</version>
<packaging>jar</packaging>
```

### Dependências

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.4</version>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <optional>true</optional>
</dependency>
```

### Instalação

```bash
cd lib-messages
mvn install
```

---

### 2.1 Pacote `infra.business`

| Classe | Papel |
|---|---|
| `BusinessMessage` | Enum com catálogo completo de mensagens (E01 → E900) |
| `BusinessException` | Exceção base de negócio com `errorCode`, `httpStatus` e `suggestion` |
| `GlobalExceptionHandler` | `@RestControllerAdvice` — captura e formata todas as exceções |
| `RecordNotFoundExceptionException` | HTTP 404 — registro não encontrado |
| `NoResultsFoundException` | HTTP 204 — consulta sem resultados |
| `RequiredFieldException` | HTTP 409 — campo obrigatório não informado |

#### BusinessException — Construtores

```java
// A partir de um BusinessMessage
new BusinessException(BusinessMessage.E404, "Pedido", "ID", 99)

// Campo de validação customizado
new BusinessException("campo", "validacao", "sugestao")

// Mensagem livre
new BusinessException("Mensagem de erro")

// Código e sugestão customizados
new BusinessException("ERR-X", "sugestao", "mensagem %s", param)
```

---

### 2.2 Pacote `infra.response`

#### `ResponseStatus`

Objeto que carrega os metadados de todas as respostas:

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | `LocalDate` | Data da resposta (automático) |
| `hora` | `LocalTime` | Hora da resposta (automático) |
| `success` | `boolean` | `true` sucesso / `false` erro |
| `mensagem` | `String` | Descrição legível do resultado |
| `codigo` | `Serializable` | HTTP status code |
| `sugestao` | `String` | Orientação ao usuário em caso de erro |

#### `Response`

Envelope padrão retornado em todos os endpoints:

| Campo | Tipo | Descrição |
|---|---|---|
| `status` | `ResponseStatus` | Metadados da resposta |
| `data` | `Object` | Payload (objeto ou lista) |
| `page` | `ResponsePage` | Metadados de paginação (opcional) |

#### `ResponseFactory` — Métodos

| Método | HTTP | Uso |
|---|---|---|
| `ok(body)` | 200 | Consulta com resultado |
| `ok(body, message)` | 200 | Consulta com mensagem customizada |
| `create(body, message)` | 201 | Criação bem-sucedida |
| `noContent()` | 204 | Lista vazia |
| `okOrNotFound(value)` | 200 / 404 | Retorna ou lança `RecordNotFoundExceptionException` |
| `okOrNoContent(collection)` | 200 / 204 | Retorna ou responde lista vazia |
| `error(code, msg, suggestion)` | — | Resposta de erro genérico |
| `exception(be)` | — | Erro a partir de `BusinessException` |

---

## 3. Catálogo de Mensagens

Centralizado no enum `BusinessMessage` em `lib-messages`. Mensagens com `%s` são parametrizáveis em tempo de execução.

| Código | Mensagem | Sugestão | HTTP |
|---|---|---|---|
| E404 | Não existe um registro de %s com o %s: %s informado | O registro deve existir previamente | 404 |
| E204 | Consulta sem registros | Realize uma operação de cadastro | 204 |
| E501 | Erro ao tentar acessar o recurso | Contacte o Suporte Técnico | 500 |
| E502 | Método não implementado | Contacte o Suporte Técnico | 500 |
| E500 | Erro não mapeado | Contacte o Suporte Técnico | 500 |
| E100 | Usuário ou senha inválida | Verifique se os campos foram digitados corretamente | 409 |
| E101 | Campo obrigatório: %s | Preencha o campo obrigatório | 409 |
| E01  | Campo obrigatório: %s | Preencha o campo obrigatório | 409 |
| E102 | Já existe um registro com %s igual a(o) %s | O registro deve ser único | 409 |
| E108 | Senha expirada | É necessário você alterar a senha | 409 |
| E109 | Usuário bloqueado | Favor entre em contato com o administrador | 409 |
| E110 | Usuário ou Senha Inválida | Revise os dados inseridos na autenticação | 409 |
| E111 | Usuário %s | Consulta seu acesso junto ao suporte | 409 |
| E116 | O campo %s não contem o tamanho mínimo de %s caracteres | Preencha com a quantidade mínima de caracteres | 409 |
| E117 | O campo %s ultrapassa o tamanho máximo de %s caracteres | Preencha com a quantidade máxima de caracteres | 409 |
| E118 | O campo %s não contem o tamanho mínimo de %s e máximo de %s caracteres | Preencha com a quantidade mínima e máxima | 409 |
| E119 | O campo %s não pode ser alterado | Contacte o administrador do sistema | 409 |
| E127 | %s | O campo precisa atender aos requisitos de negócio | 409 |
| E128 | %s | Para maiores informações, consulte suporte | 409 |
| E134 | O campo %s %s | %s | 409 |
| E135 | %s | O registro precisa atender aos requisitos de negócio | 409 |
| E140 | O valor amortizado corresponde ao valor total do pagamento | Para valor integral, realize a compensação | 409 |
| E141 | O valor do pagamento diverge do valor informado na compensação | Ajuste os valores ou realize uma amortização | 409 |
| E198 | Erro na tentativa de realizar a consulta de %s | Reporte ao suporte técnico | 409 |
| E199 | Erro na tentativa de concluir a transação de persistência %s | Reporte ao suporte técnico | 409 |
| E181 | Brinde indisponível, aguarde mais algumas horas | Aguarde nossa próxima comemoração | 409 |
| E182 | %s | Siga as instruções | 409 |
| E900 | Token inválido ou expirado | Realize uma nova autenticação | 409 |

---

## 4. Padrão de Resposta

Todos os endpoints retornam o mesmo envelope JSON independente de sucesso ou erro.

### Sucesso — 201 Created

```json
{
  "status": {
    "data": "2026-06-20",
    "hora": "10:30:00",
    "success": true,
    "mensagem": "Registro criado com sucesso",
    "codigo": 201,
    "sugestao": ""
  },
  "data": { "id": 1, "name": "Model 1" },
  "page": null
}
```

### Erro — 404 Not Found

```json
{
  "status": {
    "data": "2026-06-20",
    "hora": "10:30:00",
    "success": false,
    "mensagem": "Não existe um registro de Model com o ID: 99 informado",
    "codigo": "404",
    "sugestao": "O registro deve existir previamente"
  },
  "data": null,
  "page": null
}
```

### Lista Vazia — 204 No Content

```json
{
  "status": {
    "success": false,
    "mensagem": "Consulta sem registros",
    "codigo": "204",
    "sugestao": "Realize uma operação de cadastro"
  },
  "data": [],
  "page": null
}
```

---

## 5. service-api-core

Projeto Spring Boot de referência que demonstra o consumo da `lib-messages`. Não possui pacote `infra` próprio.

### Dependência no pom.xml

```xml
<dependency>
    <groupId>com.izatec</groupId>
    <artifactId>lib-messages</artifactId>
    <version>1.0</version>
</dependency>
```

### Estrutura de Pacotes

```
spring.template
├── ServiceApiCoreApplication.java
└── app/
    ├── Model.java           ← @Data com id e name
    ├── AppService.java      ← lógica e exceções de negócio
    └── AppController.java   ← endpoints REST
```

### Endpoints

| Método | Endpoint | Descrição | Erro possível |
|---|---|---|---|
| POST | `/api/models` | Cria um novo registro | `RequiredFieldException` |
| PUT | `/api/models/{id}` | Atualiza um registro | `RecordNotFoundExceptionException` (404) |
| DELETE | `/api/models/{id}` | Remove um registro | `RecordNotFoundExceptionException` (404) |
| GET | `/api/models/{id}` | Busca um registro por ID | `RecordNotFoundExceptionException` (404) |
| GET | `/api/models` | Lista todos os registros | `NoResultsFoundException` (204) |
| DELETE | `/api/models` | Limpa todos os registros | — |

### Regra de Camadas

Toda validação e exceção fica no **Service**. O **Controller** apenas delega e monta a resposta.

```java
// AppService — lógica e exceção
if (!models.containsKey(id))
    throw new RecordNotFoundExceptionException("Model", id);

// AppController — apenas orquestra
return ResponseEntity.ok(ResponseFactory.ok(service.get(id)));
```

---

## 6. Como Adicionar um Novo Projeto Consumidor

**Passo 1 — Instalar lib-messages**
```bash
cd lib-messages
mvn install
```

**Passo 2 — Declarar dependência**
```xml
<dependency>
    <groupId>com.izatec</groupId>
    <artifactId>lib-messages</artifactId>
    <version>1.0</version>
</dependency>
```

**Passo 3 — Garantir o component scan**

Se o pacote base da aplicação for diferente de `spring.template`, adicione:

```java
@SpringBootApplication(scanBasePackages = {
    "com.meuapp",
    "spring.template.infra"
})
```

**Passo 4 — Usar no código**
```java
// Service
throw new RecordNotFoundExceptionException("Pedido", id);

// Controller
return ResponseEntity.ok(ResponseFactory.ok(service.get(id)));
```

---

## 7. Como Estender o Catálogo de Mensagens

**Passo 1 — Adicionar entrada no enum `BusinessMessage` em lib-messages**

```java
E150("150", "O campo %s está fora do intervalo permitido",
     "Informe um valor entre %s e %s") {
    @Override
    public int getHttpStatus() { return 422; }
},
```

**Passo 2 — Reinstalar a biblioteca**
```bash
cd lib-messages
mvn install
```

**Passo 3 — Usar nos projetos consumidores**
```java
throw new BusinessException(BusinessMessage.E150, "preco", "0", "9999");
```

> Todos os projetos consumidores recebem a nova mensagem automaticamente na próxima build, sem nenhuma alteração de código própria.
