import { test, expect, type Page } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve carregar a página inicial corretamente', async ({ page }) => {
    await expect(page).toHaveTitle(/FlowResolvy/i);
    await expect(page.locator('text=Gerencie seus chamados com inteligência e eficiência')).toBeVisible();
  });

  test.describe('Header / Navegação', () => {
    test('deve exibir o logo FlowResolvy', async ({ page }) => {
      await expect(page.locator('header').getByText('FlowResolvy')).toBeVisible();
    });

    test('deve exibir links de navegação', async ({ page }) => {
      const nav = page.locator('header nav, header');
      await expect(nav.getByText('Início')).toBeVisible();
      await expect(nav.getByText('Recursos')).toBeVisible();
      await expect(nav.getByText('Planos')).toBeVisible();
      await expect(nav.getByText('Contato')).toBeVisible();
    });

    test('deve exibir botões Entrar e Começar Grátis', async ({ page }) => {
      await expect(page.locator('header').getByRole('link', { name: /Entrar/i })).toBeVisible();
      await expect(page.locator('header').getByRole('link', { name: /Começar Grátis/i })).toBeVisible();
    });

    test('botão Entrar deve navegar para /login', async ({ page }) => {
      await page.locator('header').getByRole('link', { name: /Entrar/i }).click();
      await expect(page).toHaveURL(/\/login/);
    });

    test('botão Começar Grátis deve navegar para /register', async ({ page }) => {
      await page.locator('header').getByRole('link', { name: /Começar Grátis/i }).click();
      await expect(page).toHaveURL(/\/register/);
    });
  });

  test.describe('Hero Section', () => {
    test('deve exibir headline e subtexto', async ({ page }) => {
      await expect(page.getByText('Gerencie seus chamados com inteligência e eficiência')).toBeVisible();
    });

    test('botão Começar Gratuitamente deve navegar para /register', async ({ page }) => {
      await page.getByRole('link', { name: /Começar Gratuitamente/i }).click();
      await expect(page).toHaveURL(/\/register/);
    });

    test('botão Ver Demonstração deve rolar para seção de recursos', async ({ page }) => {
      await page.getByRole('link', { name: /Ver Demonstração/i }).click();
      // Verifica se a URL contém o anchor #recursos
      await expect(page).toHaveURL(/#recursos/);
    });
  });

  test.describe('Seção de Recursos (#recursos)', () => {
    test('deve exibir 6 cards de funcionalidades', async ({ page }) => {
      await page.locator('#recursos').scrollIntoViewIfNeeded();
      
      const featureTexts = [
        'Gestão Inteligente',
        'Automação com IA',
        'Dashboard Analítico',
        'Comunicação Integrada',
        'SLA e Prioridades',
        'Relatórios Avançados',
      ];
      
      for (const text of featureTexts) {
        await expect(page.getByText(text, { exact: false })).toBeVisible();
      }
    });
  });

  test.describe('Seção de Planos (#planos)', () => {
    test('deve exibir 3 planos de preço', async ({ page }) => {
      await page.locator('#planos').scrollIntoViewIfNeeded();
      
      await expect(page.getByText('Básico')).toBeVisible();
      await expect(page.getByText('Profissional')).toBeVisible();
      await expect(page.getByText('Empresarial')).toBeVisible();
    });

    test('deve exibir preços corretos', async ({ page }) => {
      await page.locator('#planos').scrollIntoViewIfNeeded();

      await expect(page.getByText('Grátis', { exact: false })).toBeVisible();
      await expect(page.getByText('R$49', { exact: false })).toBeVisible();
      await expect(page.getByText('R$149', { exact: false })).toBeVisible();
    });

    test('deve indicar plano Profissional como Mais Popular', async ({ page }) => {
      await page.locator('#planos').scrollIntoViewIfNeeded();
      await expect(page.getByText('Mais Popular')).toBeVisible();
    });

    test('botões Começar Agora devem navegar para /register', async ({ page }) => {
      await page.locator('#planos').scrollIntoViewIfNeeded();
      const buttons = page.locator('#planos').getByRole('link', { name: /Começar Agora/i });
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(1);
      
      // Testa o primeiro botão
      await buttons.first().click();
      await expect(page).toHaveURL(/\/register/);
    });
  });

  test.describe('Seção de Contato (#contato)', () => {
    test('deve exibir formulário de contato com todos os campos', async ({ page }) => {
      await page.locator('#contato').scrollIntoViewIfNeeded();

      await expect(page.locator('#contato input[placeholder*="nome"]')).toBeVisible();
      await expect(page.locator('#contato input[placeholder*="email"]')).toBeVisible();
      await expect(page.locator('#contato select')).toBeVisible();
      await expect(page.locator('#contato textarea')).toBeVisible();
    });

    test('select de Assunto deve ter as opções corretas', async ({ page }) => {
      await page.locator('#contato').scrollIntoViewIfNeeded();
      const select = page.locator('#contato select');
      
      const options = ['Dúvida Geral', 'Suporte Técnico', 'Comercial', 'Parceria'];
      for (const opt of options) {
        await expect(select.locator(`option:text("${opt}")`)).toBeAttached();
      }
    });

    test('deve enviar formulário de contato preenchido', async ({ page }) => {
      await page.locator('#contato').scrollIntoViewIfNeeded();

      await page.locator('#contato input[placeholder*="nome"]').fill('Teste Automatizado');
      await page.locator('#contato input[placeholder*="email"]').fill('teste@email.com');
      await page.locator('#contato select').selectOption({ label: 'Suporte Técnico' });
      await page.locator('#contato textarea').fill('Mensagem de teste automatizado');

      await page.locator('#contato').getByRole('button', { name: /Enviar Mensagem/i }).click();

      // Aguarda alguma confirmação (pode ser toast, mensagem inline, etc.)
      await expect(page.getByText(/enviada|sucesso|obrigado/i)).toBeVisible({ timeout: 5000 });
    });

    test('deve exibir informações de contato', async ({ page }) => {
      await page.locator('#contato').scrollIntoViewIfNeeded();

      await expect(page.getByText('contato@flowresolvy.com')).toBeVisible();
      await expect(page.getByText('(11) 9999-9999')).toBeVisible();
    });
  });

  test.describe('Footer', () => {
    test('deve exibir o copyright', async ({ page }) => {
      await expect(page.getByText(/© 2024 FlowResolvy/i)).toBeVisible();
    });

    test('deve conter links do footer', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer.getByText('Recursos')).toBeVisible();
      await expect(footer.getByText('Sobre Nós')).toBeVisible();
      await expect(footer.getByText('Termos de Uso')).toBeVisible();
      await expect(footer.getByText('Privacidade')).toBeVisible();
    });
  });
});
