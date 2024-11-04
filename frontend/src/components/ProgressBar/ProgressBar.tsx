'use client'

import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

export interface ProgressBarProps {
  currentXpProp: number;
  levelProp: number;
  type: string;
}

export function ProgressBar({ currentXpProp, levelProp, type }: ProgressBarProps) {

  const [currentXP, setCurrentXP] = useState(0); // XP atual do usuário
  const [level, setLevel] = useState(1); // Nível do usuário
  const [maxXP, setMaxXP] = useState(100); // XP total necessário para o próximo nível

  useEffect(() => {
    setCurrentXP(currentXpProp);
  }, [currentXpProp]);

  useEffect(() => {
    if (currentXP === 300) {
      setLevel(3);
      setCurrentXP(100);
    } else {
      setLevel(levelProp);
    }
  }, [levelProp]);

  let progressPercentage = 0;
  
  const calculaPorcentagemBarra = () => {
    if(currentXP == 300 && level == 3){
      progressPercentage = 100;
    } else {
      progressPercentage = ((currentXP / maxXP) * 100) % 100; // Calcula a porcentagem da barra
    }
  }

  calculaPorcentagemBarra();

  return (
    <>
      {/* Barra de Progresso */}
      <div className={`${type == 'home' ? styles.progress_bar_main_home : styles.progress_bar_main_exercises}`}>
        <div className={styles.progress_bar_text}>
          <p>{currentXP % 100}</p>
          <h2>Nível {level}</h2>
          <p>{maxXP}</p>
        </div>
        <div className={styles.progress_bar_container}>
          <div
            className={styles.progress_bar}
            style={{ width: `${progressPercentage}%` }} // Atualiza a largura dinamicamente
          ></div>
        </div>
      </div>
    </>
  );
};