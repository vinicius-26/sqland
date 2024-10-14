'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faRightFromBracket, faHome } from '@fortawesome/free-solid-svg-icons';
library.add(faRightFromBracket, faHome);

import { TailSpin } from 'react-loader-spinner'; // Spinner importado

import styles from './styles.module.css';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';

const Home: React.FC = () => {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const [loading, setLoading] = useState(false); // Estado do spinner

  // Estado para controlar o efeito de transição
  const [formAnimationClass, setFormAnimationClass] = useState('');

  // Estado para controlar se o formulário já foi exibido em tela
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Estado para verificar se o componente está montado no cliente
  const [isMounted, setIsMounted] = useState(false);

  const [currentXP, setCurrentXP] = useState(0); // XP atual do usuário

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimationClass, setModalAnimationClass] = useState('');

  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 5; // Número total de slides

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
  }, [router]);

  const onLogOutButtonClick = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);

    setLoading(true); // Exibe o spinner
    setTimeout(() => {
      router.push('/Login');
    }, 1000); // Simulando um tempo de delay (1 segundo)

  };

  const handleSobreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Previne qualquer comportamento padrão do botão
    const radioButton = document.getElementById('Slide5') as HTMLInputElement;
    if (radioButton) {
      radioButton.checked = true; // Simula o clique
    }
  };

  const openModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Previne qualquer comportamento padrão do botão
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
    }, 1000);

  };

  const onExploreButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Previne qualquer comportamento padrão do botão
    closeModal();

    setTimeout(() => {
      setFormAnimationClass('fade_out');
    }, 200);

    setTimeout(() => {
      setIsFormVisible(false);
      router.push('/Exercises');
    }, 1000);

  };

  return (
    <>

      {/* <div classNameNameName="mainContainer">
      <div classNameNameName="titleContainer">Welcome!</div>
      <div>This is the home page.</div>
      <div classNameNameName="buttonContainer">
        <input
          classNameNameName="inputButton"
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? 'Log out' : 'Log in'}
        />
        {loggedIn && <div>Your email address is {email}</div>}
      </div>
    </div> */}
      {/* Modal 3 - Sketch */}
      {modalVisible && (
        // <div id="modal-container" className={`${styles.modalContainer} ${modalAnimationClass == 'out' ? styles.out : ''} ${modalAnimationClass == 'active' ? styles.active : ''}  `}>
        <div id="modal-container" className={`${styles.modalContainer} ${styles.active} ${modalAnimationClass == 'out' ? styles.out : ''}`}>
          <div className={styles.modalBackground} onClick={() => { closeModal() }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div>
                <h2>Pronto para começar?</h2>
              </div>

              <div>
                <p>Antes de mergulhar nos exercícios, que tal  <strong>revisar</strong> alguns conceitos importantes?</p>
                <p>Seja qual for sua escolha, vamos juntos nessa jornada de aprendizado!</p>
              </div>
              <svg
                className={styles.modalSvg}
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
              >
                <rect
                  x="0"
                  y="0"
                  fill="none"
                  width="226"
                  height="162"
                  rx="3"
                  ry="3"
                ></rect>
              </svg>
              <div className={styles.btn_modal}>
                <button onClick={(e) => { onRevisionButtonClick(e) }}>Prefiro revisar antes de começar!</button>
                <button onClick={(e) => { onExploreButtonClick(e) }}>Estou pronto para os desafios!</button>
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
                {/* Ícone "Home" */}
                <input type="radio" id="Slide1" name="slider" title="Home" defaultChecked />
                <input type="radio" id="Slide2" name="slider" title="Seu progresso" />
                <input type="radio" id="Slide3" name="slider" title="Revisão" />
                <input type="radio" id="Slide4" name="slider" title="Perfil" />
                <input type="radio" id="Slide5" name="slider" title="Sobre" />
                <div className={styles.labels}>
                  <label className={styles.Slide} id="Slide1">
                    <div className={`${styles.main_icon} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
                      <FontAwesomeIcon
                        icon="database"
                      />
                      <span>SQLand</span>
                    </div>

                    <div className={styles.content}>
                      <h1>
                        <strong>Bem-vindo ao</strong> SQLand, {fullName}
                      </h1>
                    </div>
                    <p>Comece sua Jornada de Aprendizado Agora!</p>
                    <p>
                      Clique em <span>'Explorar'</span> para Começar
                    </p>

                    <div className={styles["buttons-home"]}>
                      <input type="button" value="Explorar" />
                      <button onClick={(e) => { openModal(e) }}>Explorar</button>
                      <button onClick={handleSobreClick}>Sobre</button>
                    </div>
                  </label>
                  <label className={styles.Slide} id="Slide2">
                    <div className={`${styles.main_icon} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
                      <FontAwesomeIcon
                        icon="database"
                      />
                      <span>SQLand</span>
                    </div>

                    <div className={styles["content-progresso"]}>
                      <h1>Progresso</h1>

                      {/* <ProgressBar currentXpProp={currentXP} type={"home"} /> */}

                      <div className={styles.card}>
                        <div className={styles["card-header"]}>
                          <div className={styles["header-img"]}></div>
                          <div className={styles["user-name"]}>
                            <h3>Vinicius de Stephano</h3>
                            <p>Iniciante</p>
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

                          <div className={styles["levels-balls"]}>
                            <div className={styles.ball}>1</div>
                            <div className={styles.ball}>2</div>
                            <div className={styles.ball}>3</div>
                            <div className={styles.ball}>4</div>
                          </div>
                        </div>
                        <div className={styles["card-button"]}>
                          <input type="text" />
                          <input type="button" value="Continuar" />
                        </div>
                      </div>
                    </div>
                    <div className={styles.icon}>
                      <span>
                        <i className="fa fa-keyboard-o"></i>
                      </span>
                      <span>Use as setas do teclado para navegar entre os menus</span>
                    </div>
                  </label>
                  <label className={styles.Slide} id="Slide3">
                    <div className={`${styles.main_icon} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
                      <FontAwesomeIcon
                        icon="database"
                      />
                      <span>SQLand</span>
                    </div>

                    <div className={styles.content}>
                      <h1>Adding pages to this template</h1>
                      <div className={styles.block}>
                        <ol>
                          <li>Add the pages title in the pageTitle array in the HTML editor to generate pages</li>
                          <li>Add the number of pages in the $npages variable in the CSS editor</li>
                        </ol>
                      </div>
                    </div>
                  </label>
                  <label className={styles.Slide} id="Slide4">
                    <div className={`${styles.main_icon} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
                      <FontAwesomeIcon
                        icon="database"
                      />
                      <span>SQLand</span>
                    </div>

                    <div className={styles.content}>
                      <h1>Perfil</h1>
                      {isMounted && (
                        <>
                          <div className={styles.logout_icon}>
                            <p>Sair</p>
                            <span>
                              <FontAwesomeIcon
                                className={styles.icon}
                                icon="right-from-bracket"
                                onClick={() => onLogOutButtonClick()}
                              />
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                  <label className={styles.Slide} id="Slide5">
                    <div className={`${styles.main_icon} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
                      <FontAwesomeIcon
                        icon="database"
                      />
                      <span>SQLand</span>
                    </div>

                    <div className={styles.content}>
                      <h1>Sobre</h1>
                      <div className={styles.block}>
                        <span>
                          <a href="https://codepen.io/hrtzt/pen/NPZKRN" target="_blank">
                            One Page Navigation CSS Menu
                          </a>
                        </span>
                        <span>
                          <a href="https://codepen.io/hrtzt/pen/YPoeWd" target="_blank">
                            The simplest CSS switch
                          </a>
                        </span>
                        <span>
                          <a href="https://codepen.io/hrtzt/pen/JdYaEZ" target="_blank">
                            Animated cube slider CSS only
                          </a>
                        </span>
                        <span>
                          <a href="https://codepen.io/hrtzt/pen/vGqEJO" target="_blank">
                            Google photos album view with only CSS
                          </a>
                        </span>
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