# Cenários E2E

Os cenários ficam organizados por fluxo em `*.spec.ts`: landing page, login,
cadastro, recuperação de senha, proteção de rotas, dashboard, chamados,
relatórios, configurações e fluxos completos. Os Page Objects reutilizáveis
ficam em `pages/`.

Comandos:

```powershell
npm run test:chromium
npx playwright test --list
```

Para executar em Docker:

```powershell
docker compose build
docker compose run --rm e2e
```

O comando padrão executa Chromium. Para executar os três navegadores:

```powershell
docker compose run --rm e2e npm test
```

Para executar os cenários que exigem autenticação, configure uma conta de teste
pela sessão do PowerShell antes de rodar os testes:

```powershell
$env:E2E_TEST_EMAIL = "email-da-conta-de-teste"
$env:E2E_TEST_PASSWORD = "senha-da-conta-de-teste"
npm run test:chromium
```

As mesmas variáveis são repassadas para o container pelo Docker Compose.
`E2E_BASE_URL` também pode ser definido para apontar para outra instância da
aplicação.

Sem essas variáveis, os cenários autenticados são ignorados; os cenários
anonimizados continuam disponíveis. Não salve credenciais de teste nos arquivos
do projeto.
