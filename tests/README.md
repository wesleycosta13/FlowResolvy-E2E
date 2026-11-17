# Cenários E2E

Os cenários ficam organizados por fluxo em `*.spec.ts`: acesso público, login,
cadastro, proteção de rotas, dashboard, chamados, relatórios, configurações e
fluxos completos. Os cenários de recuperação de senha estão temporariamente
ignorados até a funcionalidade estar disponível. Os Page Objects reutilizáveis
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

O workflow do GitHub Actions fica em `.github/workflows/e2e.yml` e roda em
pushes para `main`, pull requests e execução manual. Configure `E2E_BASE_URL`
como variável do repositório e `E2E_TEST_EMAIL` / `E2E_TEST_PASSWORD` como
secrets para incluir os cenários autenticados.

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
