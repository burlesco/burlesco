<p align="center">
  <a href="https://burles.co">
    <img width="533" src="cover.png">
  </a>
</p>

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/rodorgas/burlesco)
[![GitHub release](https://img.shields.io/github/release/burlesco/burlesco.svg)](https://github.com/burlesco/burlesco/releases/latest/)
[![CI](https://github.com/burlesco/burlesco/actions/workflows/ci.yml/badge.svg)](https://github.com/burlesco/burlesco/actions/workflows/ci.yml)


Extensão e userscript para navegadores que remove o paywall poroso de diversos sites de notícia. Funciona no Opera, Firefox e Chrome (e em qualquer navegador compatível com WebExtension).

Para instalar no seu navegador e para mais informações sobre o projeto, visite https://burles.co

Para saber quais sites funcionam na extensão e no userscript, e de que forma, veja a [tabela de compatibilidade](COMPATIBILITY.md). Confira antes de abrir uma issue.

# Desenvolvimento

A extensão para Firefox e o userscript são gerados a partir das mesmas regras:

- `rules/<id>.js`: uma regra por site, descrevendo o que fazer em cada um (bloquear pedidos, injetar código etc.);
- `build/`: o gerador, que transforma as regras na extensão e no userscript;
- `test/`: os testes, incluindo `test/gate/<id>.js`, o registro do que cada site fazia antes da migração.

Comandos (requer Node 22 e `npm ci`):

- `npm run build`: gera `dist/burlesco.user.js`, a extensão em `dist/firefox/` e a [tabela de compatibilidade](COMPATIBILITY.md);
- `npm run lint`: verifica erros de sintaxe ou de estilo no código;
- `npm test`: roda os testes.

Uma tag `v*` publica as duas versões (veja `.github/workflows/release.yml`).

O userscript funciona apenas com o Tampermonkey, porque é o único com suporte a API @webRequest.

----

Se você tiver alguma dúvida ou ideia para burlar um site novo, abra uma issue ou nos [encontre no Gitter](https://gitter.im/rodorgas/burlesco).

# Publicações suportadas

O Burlesco funciona com os seguintes sites de notícia:

- BRPOLÍTICO
- Correio 24 Horas
- Correio Popular
- Crusoé
- Diarinho
- Diário Popular
- Diário da Região
- Diário de Canoas
- Diário do Grande ABC
- EL PAÍS Brasil
- Estado de Minas
- Exame
- Folha de Londrina
- Folha de S.Paulo
- Gazeta Online
- Gazeta do Povo
- GaúchaZH
- JOTA
- Jornal NH
- Jornal Pioneiro
- Jornal VS
- NSC Total
- O Estado de S. Paulo
- O Globo
- Observador
- Quatro Rodas
- Revista Oeste
- Seu Dinheiro
- Superinteressante
- UOL
- Valor Econômico
- Veja
- Época
