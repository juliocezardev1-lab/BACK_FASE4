-- Somente leitura: execute no SQL Editor do banco correto antes de aplicar migracoes.
-- NULL significa que a tabela nao existe neste schema.
SELECT
  to_regclass('public.produtos') AS produtos,
  to_regclass('public.auth_users') AS auth_users,
  to_regclass('public.auth_sessions') AS auth_sessions,
  to_regclass('public.login_attempts') AS login_attempts;

-- Contagem de contas administradoras (executar somente se auth_users existir):
-- SELECT count(*) AS admins_ativos FROM public.auth_users WHERE role = 'admin' AND is_active = TRUE;
