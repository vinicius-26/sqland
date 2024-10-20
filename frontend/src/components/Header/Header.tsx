'use client'

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faRightFromBracket, faDatabase } from '@fortawesome/free-solid-svg-icons';
library.add(faRightFromBracket, faDatabase);

import { TailSpin } from 'react-loader-spinner'; // Spinner importado

import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

export interface HeaderProps {
  color: string
}

export function Header({ color }: HeaderProps) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  const [loading, setLoading] = useState(false); // Estado do spinner

  const onLogOutButtonClick = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);

    setLoading(true); // Exibe o spinner
    setTimeout(() => {
      router.push('/Login');
    }, 1000); // Simulando um tempo de delay (1 segundo)

  };

  return (
    <div>

      {loading ? (
        <div className={styles.spinner_container_home}>
          <TailSpin
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <>
          <div className={`${styles.main_icon} ${color == 'white' && styles.color_white} ${color == 'purple_dark' && styles.color_purple_dark} ${color == 'purple_light' && styles.color_purple_light}`}>
            <div className={styles.sql_icon}>
              <FontAwesomeIcon
                icon="database"
              />
              <span>SQLand</span>
            </div>

            <div className={styles.logout_icon}>
              <span>Sair</span>
              <span>
                <FontAwesomeIcon
                  className={styles.icon}
                  icon="right-from-bracket"
                  onClick={() => onLogOutButtonClick()}
                />
              </span>
            </div>
          </div>
        </>)}
    </div>
  );
};