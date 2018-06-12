O script `build.py` é um pré-processador de userscript.

@webRequestItem
===============
O Tampermonkey [não suporta múltiplas entradas para a tag @webRequest](https://github.com/Tampermonkey/tampermonkey/issues/397), então teríamos que escrever todos os filtros de URL em uma linha. Porém isso prejudicaria os diffs e deixaria o código pouco legível.

Com a tag `@webRequestItem`, podemos especificar um elemento do array de `@webRequest` separadamente. O pré-processador `build.py` então converte essas entradas em um único `@webRequest`.
