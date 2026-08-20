# Mr. Dave Idiomas — Site institucional

Site institucional estático (HTML, CSS e JavaScript puros) para a escola online
de inglês e espanhol **Mr. Dave Idiomas**.

## Estrutura

```
site-institucional/
├── index.html                → Home
├── quem-somos/index.html     → Quem somos
├── cursos/index.html         → Cursos
├── metodologia/index.html    → Metodologia
├── contato/index.html        → Contato (formulário de aula experimental)
├── partials/
│   ├── header.html           → Cabeçalho (menu + CTA)  — editar em 1 lugar só
│   └── footer.html           → Rodapé (links, contato, redes)
└── assets/
    ├── css/
    │   ├── tokens.css        → Design tokens (cores, tipografia, espaçamento…)
    │   ├── base.css          → Reset, tipografia e utilidades de layout
    │   ├── components.css     → Botões, header, footer, cards, FAQ, formulário
    │   └── pages.css         → Hero e layouts específicos das páginas
    ├── js/
    │   ├── includes.js       → Injeta header/footer, menu, header no scroll
    │   ├── main.js           → Revelação no scroll + acordeão do FAQ
    │   └── form.js           → Validação e envio do formulário
    └── logos/                → Logotipos e favicon
```

As páginas ficam em pastas com `index.html` para que, na publicação, os links
não terminem em `.html` (ex.: `/cursos/` em vez de `/cursos.html`).

## Como visualizar localmente

O cabeçalho e o rodapé são carregados via `fetch` a partir de caminhos
absolutos (`/partials/...`), então é preciso servir por um servidor local
(abrir o arquivo direto com `file://` não funciona). Qualquer servidor estático
serve, por exemplo:

```bash
npx serve .
```

Depois acesse o endereço indicado no terminal.

## Publicação (links sem `.html`)

Basta subir a pasta em qualquer hospedagem de sites estáticos
(Netlify, Vercel, Cloudflare Pages, GitHub Pages etc.). A estrutura de pastas
com `index.html` já produz URLs limpas automaticamente. Publique a **raiz** do
projeto, pois os caminhos de CSS/JS/parciais são absolutos (`/assets/...`).

## Personalização rápida

- **Cores, fontes e espaçamentos:** edite apenas `assets/css/tokens.css`.
  Todo o restante usa variáveis — nada de valores fixos espalhados.
- **Menu e CTA:** `partials/header.html`.
- **Contato, redes sociais e links do rodapé:** `partials/footer.html`
  (procure os comentários indicando o que substituir: e-mail, WhatsApp, redes).
- **Logotipos:** troque os arquivos em `assets/logos/` mantendo os nomes, ou
  atualize os caminhos nos parciais/páginas. Variantes já preparadas:
  - `wordmark-navy.png` → logo escura (cabeçalho, fundos claros)
  - `wordmark-white.png` → logo branca (rodapé, fundos escuros)
  - `make-it-english.png` / `aqui-tu-hablas.png` → sub-marcas dos cursos
  - `favicon.svg` → ícone da aba do navegador

## Formulário de aula experimental

Por padrão, o formulário **valida os campos e mostra a mensagem de sucesso sem
enviar dados a nenhum servidor**. Para receber os leads por e-mail, use um
serviço de formulário (Formspree, Basin, Getform…) e informe a URL no atributo
`data-endpoint` do `<form>` em `contato/index.html`:

```html
<form class="contact-form" data-endpoint="https://formspree.io/f/SEU_ID" novalidate>
```

Feito isso, o `assets/js/form.js` passa a enviar os dados automaticamente.

Campos capturados: nome, e-mail, telefone/WhatsApp, idioma de interesse, nível
atual, objetivo e uma observação opcional.

## Cache dos arquivos CSS/JS (importante)

O GitHub Pages guarda os arquivos estáticos no cache do navegador por ~10 min.
Para que uma mudança em CSS/JS apareça na hora (sem o visitante precisar limpar
o cache), os links usam um parâmetro de versão, ex.:

```html
<link rel="stylesheet" href="/assets/css/pages.css?v=20260820" />
<script src="/assets/js/includes.js?v=20260820"></script>
```

**Sempre que editar qualquer arquivo em `assets/css/` ou `assets/js/`**, troque
o número `?v=...` (uma data no formato AAAAMMDD funciona bem) em **todas as
páginas** — assim o navegador baixa a versão nova imediatamente. Os parciais
(`header.html`/`footer.html`) não precisam disso: já são carregados com
revalidação (`cache: "no-cache"`).

## SEO e leitura por IAs (LLMs)

O site já vem preparado para ser encontrado no Google e lido por assistentes de
IA (ChatGPT, Gemini, Claude, Perplexity, Copilot).

Arquivos e recursos configurados:

- **`robots.txt`** — libera a indexação e autoriza explicitamente os crawlers de
  IA (GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, ClaudeBot,
  PerplexityBot, bingbot, Applebot, CCBot) e aponta o sitemap.
- **`sitemap.xml`** — lista as 5 páginas do site.
- **`llms.txt`** — resumo do site em texto/markdown, no padrão llmstxt.org, para
  os modelos entenderem rapidamente o que a escola oferece.
- **Meta tags por página** — `title`, `description`, `canonical`, `robots`,
  Open Graph e Twitter Card.
- **Imagem de compartilhamento** — `assets/img/og-image.png` (1200×630), usada
  em links no WhatsApp, redes sociais e resultados.
- **Dados estruturados (Schema.org / JSON-LD)** — organização educacional,
  site, planos e valores, FAQ (home), lista de cursos (cursos), página sobre e
  fundador (quem somos) e página de contato.

### Domínio (importante ao trocar)

Todas as URLs absolutas de SEO usam **`https://mrdaveidiomas.com.br`**. Se o
domínio mudar, faça um "localizar e substituir" desse endereço nestes arquivos:

- `robots.txt`, `sitemap.xml`, `llms.txt`
- o `<head>` de cada página (`index.html`, `cursos/`, `metodologia/`,
  `quem-somos/`, `contato/`) — tags `canonical`, `og:url`, `twitter` e os blocos
  `application/ld+json`.

### Depois de publicar

1. Cadastre o site no **Google Search Console** (google.com/search-console) e
   confirme a propriedade do domínio.
2. Em *Sitemaps*, envie `https://mrdaveidiomas.com.br/sitemap.xml`.
3. Opcional: valide os dados estruturados em
   *search.google.com/test/rich-results*.
