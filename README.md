<p align="center">
  <a href="https://burles.co">
    <img width="533" height="152" src="cover.png">
  </a>
</p>

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/rodorgas/burlesco)
[![Mozilla Add-on](https://img.shields.io/amo/v/burlesco.svg)](https://addons.mozilla.org/pt-BR/firefox/addon/burlesco/)
[![Mozilla Add-on Rating](https://img.shields.io/amo/rating/burlesco.svg)](https://addons.mozilla.org/pt-BR/firefox/addon/burlesco/)
[![Mozilla Add-on](https://img.shields.io/amo/d/burlesco.svg)](https://addons.mozilla.org/pt-BR/firefox/addon/burlesco/)


Extensão e userscript para navegadores que remove o paywall poroso de diversos sites de notícia. Funciona no Opera, Firefox e Chrome (e em qualquer navegador compatível com WebExtension).

Para instalar no seu navegador e para mais informações sobre o projeto, visite https://burles.co

# Desenvolvimento

O código-fonte da extensão possui basicamente três arquivos, na pasta `webext/`:

- `manifest.json`: descreve a extensão para os navegadores e define as permissões;
- `background.js`: bloqueia/manipula pedidos responsáveis pelo paywall;
- `content*.js`: injeta scripts para impedir a ativação do paywall.

Há um `build.sh` na raiz que empacota o fonte para os diferentes navegadores. Ele principalmente gera um `manifest.json` especial para o Chrome e Opera, que não aceitam uma chave específica usada pelo Firefox.

O código-fonte do userscript possui um único arquivo em `/userscript/script.js` que bloqueia pedidos responsáveis pelo paywall e injeta scripts para impedir ativação do paywall.

Se você tiver alguma dúvida ou ideia para burlar um site novo, abra uma issue ou nos [encontre no Gitter](https://gitter.im/rodorgas/burlesco).

# Publicações suportadas

O Burlesco funciona com os seguintes sites de notícia:

- Folha de S.Paulo
- O Globo
- O Estado de S. Paulo
- GaúchaZH
- Correio Popular
- Gazeta do Povo
- Diário Catarinense
- Jornal de Santa Catarina
- Diário de Santa Maria
- Nexo
- JOTA
- O Estado do Maranhão
- Jornal NH
- Veja
- Exame
- Superinteressante
- UOL
- The Economist
- Foreign Policy
- Financial Times
- The New York Times
- Washington Post

----

Esse software contém trabalho derivado da biblioteca [fetch](https://github.com/github/fetch), Copyright (c) GitHub, Inc. licenciado sob a licença MIT, que pode ser encontrada no arquivo NOTICE.txt.
