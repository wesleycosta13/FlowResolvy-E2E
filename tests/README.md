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

Para executar os cenários que exigem autenticação, configure uma conta de teste
pela sessão do PowerShell antes de rodar os testes:

```powershell
$env:E2E_TEST_EMAIL = "email-da-conta-de-teste"
$env:E2E_TEST_PASSWORD = "senha-da-conta-de-teste"
npm run test:chromium
```

Sem essas variáveis, os cenários autenticados são ignorados; os cenários
anonimizados continuam disponíveis. Não salve credenciais de teste nos arquivos
do projeto.
