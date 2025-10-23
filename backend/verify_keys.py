from app.config import Config

print('=== VERIFICAÇÃO DAS CHAVES API ===\n')
print('Chat Key (GOOGLE_API_KEY):')
print(Config.GOOGLE_API_KEY)
print('\nAnalysis Key (GOOGLE_API_KEY_ANALYSIS):')
print(Config.GOOGLE_API_KEY_ANALYSIS)
print('\n=== SÃO DIFERENTES? ===')
if Config.GOOGLE_API_KEY != Config.GOOGLE_API_KEY_ANALYSIS:
    print('✅ SIM! As chaves são diferentes.')
else:
    print('❌ NÃO! PROBLEMA - As chaves são iguais.')
