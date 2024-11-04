'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TailSpin } from 'react-loader-spinner'; // Spinner importado

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDatabase, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
library.add(faDatabase, faRightFromBracket);

import styles from './styles.module.css';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';

const Exercises: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);

  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  const [loading, setLoading] = useState(false); // Estado do spinner

  // Estado para controlar o efeito de transição
  const [formAnimationClass, setFormAnimationClass] = useState('');
  const [cardAnimationClass, setCardAnimationClass] = useState('');

  // Estado para controlar se o formulário já foi exibido em tela
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Estado para verificar se o componente está montado no cliente
  const [isMounted, setIsMounted] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [activeButtons, setActiveButtons] = useState<string | null>(null);

  const [userXp, setUserXp] = useState(0);
  const [userLevel, setUserLevel] = useState(0);

  const [userLevelAntigo, setUserLevelAntigo] = useState(0);

  const [errorMessage, setErrorMessage] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimationClass, setModalAnimationClass] = useState('');

  const [modalLevelUpVisible, setModalLevelUpVisible] = useState(false);
  const [modalLevelUpAnimationClass, setModalLevelUpAnimationClass] = useState('');

  const [orderedOptions, setOrderedOptions] = useState<string[]>([]);

  const [freeResponse, setFreeResponse] = useState('');

  const [firstAcess, setFirtsAcess] = useState(false);

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

      setTimeout(() => {
        setCurrentQuestionIndex(data.questionId);
      }, 500);

    } catch (error) {
      console.error('Erro ao buscar as questões:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFirtsAcess(true);
    setIsMounted(true); // Componente montado no cliente

    // localStorage.setItem('user', JSON.stringify({ email: 'vistephano123@gmail.com', token: '123' }));
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.email) {
      setEmail(user.email);
      setUserId(user.userId);
      setLoggedIn(true);

      fetchUserXp(user.userId);

      // Animação de entrada
      setCardAnimationClass('');
      setFormAnimationClass(''); // Limpa a animação antes de mudar
      setTimeout(() => {
        setCardAnimationClass('slide_in_right');
        setFormAnimationClass('fade_in'); // Adiciona o efeito de fade-in
        setIsFormVisible(true); // Exibe o formulário após o delay da animação
      }, 500); // Pequeno delay para suavizar a transição
    } else {
      router.push('/Login');
    }
  }, [router]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/questions`, { method: 'POST' });
      const data = await response.json();
      setQuestions(data.existingQuestion);  // Set the questions from the API
    } catch (error) {
      console.error('Erro ao buscar as questões:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    setModalVisible(false);
    setModalLevelUpVisible(false);

    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (userLevel > userLevelAntigo) {
      openModalLevelUp();
    }
  }, [userLevel]);

  useEffect(() => {
    if (modalVisible) {
      // Adiciona a classe de animação ao exibir o modal
      setModalAnimationClass('active');
    } else {
      // Remove a animação após o fechamento
      setModalAnimationClass('out');
    }
  }, [modalVisible]);

  const openModal = () => {
    setModalVisible(true);
    setUserLevelAntigo(userLevel);
  };

  const closeModal = () => {
    setModalAnimationClass('out');
    setFirtsAcess(false);
    setTimeout(() => {

      // Verifica se há opções selecionadas e limpa para não aparecer no proximo exercicio
      if (orderedOptions) {
        setOrderedOptions([]);
      }

      setModalVisible(false);

      // Registrar XP aqui
      const fetchRegisterUserXp = async () => {
        try {
          const response = await fetch(`${apiUrl}/register-xp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              question_id: currentQuestion.question_id,
              xp_reward: currentQuestion.xp_reward,
              is_correct: true
            })
          });

          const data = await response.json();

          // Atualiza o XP do usuário
          if (data.message === 'XP atualizado com sucesso') {
            fetchUserXp(userId);
          }

        } catch (error) {
          console.error('Erro ao buscar as questões:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRegisterUserXp();

      if (currentQuestionIndex < 9) {
        onNextButtonClick();
      } else {
        setLoading(true); // Exibe o spinner
        setTimeout(() => {
          router.push('/Home');
          setLoading(false);
        }, 1000); // Simulando um tempo de delay (1 segundo)
      }

    }, 500); // O tempo deve ser igual à duração da animação
  };

  const onNextButtonClick = () => {
    // Verifique se uma opção foi selecionada
    if (!activeButtons) {
      console.log('Nenhuma opção foi selecionada.');
      // setErrorMessage('Selecione uma opção acima para continuar');
      return;
    }

    console.log(currentQuestionIndex);
    console.log(activeButtons);

    // Antes de trocar para a pergunta número 4, com índice [3], verifica se está indo para ela e limpa os botões
    if (currentQuestionIndex === 2 || currentQuestionIndex === 4 || currentQuestionIndex === 6) {
      setActiveButtons(null);
    }

    setCardAnimationClass('slide_out_left');

    setTimeout(() => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCardAnimationClass('slide_in_right');
    }, 500);

  };

  useEffect(() => {
    if (modalLevelUpVisible) {
      // Adiciona a classe de animação ao exibir o modal
      setModalLevelUpAnimationClass('active');
    } else {
      // Remove a animação após o fechamento
      setModalLevelUpAnimationClass('out');
    }
  }, [modalLevelUpVisible]);

  const openModalLevelUp = () => {
    setModalLevelUpVisible(true);
  };

  const closeModalLevelUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setModalLevelUpAnimationClass('out');
    setTimeout(() => {
      setModalLevelUpVisible(false);
    }, 1200); // O tempo deve ser igual à duração da animação
  };

  const handleOptionClick = (event: React.MouseEvent<HTMLButtonElement>, optionKey: string) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveButtons(optionKey); // Armazena a letra da opção selecionada (A, B, C, D)
  };

  const handleValidateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (currentQuestion.type === 'multiple_choice') {
      // Lógica para múltipla escolha
      if (!activeButtons) {
        setErrorMessage('Selecione uma opção acima para continuar');
        return;
      }

      if (!currentQuestion || !currentQuestion.correct_answer) {
        setErrorMessage('Selecione uma opção acima para continuar');
        return;
      }

      if (activeButtons === currentQuestion.correct_answer) {
        openModal();
        setErrorMessage('');
      } else {
        setErrorMessage('Resposta incorreta.');
      }
    } else if (currentQuestion.type === 'ordering') {

      if (!orderedOptions || orderedOptions.length === 0) {
        setErrorMessage('Selecione as opções acima para continuar...');
        return;
      }

      // Unir as opções do array orderedOptions em uma string
      const userAnswer = orderedOptions.join(' ').trim();

      if (userAnswer === currentQuestion.correct_answer.trim()) {
        console.log('Resposta correta!');
        openModal();
        setErrorMessage('');
      } else {
        console.log('Resposta incorreta!');
        setErrorMessage('Resposta incorreta!');
      }
    } else if (currentQuestion.type === 'free_response') {
      // Lógica para questões de resposta livre
      if (!freeResponse) {
        setErrorMessage('Por favor, escreva uma resposta antes de continuar.');
        return;
      }

      const userAnswer = freeResponse.trim(); // Remove espaços em branco

      // Comparação sem considerar maiúsculas/minúsculas
      if (userAnswer.toLowerCase() === currentQuestion.correct_answer.toLowerCase().trim()) {
        console.log('Resposta correta!');
        openModal();
        setErrorMessage('');
      } else {
        console.log('Resposta incorreta!');
        setErrorMessage('Resposta incorreta!');
      }
    }
  };

  const handleOptionOrderingClick = (event: React.MouseEvent<HTMLButtonElement>, optionText: string) => {
    event.preventDefault();
    event.stopPropagation();

    // Adiciona a opção clicada à lista ordenada
    setOrderedOptions((prev) => [...prev, optionText]);

    // Remove a opção clicada da lista original
    setQuestions((prevQuestions) => {
      // Converta `options` para um array de strings usando `Object.values`
      const currentOptions = Object.values(JSON.parse(prevQuestions[currentQuestionIndex].options)) as string[];

      // Agora, podemos usar o `filter` normalmente
      const updatedOptions = currentOptions.filter((opt: string) => opt !== optionText);

      // Atualize o estado das questões com as opções filtradas
      return prevQuestions.map((q, index) =>
        index === currentQuestionIndex ? { ...q, options: JSON.stringify(updatedOptions) } : q
      );
    });

  };

  const handleRemoveOrderedOptionClick = (event: React.MouseEvent<HTMLDivElement>, optionText: string) => {
    event.preventDefault();

    // Remover a opção do orderedOptions
    setOrderedOptions((prevOrdered) => prevOrdered.filter((opt) => opt !== optionText));

    setQuestions((prevQuestions) => {
      // Recupera as opções atuais como array
      const currentOptions = JSON.parse(prevQuestions[currentQuestionIndex].options) as { [key: string]: string };

      // Adiciona a opção de volta
      const updatedOptions = { ...currentOptions, [optionText]: optionText };

      // Atualiza as perguntas com as novas opções em formato de string JSON
      return prevQuestions.map((q, index) =>
        index === currentQuestionIndex
          ? { ...q, options: JSON.stringify(updatedOptions) }
          : q
      );
    });
  };

  // Função para embaralhar um array usando Fisher-Yates
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const retornarPaginaInicial = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Previne qualquer comportamento padrão do botão
    setTimeout(() => {
      setFormAnimationClass('fade_out');
    }, 200);

    setLoading(true);

    setTimeout(() => {
      setIsFormVisible(false);
      router.push('/Home');
    }, 1000);
  }

  const resetarProgresso = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (userXp == 0 && userLevel == 1) {
      return;
    }

    setLoading(true);

    setFormAnimationClass('fade_out');

    setTimeout(() => {
      setIsFormVisible(false);
    }, 700);

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

        if (data.message == 'Progresso zerado com sucesso') {
          fetchUserXp(userId);
        }

      } catch (error) {
        console.error('Erro ao buscar as questões:', error);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      resetProgress();
      fetchQuestions();
      setActiveButtons(null);
      setFreeResponse('');
      setErrorMessage('');
    }, 800);

    setTimeout(() => {
      setIsFormVisible(true);
      setFormAnimationClass('fade_in');
    }, 1200);
  }

  const onLogOutButtonClick = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.stopPropagation();

    localStorage.removeItem('user');
    setLoggedIn(false);

    setLoading(true); // Exibe o spinner
    setTimeout(() => {
      router.push('/Login');
    }, 1000); // Simulando um tempo de delay (1 segundo)

  };

  const onHomeIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setLoading(true); // Exibe o spinner
    setTimeout(() => {
      router.push('/Home');
      setLoading(false);
    }, 1000); // Simulando um tempo de delay (1 segundo)
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      {/* Modal 3 - Sketch */}
      {modalVisible && (
        // <div id="modal-container" className={`${styles.modalContainer} ${modalAnimationClass == 'out' ? styles.out : ''} ${modalAnimationClass == 'active' ? styles.active : ''}  `}>
        <div id="modal-container" className={`${styles.modalContainer} ${styles.active} ${modalAnimationClass == 'out' ? styles.out : ''}`}>
          <div className={styles.modalBackground} onClick={() => { closeModal() }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2>Parabéns!</h2>
              <p>Certa resposta!</p>
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
              <button onClick={() => { closeModal() }}>OK</button>
            </div>
          </div>
        </div>
      )}

      {(modalLevelUpVisible && !firstAcess && userLevel != 1 && ((currentQuestionIndex > 5 && currentQuestionIndex === 6 && currentQuestionIndex < 7) || (currentQuestionIndex > 7 && currentQuestionIndex === 8  && currentQuestionIndex < 9))) && (
        <>
          <div id="modal-container" className={`${styles.modalLvlUpContainer} ${styles.active} ${modalLevelUpAnimationClass == 'out' ? styles.out : ''}`}>
            <div className={styles.firework}></div>
            <div className={styles.firework}></div>
            <div className={styles.firework}></div>

            <div className={styles.modalLevelUpBackground} onClick={() => { closeModal() }}>
              <div className={styles.modalLevelUp} onClick={(e) => e.stopPropagation()}>
                <div>
                  <h2>Parabéns! Você chegou ao nível {userLevel}</h2>
                </div>
                <div className={styles.btn_modal_level_up}>
                  <button onClick={(e) => { closeModalLevelUp(e) }}>Fechar</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={`${styles.animation_control} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
        <div className={styles.contenedor}>
          {/* <div className={`${styles.main_icon} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
            <FontAwesomeIcon
              icon="database"
            />
            <span>SQLand</span>
          </div> */}

          <div className={styles.main_icon}>
            <div className={styles.sql_icon} onClick={(e) => onHomeIconClick(e)}>
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
                  onClick={(e) => onLogOutButtonClick(e)}
                />
              </span>
            </div>
          </div>

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

              <ProgressBar currentXpProp={userXp} levelProp={userLevel} type={"exercises"} />

              <form className={`${styles.form_content} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out}`}>
                <div className={styles.btn_retorno}>
                  <button onClick={(e) => { retornarPaginaInicial(e) }}>Voltar a tela inicial</button>

                  <button className={styles.btn_2} onClick={(e) => resetarProgresso(e)}>
                    <span className={styles.btn_2_bg}>
                      <span className={styles.btn_2_bg_layers}>
                        <span className={`${styles.btn_2_bg_layer} ${styles.btn_2_bg_layer_1} ${styles._purple}`}></span>
                        <span className={`${styles.btn_2_bg_layer} ${styles.btn_2_bg_layer_2} ${styles._turquoise}`}></span>
                        <span className={`${styles.btn_2_bg_layer} ${styles.btn_2_bg_layer_3} ${styles._yellow}`}></span>
                      </span>
                    </span>
                    <span className={styles.btn_2_inner}>
                      <span className={styles.btn_2_inner_static}>Resetar progresso</span>
                      <span className={styles.btn_2_inner_hover}>Resetar progresso</span>
                    </span>
                  </button>

                </div>

                {/* {(isMounted && currentQuestionIndex != 0) && (
                  <>
                    <div className={styles.next_icon}>
                      <span id="prev">
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon="arrow-left"
                          onClick={() => onPrevButtonClick()}
                        />
                      </span>
                    </div>
                  </>
                )} */}

                <div className={`${styles.card} ${cardAnimationClass === 'slide_in_right' ? styles.slide_in_right : cardAnimationClass === 'slide_in_left' ? styles.slide_in_left : cardAnimationClass === 'slide_out_right' ? styles.slide_out_right : styles.slide_out_left}`}>
                  {currentQuestion && (
                    <h2>
                      {currentQuestionIndex + 1}ª Questão - {currentQuestion.type === "multiple_choice" ? "Múltipla Escolha" : "Organize as Palavras"}
                    </h2>
                  )}

                  {currentQuestion && (
                    <p>{currentQuestion.question_text}</p>
                  )}

                  {/* Questões de múltiplca escolha */}
                  {currentQuestion && currentQuestion.options && currentQuestion.type === 'multiple_choice' && (
                    <div className={styles.responses}>
                      {Object.entries(JSON.parse(currentQuestion.options) as { [key: string]: string }).map(([key, option]) => (
                        <button
                          key={key}
                          onClick={(event) => handleOptionClick(event, key)} // Passa a letra como parâmetro
                          className={activeButtons === key ? `${styles.option} ${styles.active}` : styles.option} // Compara a letra
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Questões de ordenação */}
                  {currentQuestion && currentQuestion.options && currentQuestion.type === 'ordering' && (
                    <>
                      <div className={styles.orderedContainer}>
                        {orderedOptions.map((option, index) => (
                          <div
                            key={index}
                            className={styles.orderedOption}
                            onClick={(event) => handleRemoveOrderedOptionClick(event, option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>

                      {currentQuestion && currentQuestion.options && (
                        <div className={styles.shuffledOptions}>
                          {shuffleArray(Object.entries(JSON.parse(currentQuestion.options) as { [key: string]: string }))
                            .map(([key, option]) => (
                              <button
                                key={key}
                                onClick={(event) => handleOptionOrderingClick(event, option)}
                                className={styles.optionSquare}
                              >
                                {option}
                              </button>
                            ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Questões de resposta livre */}
                  {currentQuestion && currentQuestion.type === 'free_response' && (
                    <div className={styles.freeResponse}>
                      <input
                        type="text" required
                        value={freeResponse}
                        onChange={(ev) => setFreeResponse(ev.target.value)}
                        onFocus={() => (setErrorMessage(''))}
                      />
                    </div>
                  )}

                  <div className={styles.errorLabel}>{errorMessage}</div>

                  <div>
                    <button className={styles.btn_1} onClick={(event) => handleValidateClick(event)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.arr_2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                        ></path>
                      </svg>
                      <span className={styles.text}>Validar</span>
                      <span className={styles.circle}></span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.arr_1}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* <div className={styles.next_icon}>
                  <span id="next" onClick={() => onNextButtonClick()}>
                    <FontAwesomeIcon className={styles.icon} icon="arrow-right" />
                  </span>
                </div> */}
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Exercises;