#!/usr/bin/env node
'use strict';

// Read-only checks. No credentials are read and no state-changing HTTP methods are sent.
const { URL } = require('node:url');

const origin = process.argv[2] || 'https://vercel-backend-sandy-kappa.vercel.app';
let base;
try {
  base = new URL(origin);
  if (!['http:', 'https:'].includes(base.protocol) || base.pathname !== '/' || base.search || base.hash || base.username || base.password) {
    throw new Error('Use somente a URL base do site, sem caminho, query ou credenciais.');
  }
} catch (error) {
  console.error('URL invalida:', error.message);
  process.exit(2);
}

async function check(label, pathname, verify) {
  try {
    const response = await fetch(new URL(pathname, base), {
      method: 'GET',
      redirect: 'manual',
      headers: { Accept: pathname === '/login' ? 'text/html' : 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    const text = await response.text();
    const outcome = verify(response, text);
    if (!outcome.ok) {
      console.error(`FALHOU ${label}: HTTP ${response.status} - ${outcome.message}`);
      return false;
    }
    console.log(`OK ${label}: HTTP ${response.status}`);
    return true;
  } catch (error) {
    console.error(`FALHOU ${label}: ${error.code || error.name || 'erro de conexao'}`);
    return false;
  }
}

async function main() {
  const checks = [
    await check('Pagina /login', '/login', (r, text) => ({
      ok: r.status === 200 && text.includes('id="login-form"') && text.includes('id="turnstile-container"'),
      message: 'Formulario ou container do CAPTCHA ausente'
    })),
    await check('Configuracao /api/config', '/api/config', (r, text) => {
      let config;
      try { config = JSON.parse(text); } catch { config = {}; }
      return {
        ok: r.status === 200 && typeof config.turnstileSiteKey === 'string' && config.turnstileSiteKey.length > 0,
        message: 'Chave PUBLICA indisponivel (o valor nao sera impresso)'
      };
    }),
    await check('Sessao sem autenticacao', '/api/session', (r) => ({
      ok: r.status === 401,
      message: 'Esperado 401 para acesso nao autenticado'
    })),
    await check('Produtos sem autenticacao', '/produtos', (r) => ({
      ok: r.status === 401,
      message: 'Esperado 401; confirmar que dados privados nao estao expostos'
    })),
    await check('Redirecionamento da raiz', '/', (r) => {
      let location = r.headers.get('location') || '';
      try { location = new URL(location, base).pathname; } catch { location = ''; }
      return {
        ok: [302, 303, 307, 308].includes(r.status) && location === '/login',
        message: 'Esperado redirecionamento para /login sem sessao'
      };
    })
  ];
  console.log(`Resultado: ${checks.filter(Boolean).length}/${checks.length} verificacoes aprovadas.`);
  if (checks.includes(false)) process.exitCode = 1;
}
main().catch(() => { console.error('Erro inesperado na verificacao'); process.exitCode = 1; });
