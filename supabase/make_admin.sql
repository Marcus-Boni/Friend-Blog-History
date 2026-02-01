-- =====================================================
-- Centuriões Verbum - Configurar Primeiro Admin
-- Execute APÓS criar sua conta via login no site
-- =====================================================

-- Substitua 'seu-email@exemplo.com' pelo email que você usou para criar a conta
UPDATE profiles 
SET is_admin = true 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'mgalvaoboni@gmail.com'
);

-- Verificar se funcionou
SELECT id, username, email, is_admin 
FROM profiles 
WHERE is_admin = true;
