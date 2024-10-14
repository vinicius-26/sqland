'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { TailSpin } from 'react-loader-spinner'; // Spinner importado
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
library.add(faDatabase);

import styles from './styles.module.css';

const StartPage: React.FC = () => {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  const [loading, setLoading] = useState(false); // Estado do spinner

  // Estado para controlar o efeito de transição
  const [formAnimationClass, setFormAnimationClass] = useState('');

  // Estado para controlar se o formulário já foi exibido em tela
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(1); // Slide inicial é o primeiro

  // Estados para controlar quais itens foram selecionados
  const [activeButtonsSlide1, setActiveButtonsSlide1] = useState<number[]>([]);
  const [activeButtonsSlide2, setActiveButtonsSlide2] = useState<number[]>([]);
  const [activeButtonSlide3, setActiveButtonSlide3] = useState<number | null>(null);

  const [errorMessageSlide1, setErrorMessageSlide1] = useState('');
  const [errorMessageSlide2, setErrorMessageSlide2] = useState('');
  const [errorMessageSlide3, setErrorMessageSlide3] = useState('');

  useEffect(() => {

    // localStorage.setItem('user', JSON.stringify({ email: 'vistephano123@gmail.com', token: '123' }));
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.email) {
      setEmail(user.email);
      setUserId(user.userId);
      setLoggedIn(true);

      // Animação de entrada
      setFormAnimationClass(''); // Limpa a animação antes de mudar
      setTimeout(() => {
        setFormAnimationClass('fade_in'); // Adiciona o efeito de fade-in
        setIsFormVisible(true); // Exibe o formulário após o delay da animação
      }, 500); // Pequeno delay para suavizar a transição
    } else {
      router.push('/Login');
    }
  }, [router]);

  useEffect(() => {
    if (isFormVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; // Reverte o overflow quando a animação termina
    }
  }, [isFormVisible]);

  const handleButtonHiddenClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Previne qualquer comportamento padrão do botão
  };

  const handleSlideChange = (event: React.MouseEvent<HTMLButtonElement>, direction: 'next' | 'prev') => {
    event.preventDefault(); // Previne o comportamento padrão do botão
    event.stopPropagation(); // Impede que o clique se propague para outros elementos

    // Pega todos os inputs de rádio
    const radios = document.querySelectorAll('input[name="slider"]') as NodeListOf<HTMLInputElement>;

    // Encontra o índice do rádio atualmente selecionado
    const currentIndex = Array.from(radios).findIndex(radio => radio.checked);

    // Determina o novo índice com base na direção ('next' ou 'prev')
    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = Math.min(currentIndex + 1, radios.length - 1); // Não ultrapassa o último slide
    } else if (direction === 'prev') {
      newIndex = Math.max(currentIndex - 1, 0); // Não volta antes do primeiro slide
    }

    // Marca o novo rádio como selecionado
    radios[newIndex].checked = true;

    // Calcula o próximo ou anterior slide com base no clique
    setCurrentSlide((prevSlide) => {
      const nextSlide = direction === 'next' ? prevSlide + 1 : prevSlide - 1;
      return Math.max(1, Math.min(3, nextSlide)); // Garante que o valor esteja entre 1 e 3
    });
  };

  const handleSlideChangeAnchor = (event: React.MouseEvent<HTMLAnchorElement>, direction: 'next' | 'prev') => {
    event.preventDefault(); // Previne o comportamento padrão do botão
    event.stopPropagation(); // Impede que o clique se propague para outros elementos

    // Pega todos os inputs de rádio
    const radios = document.querySelectorAll('input[name="slider"]') as NodeListOf<HTMLInputElement>;

    // Encontra o índice do rádio atualmente selecionado
    const currentIndex = Array.from(radios).findIndex(radio => radio.checked);

    // Determina o novo índice com base na direção ('next' ou 'prev')
    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = Math.min(currentIndex + 1, radios.length - 1); // Não ultrapassa o último slide
    } else if (direction === 'prev') {
      newIndex = Math.max(currentIndex - 1, 0); // Não volta antes do primeiro slide
    }

    // Verificação dos estados dos botões antes de permitir a transição
    if (newIndex === 1 && activeButtonsSlide1.length === 0) {
      setErrorMessageSlide1('Selecione algum dos itens acima para continuar.');
      return;
    } else {
      setErrorMessageSlide1('');
    }

    if (newIndex === 2 && activeButtonsSlide2.length === 0) {
      setErrorMessageSlide2('Selecione algum dos itens acima para continuar.');
      return;
    } else {
      setErrorMessageSlide2('');
    }

    // Marca o novo rádio como selecionado
    radios[newIndex].checked = true;

    // Calcula o próximo ou anterior slide com base no clique
    setCurrentSlide((prevSlide) => {
      const nextSlide = direction === 'next' ? prevSlide + 1 : prevSlide - 1;
      return Math.max(1, Math.min(3, nextSlide)); // Garante que o valor esteja entre 1 e 3
    });
  };

  // Calcula a porcentagem da barra de progresso
  const progressPercentage = (currentSlide / 3) * 100;

  const handleFinishClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();

    if (activeButtonSlide3 === null) {
      setErrorMessageSlide3('Selecione um item acima para continuar.');
      return;
    } else {
      setErrorMessageSlide3('');
    }

    fetch('http://localhost:3080/register-first-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.message === 'Primeira tarefa registrada com sucesso') {
          setFormAnimationClass('fade_out');
          
          setLoading(true); // Exibe o spinner
          setTimeout(() => {
            router.push('/Home');
          }, 1000); // Simulando um tempo de delay (1 segundo)  
        } else {
          setErrorMessageSlide3('Erro ao prosseguir para a próxima etapa...');
        }
      });
  };

  // Controla as opções selecionados pelo usuário no Slide 1
  const handleOptionClickSlide1 = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();

    if (activeButtonsSlide1.includes(index)) {
      // Remover o botão ativo
      setActiveButtonsSlide1(activeButtonsSlide1.filter((btnIndex) => btnIndex !== index));
    } else {
      // Adicionar o botão ao array de ativos
      setActiveButtonsSlide1([...activeButtonsSlide1, index]);
    }
  };

  // Controla as opções selecionados pelo usuário no Slide 2
  const handleOptionClickSlide2 = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();

    if (activeButtonsSlide2.includes(index)) {
      // Remover o botão ativo
      setActiveButtonsSlide2(activeButtonsSlide2.filter((btnIndex) => btnIndex !== index));
    } else {
      // Adicionar o botão ao array de ativos
      setActiveButtonsSlide2([...activeButtonsSlide2, index]);
    }
  };

  // Controla as opções selecionados pelo usuário no Slide 3
  const handleOptionClickSlide3 = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveButtonSlide3(index);
  };

  return (
    <>

      <div className={`${styles.animation_control} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
        <div className={styles.container}>
        <div className={`${styles.main_icon} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
            <FontAwesomeIcon
              icon="database"
            />
            <span>SQLand</span>
          </div>

          {loading ? (

            <div className={styles.contenedor}>
              <form className={`${styles["form-content"]} ${formAnimationClass}`}>
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
              </form>
            </div>

          ) : (
            <>
              {/* Barra de Progresso */}
              <div className={styles.progress_bar_container}>
                <div
                  className={styles.progress_bar}
                  style={{ width: `${progressPercentage}%` }} // Atualiza a largura dinamicamente
                ></div>
              </div>
              <div className={styles.contenedor}>
                <form className={`${styles.form_content} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out}`}>
                  <input type="radio" id="Slide1" name="slider" title="O que você quer aprender?" defaultChecked />
                  <input type="radio" id="Slide2" name="slider" title="Motivos para estudar" />
                  <input type="radio" id="Slide3" name="slider" title="Frequência diária" />

                  <div className={styles.labels}>

                    {/* O que você quer aprender? */}
                    <label className={styles.Slide} id="Slide1">
                      <h2 className={styles.welcome_message}>Bem-vindo(a) a nossa plataforma de estudos! Estamos felizes por você estar aqui.</h2>
                      <h1 className={styles.title}>O que você quer aprender?</h1>
                      <p className={styles.description}>Escolha entre as opções abaixo para começar a sua jornada de aprendizado sobre SQL e Bancos de Dados.</p>

                      <button className={styles.btn_hidden} onClick={handleButtonHiddenClick}></button>

                      {['Banco de Dados',
                        'Fundamentos básicos de SQL',
                        'Comandos SQL',
                        'Joins e Relacionamentos',
                        'Otimização de Consultas'].map((option, index) => (
                          <button
                            key={index}
                            onClick={(event) => handleOptionClickSlide1(event, index)}
                            className={activeButtonsSlide1.includes(index) ? `${styles.option} ${styles.active}` : styles.option}
                          >
                            {option}
                          </button>
                        ))}

                      <div className={styles.buttons_slide1}>
                        <div className={styles.btn_6}>
                          <a onClick={(event) => handleSlideChangeAnchor(event, 'next')} className={styles.btn_content} href="#">
                            <span className={styles.btn_title}>Próximo</span>
                            <span className={styles.icon_arrow}>
                              <svg
                                width="50px"
                                height="43px"
                                viewBox="0 0 66 43"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <g
                                  id="arrow"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <path
                                    className={styles.arrow_icon_one}
                                    d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                                    fill="#FFFFFF"
                                  ></path>
                                  <path
                                    className={styles.arrow_icon_two}
                                    d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                                    fill="#FFFFFF"
                                  ></path>
                                  <path
                                    className={styles.arrow_icon_three}
                                    d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                                    fill="#FFFFFF"
                                  ></path>
                                </g>
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>

                      <div className={styles.errorLabel}>{errorMessageSlide1}</div>
                    </label>

                    {/* Motivos para estudar */}
                    <label className={styles.Slide} id="Slide2">
                      <h2 className={styles.welcome_message}>Aprender SQL pode abrir portas tanto no <strong>mundo acadêmico</strong> quanto no <strong>mercado de trabalho</strong>.</h2>
                      <h1 className={styles.title}>Motivos para Estudar</h1>
                      <p className={styles.description}>Escolha quais opções refletem o seu desejo pelos estudos na área de banco de dados.</p>

                      <button className={styles.btn_hidden} onClick={handleButtonHiddenClick}></button>

                      {['Desenvolvimento Profissional',
                        'Acessar Novas Oportunidades',
                        'Melhorar minhas Habilidades Técnicas',
                        'Base para Outras Linguagens',
                        'Aprender mais sobre dados'].map((option, index) => (
                          <button
                            key={index}
                            onClick={(event) => handleOptionClickSlide2(event, index)}
                            className={activeButtonsSlide2.includes(index) ? `${styles.option} ${styles.active}` : styles.option}
                          >
                            {option}
                          </button>
                        ))}
                      <div className={styles.buttons_slide2}>
                        <button className={styles.btn_hidden} onClick={handleButtonHiddenClick}>Voltar</button>
                        <button onClick={(event) => handleSlideChange(event, 'prev')}>Voltar</button>
                        <div className={styles.btn_6}>
                          <a onClick={(event) => handleSlideChangeAnchor(event, 'next')} className={styles.btn_content} href="#">
                            <span className={styles.btn_title}>Próximo</span>
                            <span className={styles.icon_arrow}>
                              <svg
                                width="50px"
                                height="43px"
                                viewBox="0 0 66 43"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <g
                                  id="arrow"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <path
                                    className={styles.arrow_icon_one}
                                    d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                                    fill="#FFFFFF"
                                  ></path>
                                  <path
                                    className={styles.arrow_icon_two}
                                    d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                                    fill="#FFFFFF"
                                  ></path>
                                  <path
                                    className={styles.arrow_icon_three}
                                    d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                                    fill="#FFFFFF"
                                  ></path>
                                </g>
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>

                      <div className={styles.errorLabel}>{errorMessageSlide2}</div>
                    </label>

                    {/* Frequência diária */}
                    <label className={styles.Slide} id="Slide3">
                      <h2 className={styles.welcome_message}>Escolher uma <strong>frequência de estudo</strong> que se encaixa na sua rotina pode ajudar a manter a consistência e alcançar seus objetivos.</h2>
                      <h1 className={styles.title}>Qual será sua frequência de estudo?</h1>
                      <p className={styles.description}>Selecione a opção que melhor se adapta ao seu estilo de vida.</p>

                      <button className={styles.btn_hidden} onClick={handleButtonHiddenClick}></button>

                      {['Diariamente',
                        'A cada 2 dias',
                        'Semanalmente',
                        'Duas vezes por semana',
                        'Mensalmente'].map((option, index) => (
                          <button
                            key={index}
                            onClick={(event) => handleOptionClickSlide3(event, index)}
                            className={activeButtonSlide3 === index ? `${styles.option} ${styles.active}` : styles.option}
                          >
                            {option}
                          </button>
                        ))}

                      <div className={styles.buttons_slide2}>
                        <button className={styles.btn_hidden} onClick={handleButtonHiddenClick}>Voltar</button>
                        <button onClick={(event) => handleSlideChange(event, 'prev')}>Voltar</button>

                        <a onClick={(event) => handleFinishClick(event)} className={styles.btn_1}><span>Finalizar</span></a>
                      </div>

                      <div className={styles.errorLabel}>{errorMessageSlide3}</div>
                    </label>
                  </div>
                </form>
              </div>
              {/* Termina aqui */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StartPage;