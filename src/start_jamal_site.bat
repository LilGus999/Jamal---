@echo off
echo ===============================
echo Iniciando Esfiharia Jamal 🚀
echo ===============================

REM Navega até o diretório onde o script está
cd /d "%~dp0"

REM Instala as dependências se ainda não estiverem instaladas
echo Instalando dependências...
npm install

REM Inicia o servidor de desenvolvimento
echo Iniciando servidor local com Vite...
npm run dev

pause