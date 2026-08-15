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
