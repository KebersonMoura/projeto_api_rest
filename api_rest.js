const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "healthy",
        versao: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

// adicionei lista UF
app.get("/api/v1/cidades/:sigla_uf", async (req, res) => {
    const { sigla_uf } = req.params;
    const limite = parseInt(req.query.limite) || 10;

    if (sigla_uf.length !== 2) {
        return res.status(400).json({
            erro: true,
            codigo: "SIGLA_UF_INVALIDA",
            mensagem: "A sigla do estado deve conter exatamente 2 letras",
            sigla_uf_informada: sigla_uf
        });
    }

    try {
        const resposta = await axios.get(
            `https://brasilapi.com.br/api/ibge/municipios/v1/${sigla_uf}`
        );

        const cidades = resposta.data
            .slice(0, limite)
            .map(cidade => ({
                nome: cidade.nome
            }));

        res.json({
            uf: sigla_uf.toUpperCase(),
            quantidade_retornada: cidades.length,
            cidades,
            consultado_em: new Date().toISOString()
        });

    } catch (error) {
        res.status(404).json({
            erro: true,
            codigo: "UF_NAO_ENCONTRADA",
            mensagem: "Estado com a sigla informada não foi encontrado",
            sigla_uf_informada: sigla_uf
        });
    }
});

// Consultar clima
app.get("/api/v1/clima/:nome_cidade", async (req, res) => {
    const { nome_cidade } = req.params;

    if (nome_cidade.length < 2) {
        return res.status(400).json({
            erro: true,
            codigo: "NOME_INVALIDO",
            mensagem: "O nome da cidade deve conter pelo menos 2 caracteres",
            nome_informado: nome_cidade
        });
    }

    try {
        // Buscar coordenadas
        const geo = await axios.get(
            `https://geocoding-api.open-meteo.com/v1/search`,
            {
                params: {
                    name: nome_cidade,
                    count: 1,
                    language: "pt",
                    format: "json"
                }
            }
        );

        if (!geo.data.results || geo.data.results.length === 0) {
            return res.status(404).json({
                erro: true,
                codigo: "CIDADE_NAO_ENCONTRADA",
                mensagem: "Nenhuma cidade encontrada com o nome informado",
                nome_informado: nome_cidade
            });
        }

        const cidade = geo.data.results[0];

        // Buscar clima
        const clima = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude: cidade.latitude,
                    longitude: cidade.longitude,
                    current_weather: true
                }
            }
        );

        res.json({
            nome: cidade.name,
            estado: cidade.admin1 || "",
            clima: {
                temperatura: clima.data.current_weather.temperature,
                unidades: {
                    temperatura: "°C"
                }
            },
            consultado_em: new Date().toISOString()
        });

    } catch (error) {
        res.status(503).json({
            erro: true,
            codigo: "SERVICO_EXTERNO_INDISPONIVEL",
            mensagem: "Erro ao consultar serviço externo"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});