# Projeto API REST

Esse projeto foi feito em Node.js usando Express e Axios. Ele consulta cidades do Brasil por UF e também mostra a temperatura atual de uma cidade.

## O que a API faz

* Verifica se a API esta funcionando
* Lista cidades de um estado
* Consulta a temperatura atual de uma cidade

## Tecnologias usadas

* Node.js
* Express
* Axios
* Brasil API
* Open Meteo

## Como instalar

Primeiro clone o repositorio:

```bash
git clone https://github.com/KebersonMoura/projeto_api_rest.git
```

Entre na pasta:

```bash
cd projeto_api_rest
```

Instale as dependencias:

```bash
npm install
```

## Como executar

```bash
node api_rest.js
```

A API vai iniciar na porta 3000.

## Rotas

### Health

Verifica se a aplicação esta rodando.

```http
GET /api/v1/health
```

Exemplo de retorno:

```json
{
  "status": "healthy",
  "versao": "1.0.0"
}
```

### Buscar cidades por UF

```http
GET /api/v1/cidades/RN
```

Tambem pode passar um limite:

```http
GET /api/v1/cidades/CE?limite=5
```

Exemplo de retorno:

```json
{
  "uf": "RN",
  "quantidade_retornada": 5,
  "cidades": [
    {
      "nome": "Natal"
    }
  ]
}
```

### Buscar clima

```http
GET /api/v1/clima/Natal
```

Retorna a temperatura atual da cidade pesquisada.

Exemplo:

```json
{
  "nome": "Natal",
  "estado": "Rio Grande do Norte",
  "clima": {
    "temperatura": 28,
    "unidades": {
      "temperatura": "°C"
    }
  }
}
```

## Possiveis erros

Se informar uma UF errada:

```json
{
  "erro": true,
  "codigo": "SIGLA_UF_INVALIDA"
}
```

Se a cidade não existir:

```json
{
  "erro": true,
  "codigo": "CIDADE_NAO_ENCONTRADA"
}
```

## Dificuldades encontradas

Uma das dificuldades foi entender como consumir API externas e tratar os erros quando alguma delas não responde. Tambem teve um pouco de dificuldade para entender as rotas e parametros da requisição.

## Considerações finais

Esse projeto foi importante para aprender mais sobre APIs REST, consumo de dados externos e manipulação de JSON. Apesar de simples, ajudou bastante no entendimento do desenvolvimento backend.
