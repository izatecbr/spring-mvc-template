package com.izatec.pay.infra;

public enum Entidades {
    CONFIGURACAO("EmpresaConfiguracao", "Configuração"),
    CADASTRO("Cadastro", "Cadastro"),
    USUARIO("Usuario", "Usuário"),
    ATENDIMENTO("Atendimento", "Atendimento"),
    CLASSIFICACAO("Classificação", "Classificação"),
    LANCAMENTO("Lancamento", "Lançamento"),
    VENDA("Venda", "Venda"),
    PAGAMENTO("Pagamento", "Pagamento"),

    ;
    private String nome;
    private String legenda;

    private Entidades(String nome, String legenda) {
        this.nome = nome;
        this.legenda = legenda;
    }

    public String getNome() {
        return nome;
    }

    public String getLegenda() {
        return legenda;
    }
}
