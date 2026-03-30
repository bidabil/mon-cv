@echo off
taskkill /F /IM hugo.exe 2>nul
hugo server -D --baseURL "http://localhost:1313/"
