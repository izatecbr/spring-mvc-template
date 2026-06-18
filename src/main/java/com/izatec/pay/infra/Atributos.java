package com.izatec.pay.infra;

public enum Atributos {
    ID("id","Id"),
    CPF_CNPJ("cpfCnpj","CPF/CNPJ"),
    LOCALIZA("localiza",""),
    NOME("nome","Nome"),
    DATA_INICIO("dataInicio","Data Inicio"),
    DATA_FIM("dataFim","Data Fim"),
    STATUS("status","Status"),
    TIPO("tipo","Tipo"),
    AGENDAMENTO("agendamento","Agendamento"),
    ;
    private String nome;
    private String legenda;
    private Atributos(String nome, String legenda){
        this.nome  =nome;
        this.legenda = legenda;
    }

    public String getNome() {
        return nome;
    }

    public String getLegenda() {
        return legenda;
    }
}
