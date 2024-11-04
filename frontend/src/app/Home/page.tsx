'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faListCheck, faMedal } from '@fortawesome/free-solid-svg-icons';
library.add(faHome, faListCheck, faMedal);

import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
import { Header } from '@/components/Header/Header';
import { TailSpin } from 'react-loader-spinner'; // Spinner importado

import styles from './styles.module.css';

const Home: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  const [loading, setLoading] = useState(false); // Estado do spinner

  // Estado para controlar o efeito de transição
  const [formAnimationClass, setFormAnimationClass] = useState('');

  // Estado para controlar se o formulário já foi exibido em tela
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Estado para verificar se o componente está montado no cliente
  const [isMounted, setIsMounted] = useState(false);

  const [userXp, setUserXp] = useState(0);
  const [userLevel, setUserLevel] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimationClass, setModalAnimationClass] = useState('');

  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 5; // Número total de slides

  const [navSlide, setNavSlide] = useState('');

  const fetchUserXp = async (pUserId: number) => {
    try {
      const response = await fetch(`${apiUrl}/xp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: pUserId })
      });
      const data = await response.json();

      setUserXp(data.userXp);
      setUserLevel(data.userLevel);

      setCurrentQuestionIndex(data.questionId);

    } catch (error) {
      console.error('Erro ao buscar as questões:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) {
        // Scroll para baixo
        if (currentSlide < totalSlides) {
          setCurrentSlide(currentSlide + 1);
        }
      } else {
        // Scroll para cima
        if (currentSlide > 1) {
          setCurrentSlide(currentSlide - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentSlide]);

  useEffect(() => {
    // Mudar o slide atual com base no estado currentSlide
    const radioButton = document.getElementById(`Slide${currentSlide}`) as HTMLInputElement;
    if (radioButton) {
      radioButton.checked = true;
    }
  }, [currentSlide]);

  useEffect(() => {
    setIsMounted(true); // Componente montado no cliente

    // localStorage.setItem('user', JSON.stringify({ email: 'vistephano123@gmail.com', token: '123' }));
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.email) {
      setEmail(user.email);
      setFullName(user.fullName);
      setUserId(user.userId);
      setLoggedIn(true);

      // Animação de entrada
      setFormAnimationClass(''); // Limpa a animação antes de mudar
      setTimeout(() => {
        setFormAnimationClass('fade_in'); // Adiciona o efeito de fade-in
        setIsFormVisible(true); // Exibe o formulário após o delay da animação
      }, 1000); // Pequeno delay para suavizar a transição
    } else {
      router.push('/Login');
    }

    fetchUserXp(user.userId);
  }, [router]);

  useEffect(() => {
    if (userXp == 300 && userLevel == 3) {
      openModal();
    }
  }, [userXp])

  const handleNavHomeClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Previne qualquer comportamento padrão do botão

    setNavSlide('home');

    // const radioButton = document.getElementById('Slide1') as HTMLInputElement;
    // if (radioButton) {
    //   radioButton.checked = true; // Simula o clique
    // }
  };

  const handleNavProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Previne qualquer comportamento padrão do botão

    setNavSlide('progress');

    // const radioButton = document.getElementById('Slide2') as HTMLInputElement;
    // if (radioButton) {
    //   radioButton.checked = true; // Simula o clique
    // }
  };

  const openModal = () => {
    // event.preventDefault(); // Previne qualquer comportamento padrão do botão
    setModalVisible(true);
    setModalAnimationClass('active');
  };

  const closeModal = () => {
    setModalAnimationClass('out');
    setTimeout(() => {
      setModalVisible(false);

    }, 1200); // O tempo deve ser igual à duração da animação
  };

  const onRevisionButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Previne qualquer comportamento padrão do botão
    closeModal();

    setTimeout(() => {
      setFormAnimationClass('fade_out');
    }, 200);

    setTimeout(() => {
      setIsFormVisible(false);
      router.push('/Revision');
    }, 1500);

  };

  const onExploreButtonClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault(); // Previne qualquer comportamento padrão do botão

    // Reseta o progresso do usuário para iniciar os exercicios novamente
    const resetProgress = async () => {
      try {
        const response = await fetch(`${apiUrl}/reset-xp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();

      } catch (error) {
        console.error('Erro ao buscar as questões:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userXp == 300 && userLevel == 3) {
      resetProgress();
    }


    setTimeout(() => {
      setFormAnimationClass('fade_out');
    }, 200);

    setTimeout(() => {
      setIsFormVisible(false);
      router.push('/Exercises');
    }, 1500);

  };

  return (
    <>

      {/* Modal 3 - Sketch */}
      {modalVisible && (
        // <div id="modal-container" className={`${styles.modalContainer} ${modalAnimationClass == 'out' ? styles.out : ''} ${modalAnimationClass == 'active' ? styles.active : ''}  `}>
        <div id="modal-container" className={`${styles.modalContainer} ${styles.active} ${modalAnimationClass == 'out' ? styles.out : ''}`}>
          <div className={styles.firework}></div>
          <div className={styles.firework}></div>
          <div className={styles.firework}></div>

          <div className={styles.modalBackground} onClick={() => { closeModal() }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div>
                <h2>Parabéns, {fullName}!</h2>
              </div>

              <span>
                <FontAwesomeIcon
                  icon="medal"
                />
              </span>

              <div>
                <p>Você conquistou todos os níveis de SQL como um verdadeiro Data Master!</p>
                <p>Com muito empenho e curiosidade, você navegou pelos comandos, explorou tabelas e agora está mais que preparado para enfrentar qualquer desafio de dados que vier pela frente.</p>
                <p>Este certificado marca a sua dedicação e paixão por SQL – habilidades que abrem portas no universo de dados. Continue praticando e explorando, porque esse é só o começo da sua jornada como um especialista em Banco de Dados!</p>
                <p></p>
                <strong>Orgulhosamente, o time do SQLand!</strong>
              </div>
              <div className={styles.btn_modal}>
                <button onClick={() => { closeModal() }}>Fechar</button>
                {/* <button onClick={(e) => { onExploreButtonClick(e) }}>Estou pronto para os desafios!</button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${styles.animation_control} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
        <div className={styles.contenedor}>

          {loading ? (
            <div className={styles["spinner-container-home"]}>
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

              <form className={`${styles.form_content} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out}`}>


                {/* <input type="radio" id="Slide1" name="slider" title="Home" defaultChecked className={styles.input_hidden} />
                <input type="radio" id="Slide2" name="slider" title="Seu progresso" className={styles.input_hidden}/> */}

                <div className={styles.labels}>
                  <label className={`${styles.Slide} ${navSlide == 'home' ? styles.navSlide1 : ''} ${navSlide == 'progress' ? styles.navSlide2 : ''}`} id="Slide1">
                    <Header color="white" />

                    <div className={styles.navigation_icons}>

                      <div className={styles.nav_icon} onClick={(e) => { handleNavHomeClick(e) }}>
                        <FontAwesomeIcon
                          icon="home"
                        />

                        <span className={styles.underline} >Home</span>
                      </div>

                      <div className={styles.nav_icon} onClick={(e) => { handleNavProgressClick(e) }}>
                        <FontAwesomeIcon
                          icon="list-check"
                        />

                        <span>Progresso</span>
                      </div>
                    </div>

                    <div className={styles.content}>
                      <h1>
                        <strong>Bem-vindo ao</strong> SQLand, {fullName}
                      </h1>
                    </div>
                    <p>Comece sua Jornada de Aprendizado Agora!</p>

                    <div className={styles.buttons_home}>
                      <input type="button" value="Explorar" />
                      <button onClick={(e) => { onRevisionButtonClick(e) }}>COMEÇAR</button>
                    </div>
                  </label>
                  <label className={`${styles.Slide} ${navSlide == 'progress' ? styles.navSlide2 : ''}`} id="Slide2">

                    <Header color="white" />

                    <div className={styles.navigation_icons}>

                      <div className={styles.nav_icon} onClick={(e) => { handleNavHomeClick(e) }}>
                        <FontAwesomeIcon
                          icon="home"
                        />

                        <span>Home</span>
                      </div>

                      <div className={styles.nav_icon} onClick={(e) => { handleNavProgressClick(e) }}>
                        <FontAwesomeIcon
                          icon="list-check"
                        />

                        <span className={styles.underline}>Progresso</span>
                      </div>
                    </div>

                    <div className={styles["content-progresso"]}>

                      {navSlide === 'progress' && <ProgressBar currentXpProp={userXp} levelProp={userLevel} type={"home"} />}

                      <div className={styles.card}>
                        <div className={styles["card-header"]}>

                          <div className={styles.user_name}>
                            <h3>{fullName}</h3>
                            <p>{userLevel == 1 ? "Iniciante" : (userLevel == 2 ? "Intermediário" : "Avançado")}</p>
                          </div>
                        </div>
                        <div className={styles["progress-bar"]}>
                          <div className={styles.progress}>
                            <div className={`${styles.bar} ${styles.shadow} ${styles.overlap}`}></div>
                          </div>
                        </div>
                        <div className={styles.levels}>
                          <div className={styles["level-title"]}>
                            <h3>Niveis</h3>
                          </div>

                          <div className={styles.levels_balls}>
                            {[...Array(10)].map((_, index) => (
                              <div
                                key={index}
                                className={`${styles.ball} ${index < currentQuestionIndex
                                  ? styles.ball_green
                                  : index === currentQuestionIndex
                                    ? styles.ball_purple
                                    : styles.ball_grey
                                  }`}
                              >
                                {index + 1}
                              </div>
                            ))}
                          </div>

                        </div>
                        <div className={styles.card_button}>
                          <input type="text" />
                          {Number(currentQuestionIndex) <= 0 ? <input className={styles.btn_disabled} disabled type="button" value="Continuar" onClick={(e) => { onExploreButtonClick(e) }} /> : <input className="" type="button" value={(userXp == 300 && userLevel == 3 ? "Recomeçar" : "Continuar")} onClick={(e) => { onExploreButtonClick(e) }} />}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;