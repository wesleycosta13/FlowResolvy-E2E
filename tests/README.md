# Cenários E2E

Os testes executáveis ficam em `e2e/`, agrupados por área (`public`, `auth`,
`app` e `workflows`). Page Objects e helpers compartilhados ficam em
`support/pages/` e `support/helpers/`. A recuperação de senha permanece
temporariamente ignorada até a funcionalidade estar disponível.

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

As mesmas variáveis são repassadas para o container pelo Docker Compose.
`E2E_BASE_URL` também pode ser definido para apontar para outra instância da
aplicação.

Sem essas variáveis, os cenários autenticados são ignorados; os cenários
anonimizados continuam disponíveis. Não salve credenciais de teste nos arquivos
do projeto.

O cenário de cadastro gera dados únicos e cria uma empresa no `E2E_BASE_URL` a
cada execução. A empresa não é removida automaticamente; no endereço padrão,
isso grava dados na aplicação publicada.
