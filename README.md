<p align="center">
  <a href="https://burles.co">
    <img width="533" src="cover.png">
  </a>
</p>

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/rodorgas/burlesco)
[![Mozilla Add-on](https://img.shields.io/amo/v/burlesco.svg)](https://addons.mozilla.org/pt-BR/firefox/addon/burlesco/)
[![Mozilla Add-on Rating](https://img.shields.io/amo/rating/burlesco.svg)](https://addons.mozilla.org/pt-BR/firefox/addon/burlesco/)
[![Mozilla Add-on](https://img.shields.io/amo/d/burlesco.svg)](https://addons.mozilla.org/pt-BR/firefox/addon/burlesco/)
[![Build Status](https://travis-ci.org/burlesco/burlesco.svg?branch=master)](https://travis-ci.org/burlesco/burlesco)


Extensão e userscript para navegadores que remove o paywall poroso de diversos sites de notícia. Funciona no Opera, Firefox e Chrome (e em qualquer navegador compatível com WebExtension).

Para instalar no seu navegador e para mais informações sobre o projeto, visite https://burles.co

# Desenvolvimento

## Extensão

O código-fonte da extensão possui basicamente três arquivos, na pasta `webext/`:

- `manifest.json`: descreve a extensão para os navegadores e define as permissões;
- `background.js`: bloqueia/manipula pedidos responsáveis pelo paywall;
- `content*.js`: injeta scripts para impedir a ativação do paywall ou revertê-lo.

Há um Makefile para auxiliar no desenvolvimento:

- `make lint`: verifica erros de sintaxe ou de estilo no código. Requer o [`es-lint`](https://github.com/eslint/eslint) que pode instalado com `npm install -g eslint`;
- `make`: executa todas as etapas incluindo o lint e gera extensões empacotadas para cada navegador.

## Userscript

O código-fonte do userscript está em `userscript/burlesco.user.js`. Ele funciona bloqueando pedidos responsáveis pelo paywall e injetando scripts para impedir sua ativação.

Esse userscript funciona apenas com o Tampermonkey, porque é o único com suporte a API @webRequest.

----

Se você tiver alguma dúvida ou ideia para burlar um site novo, abra uma issue ou nos [encontre no Gitter](https://gitter.im/rodorgas/burlesco).

# Publicações suportadas

O Burlesco funciona com os seguintes sites de notícia:

- Bloomberg
- BR18
- Correio Popular
- Diário Catarinense
- Diário da Região
- Diário Popular
- Diarinho
- Exame
- El Tiempo
- Financial Times
- Folha de Londrina
- Folha de S.Paulo
- Foreign Policy
- Gazeta do Povo
- Gazeta Online
- GaúchaZH
- Gramophone
- Haaretz
- JOTA
- Jornal de Santa Catarina
- Jornal NH
- Jornal Pioneiro
- Jornal VS
- Nexo
- Medium
- O Estado de S. Paulo
- O Globo
- Quatro Rodas
- Superinteressante
- The Economist
- The New York Times
- The Wall Street Journal
- The Washington Post
- UOL
- Veja
- Wired
