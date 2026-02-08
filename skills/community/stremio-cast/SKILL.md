---
name: stremio-cast
description: Busca conteúdo no Stremio Web e transmite para dispositivos Chromecast usando CATT e Playwright.
homepage: https://github.com/openclaw/skills/tree/main/skills/pedro-valentim/stremio-cast/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# stremio-cast

Busca conteúdo no Stremio Web e transmite para dispositivos Chromecast usando CATT e Playwright.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [stremio-cast](https://github.com/openclaw/skills/tree/main/skills/pedro-valentim/stremio-cast/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Stremio Cast

Esta skill permite que o Manus automatize a interface web do Stremio para encontrar links de streaming locais e transmiti-los para um dispositivo Chromecast.

## Pré-requisitos

Para que esta skill funcione corretamente, o ambiente deve ter:
1. **Stremio Service** rodando localmente na porta `11470`.
2. **Playwright** instalado para automação do navegador.
3. **CATT (Cast All The Things)** instalado via pip para o casting.

## Fluxo de Trabalho

A skill executa os seguintes passos:
1. Abre a interface web do Stremio (`app.strem.io`).
2. Realiza a busca pelo título solicitado.
3. Seleciona o primeiro resultado e o melhor link de stream disponível.
4. Intercepta a URL do stream gerada pelo servidor local do Stremio (`127.0.0.1:11470`).
5. Envia essa URL para o dispositivo Chromecast especificado usando a ferramenta `catt`.

## Uso

A skill deve ser invocada quando o usuário pedir para "tocar [filme/série] no Chromecast" ou "assistir [título] na TV".

### Parâmetros
- `query`: O nome do filme ou série a ser buscado.
- `device`: (Opcional) O nome do dispositivo Chromecast. Padrão: "Living Room".

### Exemplo de Comando
```bash
python3 scripts/stremio_cast.py "The Matrix" "Quarto"
```

## Notas Importantes
- **Manutenção de Sessão**: O servidor de streaming do Stremio pode exigir que a aba do navegador permaneça aberta para continuar o download do torrent. O script fecha o navegador após iniciar o cast, mas isso pode ser ajustado se o stream cair prematuramente.
- **Seletores CSS**: Os seletores da interface web do Stremio podem mudar. Caso a skill falhe ao clicar em elementos, verifique se os seletores em `scripts/stremio_cast.py` ainda são válidos.
