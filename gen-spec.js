const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  TableOfContents, PageBreak, Header, Footer, PageNumber, LevelFormat,
  VerticalAlign
} = require('docx');
const fs = require('fs');

// Colors
const BLUE_DARK   = "1F4E79";
const BLUE_MID    = "2E75B6";
const BLUE_LIGHT  = "D5E8F0";
const BLUE_HEADER = "BDD7EE";
const GRAY_TEXT   = "404040";
const WHITE       = "FFFFFF";

// Borders
const cellBorder = (color = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color });
const allBorders = (color = "CCCCCC") => ({ top: cellBorder(color), bottom: cellBorder(color), left: cellBorder(color), right: cellBorder(color) });

function heading1(text, bookmark) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    children: [new TextRun({ text, bold: true, font: "Arial", size: 32, color: BLUE_DARK })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, font: "Arial", size: 26, color: BLUE_MID })],
    spacing: { before: 240, after: 120 },
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color: GRAY_TEXT })],
    spacing: { before: 160, after: 80 },
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: GRAY_TEXT, ...opts })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: GRAY_TEXT })],
  });
}

function code(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 720 },
    children: [new TextRun({ text, font: "Courier New", size: 18, color: "1F3864" })],
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: BLUE_MID } },
  });
}

function spacer() {
  return new Paragraph({ children: [new TextRun("")], spacing: { before: 80, after: 80 } });
}

function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: allBorders("AAAAAA"),
    shading: { fill: BLUE_MID, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, font: "Arial", size: 20, color: WHITE })],
    })],
  });
}

function dataCell(text, width, fill = WHITE, bold = false) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: allBorders("CCCCCC"),
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, font: "Arial", size: 20, color: GRAY_TEXT, bold })],
    })],
  });
}

// ─── Catálogo completo ────────────────────────────────────────────────────────
const catalog = [
  ["E404", "Nao existe um registro de %s com o %s: %s informado", "O registro deve existir previamente", "404"],
  ["E204", "Consulta sem registros", "Realize uma operacao de cadastro", "204"],
  ["E501", "Erro ao tentar acessar o recurso", "Contacte o Suporte Tecnico", "500"],
  ["E502", "Metodo nao implementado", "Contacte o Suporte Tecnico", "500"],
  ["E500", "Erro nao mapeado", "Contacte o Suporte Tecnico", "500"],
  ["E100", "Usuario ou senha invalida", "Verifique se os campos foram digitados corretamente", "409"],
  ["E101", "Campo obrigatorio: %s", "Preencha o campo obrigatorio", "409"],
  ["E01",  "Campo obrigatorio: %s", "Preencha o campo obrigatorio", "409"],
  ["E102", "Ja existe um registro com %s igual a(o) %s", "O registro deve ser unico", "409"],
  ["E108", "Senha expirada", "E necessario voce alterar a senha", "409"],
  ["E109", "Usuario bloqueado", "Favor entre em contato com o administrador", "409"],
  ["E110", "Usuario ou Senha Invalida", "Revise os dados inseridos na autenticacao", "409"],
  ["E111", "Usuario %s", "Consulta seu acesso junto ao suporte", "409"],
  ["E116", "O campo %s nao contem o tamanho minimo de %s caracteres", "Preencha o campo com a quantidade minima de caracteres", "409"],
  ["E117", "O campo %s ultrapassa o tamanho maximo de %s caracteres", "Preencha o campo com a quantidade maxima de caracteres", "409"],
  ["E118", "O campo %s nao contem o tamanho minimo de %s e maximo de %s caracteres", "Preencha com a quantidade minima e maxima de caracteres", "409"],
  ["E119", "O campo %s nao pode ser alterado", "Contacte o administrador do sistema", "409"],
  ["E127", "%s", "O campo precisa atender aos requisitos de negocio", "409"],
  ["E128", "%s", "Para maiores informacoes, consulte suporte", "409"],
  ["E134", "O campo %s %s", "%s", "409"],
  ["E135", "%s", "O registro precisa atender aos requisitos de negocio", "409"],
  ["E140", "O valor amortizado corresponde ao valor total do pagamento", "Para valor integral, realize a compensacao do pagamento", "409"],
  ["E141", "O valor do pagamento diverge do valor informado na compensacao", "Ajuste os valores ou realize uma amortizacao", "409"],
  ["E198", "Erro na tentativa de realizar a consulta de %s", "Reporte ao suporte tecnico", "409"],
  ["E199", "Erro na tentativa de concluir a transacao de persistencia %s", "Reporte ao suporte tecnico", "409"],
  ["E181", "Brinde indisponivel, aguarde mais algumas horas", "Aguarde nossa proxima comemoracao", "409"],
  ["E182", "%s", "Siga as instrucoes", "409"],
  ["E900", "Token invalido ou expirado", "Realize uma nova autenticacao", "409"],
];

function catalogTable() {
  const COL = [900, 3200, 3200, 1060]; // sum = 8360
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      headerCell("Codigo", COL[0]),
      headerCell("Mensagem", COL[1]),
      headerCell("Sugestao", COL[2]),
      headerCell("HTTP", COL[3]),
    ],
  });

  const rows = catalog.map((r, i) => new TableRow({
    children: [
      dataCell(r[0], COL[0], i % 2 === 0 ? WHITE : BLUE_LIGHT, true),
      dataCell(r[1], COL[1], i % 2 === 0 ? WHITE : BLUE_LIGHT),
      dataCell(r[2], COL[2], i % 2 === 0 ? WHITE : BLUE_LIGHT),
      dataCell(r[3], COL[3], i % 2 === 0 ? WHITE : BLUE_LIGHT, true),
    ],
  }));

  return new Table({
    width: { size: 8360, type: WidthType.DXA },
    columnWidths: COL,
    rows: [headerRow, ...rows],
  });
}

// ─── Tabela de endpoints ──────────────────────────────────────────────────────
function endpointsTable() {
  const COL = [1400, 2200, 2600, 2160]; // sum = 8360
  const headers = ["Metodo", "Endpoint", "Descricao", "Erro possivel"];
  const rows_data = [
    ["POST",   "/api/models",      "Cria um novo registro",       "RequiredFieldException"],
    ["PUT",    "/api/models/{id}", "Atualiza um registro",        "RecordNotFoundException (404)"],
    ["DELETE", "/api/models/{id}", "Remove um registro",          "RecordNotFoundException (404)"],
    ["GET",    "/api/models/{id}", "Busca um registro por ID",    "RecordNotFoundException (404)"],
    ["GET",    "/api/models",      "Lista todos os registros",    "NoResultsFoundException (204)"],
    ["DELETE", "/api/models",      "Limpa todos os registros",    "-"],
  ];

  const colors = { POST: "E2EFDA", PUT: "FFF2CC", DELETE: "FCE4D6", GET: "DEEAF1" };

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => headerCell(h, COL[i])),
  });

  const dataRows = rows_data.map(r => new TableRow({
    children: [
      dataCell(r[0], COL[0], colors[r[0]] || WHITE, true),
      dataCell(r[1], COL[1]),
      dataCell(r[2], COL[2]),
      dataCell(r[3], COL[3]),
    ],
  }));

  return new Table({
    width: { size: 8360, type: WidthType.DXA },
    columnWidths: COL,
    rows: [headerRow, ...dataRows],
  });
}

// ─── DOCUMENTO ────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    }],
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: GRAY_TEXT } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: BLUE_DARK },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: BLUE_MID },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: GRAY_TEXT },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE_MID, space: 1 } },
          children: [new TextRun({ text: "Especificacao Tecnica — spring-mvc-template", font: "Arial", size: 18, color: BLUE_MID })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: BLUE_MID, space: 1 } },
          children: [
            new TextRun({ text: "Pagina ", font: "Arial", size: 18, color: GRAY_TEXT }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: GRAY_TEXT }),
            new TextRun({ text: " de ", font: "Arial", size: 18, color: GRAY_TEXT }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: GRAY_TEXT }),
          ],
        })],
      }),
    },
    children: [

      // ── CAPA ──────────────────────────────────────────────────────────────
      new Paragraph({ spacing: { before: 2880 }, children: [] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "spring-mvc-template", font: "Arial", size: 64, bold: true, color: BLUE_DARK })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240 },
        children: [new TextRun({ text: "Especificacao Tecnica de Arquitetura", font: "Arial", size: 36, color: BLUE_MID })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480 },
        children: [new TextRun({ text: "Padrao de Biblioteca Compartilhada com Spring Boot", font: "Arial", size: 26, color: GRAY_TEXT, italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440 },
        children: [new TextRun({ text: "Versao 1.0  |  Junho 2026", font: "Arial", size: 22, color: GRAY_TEXT })],
      }),

      // ── SUMÁRIO ───────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "Sumario", font: "Arial", size: 32, bold: true, color: BLUE_DARK })],
      }),
      new TableOfContents("Sumario", { hyperlink: true, headingStyleRange: "1-3" }),

      // ── 1. VISAO GERAL ────────────────────────────────────────────────────
      heading1("1. Visao Geral da Arquitetura"),
      para("Este repositorio adota o padrao de biblioteca compartilhada para centralizar toda a infraestrutura de respostas e excecoes em um unico modulo Maven reutilizavel, permitindo que multiplos projetos Spring Boot consumam o mesmo catalogo de mensagens sem duplicacao de codigo."),
      spacer(),
      heading2("1.1 Estrutura de Projetos"),
      code("spring-mvc-template/"),
      code("  service-api/          <- projeto original (mantido intacto)"),
      code("  lib-messages/         <- biblioteca Maven (jar)"),
      code("  |   src/main/java/spring/template/infra/"),
      code("  |       business/     <- excecoes e handler"),
      code("  |       response/     <- envelope de resposta"),
      code("  service-api-core/     <- Spring Boot consumindo lib-messages"),
      code("      src/main/java/spring/template/"),
      code("          app/          <- Model, AppService, AppController"),
      spacer(),
      heading2("1.2 Fluxo de Dependencia"),
      para("lib-messages e instalada no repositorio Maven local via mvn install e declarada como dependencia nos projetos consumidores. O GlobalExceptionHandler registrado na lib e detectado automaticamente pelo component scan do Spring Boot quando o pacote spring.template.infra esta incluido no scan."),
      spacer(),
      new Table({
        width: { size: 8360, type: WidthType.DXA },
        columnWidths: [2786, 2787, 2787],
        rows: [
          new TableRow({ children: [
            headerCell("lib-messages", 2786),
            headerCell("", 2787),
            headerCell("service-api-core", 2787),
          ]}),
          new TableRow({ children: [
            dataCell("Publica: infra.business, infra.response", 2786, BLUE_LIGHT),
            dataCell("  mvn install  -->", 2787, WHITE, true),
            dataCell("Consome: ResponseFactory, BusinessException", 2787, BLUE_LIGHT),
          ]}),
        ],
      }),

      // ── 2. LIB-MESSAGES ──────────────────────────────────────────────────
      heading1("2. lib-messages"),
      para("Biblioteca Maven pura (packaging jar) que contem toda a infraestrutura de mensagens, respostas padronizadas e tratamento de excecoes de negocio. Nao possui classe main nem depende de spring-boot-starter; utiliza apenas spring-boot-starter-web para acesso as anotacoes web do Spring."),
      spacer(),
      heading2("2.1 Coordenadas Maven"),
      code("groupId:    com.izatec"),
      code("artifactId: lib-messages"),
      code("version:    1.0"),
      code("packaging:  jar"),
      spacer(),
      heading2("2.2 Dependencias"),
      bullet("spring-boot-starter-web 3.2.4"),
      bullet("lombok 1.18.30 (optional)"),
      spacer(),
      heading2("2.3 Instalacao"),
      para("Execute dentro da pasta lib-messages:"),
      code("mvn install"),
      para("O jar e instalado no repositorio Maven local (~/.m2) e fica disponivel para todos os projetos da maquina."),
      spacer(),
      heading2("2.4 Pacote infra.business"),
      heading3("BusinessMessage"),
      para("Enum com o catalogo completo de mensagens de erro. Cada entrada contem codigo, mensagem formatavel (suporta %s), sugestao e httpStatus. Entradas especiais (E404, E204, E500, E501, E502) sobrescrevem getHttpStatus() para retornar o status HTTP correto."),
      spacer(),
      heading3("BusinessException"),
      para("Excecao de negocio base que estende RuntimeException. Carrega errorCode, suggestion e httpStatus extraidos do BusinessMessage. Oferece construtores para cenarios de campo obrigatorio, validacao generica e erros customizados."),
      spacer(),
      heading3("GlobalExceptionHandler"),
      para("Anotado com @RestControllerAdvice, captura todas as BusinessException e excecoes genericas, monta o envelope Response via ResponseFactory e retorna o ResponseEntity com o status HTTP correspondente."),
      spacer(),
      heading3("Especializacoes de BusinessException"),
      bullet("RecordNotFoundExceptionException  — HTTP 404, mensagem E404"),
      bullet("NoResultsFoundException           — HTTP 204, mensagem E204"),
      bullet("RequiredFieldException            — HTTP 409, mensagem E01"),
      spacer(),
      heading2("2.5 Pacote infra.response"),
      heading3("Response"),
      para("Envelope padrao retornado em todas as chamadas da API. Campos:"),
      bullet("dia / hora    — timestamp automatico da resposta"),
      bullet("success       — true para sucesso, false para erro"),
      bullet("mensagem      — descricao legivel do resultado"),
      bullet("codigo        — HTTP status code"),
      bullet("sugestao      — orientacao ao usuario em caso de erro"),
      bullet("data          — payload da resposta (objeto ou lista)"),
      bullet("page          — metadados de paginacao (ResponsePage)"),
      spacer(),
      heading3("ResponseFactory"),
      para("Classe utilitaria com metodos estaticos para construir instancias de Response:"),
      bullet("ok(body)                     — 200 com payload"),
      bullet("ok(body, message)            — 200 com mensagem customizada"),
      bullet("create(body, message)        — 201 criado com sucesso"),
      bullet("noContent()                  — 204 lista vazia"),
      bullet("okOrNotFound(value)          — 200 ou lanca RecordNotFoundExceptionException"),
      bullet("okOrNoContent(collection)    — 200 ou 204 conforme lista"),
      bullet("error(code, msg, suggestion) — resposta de erro"),
      bullet("exception(be)               — erro a partir de BusinessException"),

      // ── 3. CATALOGO ──────────────────────────────────────────────────────
      heading1("3. Catalogo de Mensagens"),
      para("Todas as mensagens de negocio estao centralizadas no enum BusinessMessage em lib-messages. A tabela abaixo lista o catalogo completo. Mensagens com %s sao parametrizaveis em tempo de execucao."),
      spacer(),
      catalogTable(),

      // ── 4. PADRAO DE RESPOSTA ─────────────────────────────────────────────
      heading1("4. Padrao de Resposta"),
      para("Todos os endpoints retornam o mesmo envelope JSON independente de sucesso ou erro. Isso garante consistencia para os clientes da API."),
      spacer(),
      heading2("4.1 Exemplo de Sucesso (201 Created)"),
      code("{"),
      code('  "dia":      "2026-06-20",'),
      code('  "hora":     "10:30:00",'),
      code('  "success":  true,'),
      code('  "mensagem": "Registro criado com sucesso",'),
      code('  "codigo":   201,'),
      code('  "sugestao": "",'),
      code('  "data": { "id": 1, "name": "Model 1" },'),
      code('  "page": null'),
      code("}"),
      spacer(),
      heading2("4.2 Exemplo de Erro (404 Not Found)"),
      code("{"),
      code('  "dia":      "2026-06-20",'),
      code('  "hora":     "10:30:00",'),
      code('  "success":  false,'),
      code('  "mensagem": "Nao existe um registro de Model com o ID: 99 informado",'),
      code('  "codigo":   "404",'),
      code('  "sugestao": "O registro deve existir previamente",'),
      code('  "data": null,'),
      code('  "page": null'),
      code("}"),
      spacer(),
      heading2("4.3 Exemplo de Lista Vazia (204 No Content)"),
      code("{"),
      code('  "success":  false,'),
      code('  "mensagem": "Consulta sem registros",'),
      code('  "codigo":   "204",'),
      code('  "sugestao": "Realize uma operacao de cadastro",'),
      code('  "data": []'),
      code("}"),

      // ── 5. SERVICE-API-CORE ───────────────────────────────────────────────
      heading1("5. service-api-core"),
      para("Projeto Spring Boot de referencia que demonstra o consumo da lib-messages. Nao possui pacote infra proprio; toda a infraestrutura vem da dependencia."),
      spacer(),
      heading2("5.1 Dependencias (pom.xml)"),
      bullet("spring-boot-starter-web"),
      bullet("com.izatec:lib-messages:1.0"),
      bullet("springdoc-openapi-starter-webmvc-ui:2.3.0"),
      bullet("lombok (optional)"),
      spacer(),
      heading2("5.2 Estrutura de Pacotes"),
      code("spring.template"),
      code("  ServiceApiCoreApplication.java   <- @SpringBootApplication"),
      code("  app/"),
      code("    Model.java          <- entidade com id e name"),
      code("    AppService.java     <- logica e excecoes de negocio"),
      code("    AppController.java  <- endpoints REST"),
      spacer(),
      heading2("5.3 Endpoints"),
      endpointsTable(),
      spacer(),
      heading2("5.4 Regra de Camadas"),
      para("Toda validacao e logica de excecao fica no Service. O Controller apenas delega e monta a resposta via ResponseFactory. Isso garante testabilidade e separa as responsabilidades corretamente."),
      code("// Service — logica e excecao"),
      code("if (!models.containsKey(id))"),
      code("    throw new RecordNotFoundExceptionException(\"Model\", id);"),
      code(""),
      code("// Controller — apenas orquestra"),
      code("return ResponseEntity.ok(ResponseFactory.ok(service.get(id)));"),

      // ── 6. NOVO PROJETO CONSUMIDOR ────────────────────────────────────────
      heading1("6. Como Adicionar um Novo Projeto Consumidor"),
      para("Qualquer projeto Spring Boot pode consumir lib-messages seguindo os passos:"),
      spacer(),
      heading2("Passo 1 — Instalar lib-messages"),
      code("cd lib-messages"),
      code("mvn install"),
      spacer(),
      heading2("Passo 2 — Declarar dependencia no pom.xml"),
      code("<dependency>"),
      code("    <groupId>com.izatec</groupId>"),
      code("    <artifactId>lib-messages</artifactId>"),
      code("    <version>1.0</version>"),
      code("</dependency>"),
      spacer(),
      heading2("Passo 3 — Garantir o component scan"),
      para("O GlobalExceptionHandler precisa estar no scan do Spring Boot. Se o pacote base da aplicacao for diferente de spring.template, adicione:"),
      code("@SpringBootApplication(scanBasePackages = {"),
      code("    \"com.meuapp\","),
      code("    \"spring.template.infra\""),
      code("})"),
      spacer(),
      heading2("Passo 4 — Usar ResponseFactory e excecoes"),
      code("// No Service"),
      code("throw new RecordNotFoundExceptionException(\"Pedido\", id);"),
      code(""),
      code("// No Controller"),
      code("return ResponseEntity.ok(ResponseFactory.ok(service.get(id)));"),

      // ── 7. ESTENDER CATALOGO ─────────────────────────────────────────────
      heading1("7. Como Estender o Catalogo de Mensagens"),
      para("O catalogo e centralizado em lib-messages. Para adicionar uma nova mensagem:"),
      spacer(),
      heading2("Passo 1 — Adicionar entrada no enum BusinessMessage"),
      code("E150(\"150\", \"O campo %s esta fora do intervalo permitido\","),
      code("     \"Informe um valor entre %s e %s\") {"),
      code("    @Override"),
      code("    public int getHttpStatus() { return 422; }"),
      code("},"),
      spacer(),
      heading2("Passo 2 — Reinstalar a biblioteca"),
      code("cd lib-messages"),
      code("mvn install"),
      spacer(),
      heading2("Passo 3 — Usar nos projetos consumidores"),
      code("throw new BusinessException(BusinessMessage.E150, \"preco\", \"0\", \"9999\");"),
      spacer(),
      para("Todos os projetos consumidores recebem a nova mensagem automaticamente na proxima build, sem nenhuma alteracao de codigo propria."),

    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:/izatec/projetos/spring-mvc-template/spec-spring-mvc-template.docx", buffer);
  console.log("Documento gerado com sucesso.");
});
