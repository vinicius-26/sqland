// src/app/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import "./assets/styles/global.css";

export default function MainPage() {
  const router = useRouter();

  // Define a função assíncrona fora do useEffect
  const verificaPrimeiroAcesso = async (userId: number): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3080/verify-first-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });
      
      const result = await response.json();
      
      // Verifica a resposta e retorna o valor booleano apropriado
      return result.message === 'Ja passou pela primeira etapa';
    } catch (error) {
      console.log(error);
      console.error('Erro ao verificar o primeiro acesso:', error);
      return false; // Retorna false em caso de erro
    }
  };

  useEffect(() => {
    // Função assíncrona definida dentro do useEffect
    const checkUserAccess = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log(user);

      if (user && user.token) {
        // Token exists, redirect to /Home or StartPage

        // Verifica se a pessoa já passou a primeira vez pelas primeiras tasks - Retorna TRUE se já passou 
        const hasAccess = await verificaPrimeiroAcesso(user.userId);

        if (hasAccess) {
          router.push('/Home');
        } else {
          router.push('/StartPage');
        }
      } else {
        // No token, redirect to /login
        router.push('/Login');
      }
    };

    checkUserAccess();
  }, [router]);

  return null; // You can display a loading spinner here if needed
}