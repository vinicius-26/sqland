'use client'

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import Image from "next/image";

import logoPrincipal from '../../assets/images/logo_principal_2.png';
import logoSecundaria from '../../assets/images/logo_secundaria_2.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
library.add(faEye, faEyeSlash, faUser, faLock);

import { TailSpin } from 'react-loader-spinner'; // Spinner importado

import styles from './Main.module.css';

const MainLogin: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const [loading, setLoading] = useState(false); // Estado do spinner

  // Estado para controlar o efeito de transição
  const [formAnimationClass, setFormAnimationClass] = useState('');

  // Estado para controlar se o formulário já foi exibido em tela
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Estado para controlar o Modal de Cadastro
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoginModalMessage, setIsLoginModalMessage] = useState('');
  const [modalLoginAnimationClass, setModalLoginAnimationClass] = useState('');

  // Estado para controlar o Modal de Cadastro
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegisterModalMessage, setIsRegisterModalMessage] = useState('');
  const [modalRegisterAnimationClass, setModalRegisterAnimationClass] = useState('');

  // Login - Campos
  const [email, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  // Login - Erros
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Estado para controlar se exibe o input de senha ou não
  const [visible, setVisible] = useState<boolean>(false);
  const [visiblePassConfirm, setVisiblePassConfirm] = useState<boolean>(false);

  // Estado para verificar se o componente está montado no cliente
  const [isMounted, setIsMounted] = useState(false);

  // Estado para controlar login/cadastro
  const [isLogin, setIsLogin] = useState(true);

  // Cadastro - Campos
  const [newFullName, setNewFullName] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  // Cadastro - Erros
  const [newFullNameError, setNewFullNameError] = useState('');
  const [newBirthDateError, setNewBirthDateError] = useState('');
  const [newEmailError, setNewEmailError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState('');

  useEffect(() => {
    setIsMounted(true); // Componente montado no cliente
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.token) {
      router.push('/Home'); // Already logged in, redirect to home
    }

    // Animação de entrada
    setFormAnimationClass(''); // Limpa a animação antes de mudar
    setTimeout(() => {
      setIsLogin(isLogin); // Alterna entre login e cadastro
      setFormAnimationClass('fade_in'); // Adiciona o efeito de fade-in
      setIsFormVisible(true); // Exibe o formulário após o delay da animação
    }, 1000); // Pequeno delay para suavizar a transição
  }, [router]);

  useEffect(() => {
    if (isMounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; // Reverte o overflow quando a animação termina
    }
  }, [isMounted]);

  // Funções de abrir e fechar o modal de Login
  const openLoginModal = () => setIsLoginModalOpen(true);

  // Funções de abrir e fechar o modal de Cadastro
  const openRegisterModal = () => setIsRegisterModalOpen(true);

  const limparEstados = () => {
    // Login
    setEmailInput(newEmail)
    setPassword('');

    setEmailError('');
    setPasswordError('');

    // Cadastro
    setNewFullName('');
    setNewBirthDate('');
    setNewEmail('');
    setNewPassword('');
    setNewPasswordConfirm('');

    setNewFullNameError('');
    setNewBirthDateError('');
    setNewEmailError('');
    setNewPasswordError('');
    setNewPasswordConfirmError('');
  };

  // Login Clique
  const onLoginButtonClick = () => {
    setEmailError('');
    setPasswordError('');

    if (email === '') {
      setEmailError('Por favor, informe o seu email');
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Atenção! Informe um email válido');
      return;
    }

    if (password === '') {
      setPasswordError('Por favor, informe sua senha');
      return;
    }

    if (password.length < 7) {
      setPasswordError('A senha precisa ter 8 ou mais caracteres');
      return;
    }

    checkAccountExists((accountExists) => {
      if (accountExists) logIn();
      else {
        setIsLoginModalMessage(`Nenhuma conta encontrada para ${email}. Criar uma nova?`);
        openLoginModal();
      }
    });
  };

  // Função para lidar com a tecla pressionada no input
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Opcional: Previne o comportamento padrão do Enter
      onLoginButtonClick(); // Simula um clique no botão
    }
  };

  // Cadastrar Clique
  const onRegisterButtonClick = () => {
    setNewFullNameError('');
    setNewBirthDateError('');
    setNewEmailError('');
    setNewPasswordError('');
    setNewPasswordConfirmError('');

    if (newFullName === '') {
      setNewFullNameError('Por favor, informe o seu nome completo');
      return;
    }

    if (newFullName.length < 4) {
      setNewFullNameError('Nome muito curto');
      return;
    }

    if (newBirthDate === '') {
      setNewBirthDateError('Por favor, informe sua data de nascimento');
      return;
    }

    if (Date.parse(newBirthDate) > Date.now()) {
      setNewBirthDateError('Data de nascimento inválida');
      return;
    }

    if (Date.parse(newBirthDate) < Date.parse('01/01/1930')) {
      setNewBirthDateError('Data de nascimento inválida');
      return;
    }

    if (newEmail === '') {
      setNewEmailError('Por favor, informe o seu email');
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newEmail)) {
      setNewEmailError('Atenção! Informe um email válido');
      return;
    }

    if (newPassword === '') {
      setNewPasswordError('Por favor, informe sua senha');
      return;
    }

    if (newPassword.length < 7) {
      setNewPasswordError('A senha precisa ter 8 ou mais caracteres');
      return;
    }

    if (newPasswordConfirm === '') {
      setNewPasswordConfirmError('Por favor, confirme sua senha');
      return;
    }

    if (newPassword != newPasswordConfirm) {
      setNewPasswordConfirmError('As senhas devem ser iguais');
      return;
    }

    registerUser();
  };

  const checkAccountExists = (callback: (exists: boolean) => void) => {
    fetch(`${apiUrl}/check-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((r) => {
        callback(r?.userExists)
      });
  };

  const verificaPrimeiroAcesso = async (userId: Number): Promise<boolean> => {
    try {

      const id = userId;
      const response = await fetch(`${apiUrl}/verify-first-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      // Verifica a resposta e retorna o valor booleano apropriado
      if (result.message === 'Ja passou pela primeira etapa') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar o primeiro acesso:', error);
      return false; // Retorna false em caso de erro
    }
  };

  const logIn = async () => {
    try {

      const response = await fetch(`${apiUrl}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.message === 'success') {
        localStorage.setItem('user', JSON.stringify({ email, token: result.token, fullName: result.fullName, userId: result.id }));
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setLoading(true); // Exibe o spinner

        // Verifica se a pessoa já passou a primeira vez pelas primeiras task - Retorna TRUE se já passou 
        const hasAccess = await verificaPrimeiroAcesso(user.userId);

        if (hasAccess) {
          setTimeout(() => {
            router.push('/Home');
          }, 1000); // Simula um atraso (1 segundo)
        } else {
          setTimeout(() => {
            router.push('/StartPage');
          }, 1000); // Simula um atraso (1 segundo)
        }

      } else {
        setIsLoginModalMessage('Usuário e/ou senha incorretos!');
        openLoginModal();
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setIsLoginModalMessage('Ocorreu um erro durante o login. Tente novamente.');
      openLoginModal();
    }
  };

  const registerUser = () => {
    checkAccountExists((accountExists) => {
      if (accountExists) {
        setNewEmailError('Email já cadastrado');
        return;
      }
      else {
        fetch(`${apiUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: newFullName, email: newEmail, birthdate: newBirthDate, password: newPassword }),
        })
          .then((r) => r.json())
          .then((r) => {
            if (r.message === 'User registered successfully') {
              setIsRegisterModalMessage('Usuário criado com sucesso!');
              openRegisterModal();
            } else if (r.message === 'Email already registered') {
              setIsRegisterModalMessage('Email já cadastrado...');
              openRegisterModal();
            }
            else {
              setIsRegisterModalMessage('Erro ao cadastrar uma nova conta...');
              openRegisterModal();
            }
          });
      }
    });
  };

  const toggleForm = () => {
    setFormAnimationClass(''); // Limpa a animação antes de mudar
    setTimeout(() => {
      setIsLogin(!isLogin); // Alterna entre login e cadastro
      setFormAnimationClass('fade_in'); // Adiciona o efeito de fade-in
    }, 500); // Pequeno delay para suavizar a transição

    if (isLogin) {
      setEmailInput('');
      setPassword('');
    } else {
      setNewFullName('');
      setNewBirthDate('');
      setNewEmail('');
      setNewPassword('');
      setNewPasswordConfirm('');
    }
  };

  // Controlar a animação do Modal de Login
  useEffect(() => {
    if (isLoginModalOpen) {
      // Adiciona a classe de animação ao exibir o modal
      setModalLoginAnimationClass('active');
    } else {
      // Remove a animação após o fechamento
      setModalLoginAnimationClass('out');
    }
  }, [isLoginModalOpen]);

  // Fecha o Modal de Login
  const closeLoginModal = () => {
    setModalLoginAnimationClass('out');
    setTimeout(() => {

      setIsLoginModalOpen(false);

    }, 500); // O tempo deve ser igual à duração da animação
  };

  // Controlar a animação do Modal de Cadastro
  useEffect(() => {
    if (isRegisterModalOpen) {
      // Adiciona a classe de animação ao exibir o modal
      setModalRegisterAnimationClass('active');
    } else {
      // Remove a animação após o fechamento
      setModalRegisterAnimationClass('out');
    }
  }, [isRegisterModalOpen]);

  // Fecha o Modal de Login
  const closeRegisterModal = () => {
    setModalRegisterAnimationClass('out');
    setTimeout(() => {

      setIsRegisterModalOpen(false);

    }, 500); // O tempo deve ser igual à duração da animação
  };

  return (
    <>
      <div className={`${styles.animation_control} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
        <div className={`${styles.form_container} ${isLogin ? styles.login_active : styles.register_active}`}>
          <div className={`${styles.form_content} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out} `}>
            {
              loading ? (
                <div className={styles.login_form}>
                  <div className={styles.background}>
                    <div className={styles.login_background}>
                      <div className={styles.spinner_container}>
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
                    </div>
                  </div>
                </div>
              ) : (
                isLogin ? (
                  // Login
                  <>
                    <div className={styles.login_form}>
                      <div className={styles.background}>

                        {isLoginModalOpen && (
                          // <div id="modal-container" className={`${styles.modalContainer} ${modalAnimationClass == 'out' ? styles.out : ''} ${modalAnimationClass == 'active' ? styles.active : ''}  `}>
                          <div id="modal-container" className={`${styles.modalContainer} ${styles.active} ${modalLoginAnimationClass == 'out' ? styles.out : ''}`}>
                            <div className={styles.modalBackground} onClick={() => { closeLoginModal() }}>
                              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                                <p>
                                  {isLoginModalMessage}
                                </p>
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
                                {isLoginModalMessage === 'Usuário e/ou senha incorretos!' ?
                                  <div className={styles.modal_button}>
                                    <button onClick={() => { closeLoginModal() }}>Fechar</button>
                                  </div>

                                  :
                                  <>
                                    <div className={styles.modal_button}>
                                      <button onClick={() => {
                                        closeLoginModal();
                                        setNewEmail(email);
                                        toggleForm();
                                      }
                                      }>Sim</button>

                                      <button onClick={closeLoginModal}>Cancelar</button>
                                    </div>
                                  </>
                                }
                              </div>
                            </div>
                          </div>
                        )}
                        <div className={styles.login_background}>
                          <div className={styles.login_title}>
                            <h1>Bem-vindo ao SQLand</h1>
                            <p>Descubra o Mundo do SQL e Bancos de Dados</p>
                            <Image 
                              src={logoPrincipal}
                              alt="Logo"
                              className={styles.logo_principal}
                              layout="intrinsic"
                            />
                          </div>

                          <div className={styles.login_inputs}>
                            <div className={styles.input_group}>
                              <input
                                type="text" required
                                value={email}
                                onChange={(ev) => setEmailInput(ev.target.value)}
                                onFocus={() => (setEmailError(''))}
                                className={styles.inputBox}
                              />
                              <label>Email</label>
                              <div className={styles.errorLabel}>{emailError}</div>
                            </div>

                            <div className={styles.input_group}>
                              <input
                                type={visible ? "text" : "password"}
                                required
                                value={password}
                                onChange={(ev) => setPassword(ev.target.value)}
                                onFocus={() => (setPasswordError(''))}
                                className={styles.inputBox}
                                id="password"
                                onKeyDown={handleKeyDown}
                              />
                              <label>Senha</label>
                              {isMounted && (
                                <span className={styles.eye_icon}>
                                  <FontAwesomeIcon
                                    className={styles.icon}
                                    icon={visible ? "eye" : "eye-slash"}
                                    onClick={() => setVisible(!visible)}
                                  />
                                </span>
                              )}
                              <div className={styles.errorLabel}>{passwordError}</div>
                            </div>

                            <div className={styles.login_button}>
                              <input type="button" onClick={onLoginButtonClick} value="Acessar" />
                            </div>

                            <div className={styles.login_register}>
                              <p>É novo por aqui? <span onClick={toggleForm}>Criar nova conta</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) :
                  // Cadastro 
                  (
                    <>
                      <div className={styles.login_form}>
                        <div className={styles.background}>

                          {isRegisterModalOpen && (
                            // <div id="modal-container" className={`${styles.modalContainer} ${modalAnimationClass == 'out' ? styles.out : ''} ${modalAnimationClass == 'active' ? styles.active : ''}  `}>
                            <div id="modal-container" className={`${styles.modalContainer} ${styles.active} ${modalRegisterAnimationClass == 'out' ? styles.out : ''}`}>
                              <div className={styles.modalBackground} onClick={() => { closeRegisterModal() }}>
                                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                                  <p>
                                    {isRegisterModalMessage}
                                  </p>
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
                                  <div className={styles.modal_button}>
                                    <button onClick={() => {
                                      closeRegisterModal();
                                      if (isRegisterModalMessage === 'Usuário criado com sucesso!') {
                                        setIsLogin(!isLogin); // Alterna entre login e cadastro
                                        limparEstados();
                                      }
                                    }}>Fechar</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className={styles.login_background}>
                            <div className={styles.login_inputs}>
                              <p>Informe seus dados abaixo</p>

                              {/* Novo Nome Completo */}
                              <div className={styles.input_group}>
                                <input
                                  type="text" required
                                  value={newFullName}
                                  onChange={(ev) => setNewFullName(ev.target.value)}
                                  onFocus={() => (setNewFullNameError(''))}
                                  className={styles.inputBox}
                                />
                                <label>Nome completo</label>
                                <div className={styles.errorLabel}>{newFullNameError}</div>
                              </div>

                              {/* Nova Data de Nascimento */}
                              <div className={styles.input_group_birthdate}>
                                <input
                                  type="date" required
                                  value={newBirthDate}
                                  onChange={(ev) => setNewBirthDate(ev.target.value)}
                                  onFocus={() => (setNewBirthDateError(''))}
                                  className={styles.inputBox}
                                />
                                <label>Data de nascimento</label>
                                <div className={styles.errorLabel}>{newBirthDateError}</div>
                              </div>

                              {/* Novo email */}
                              <div className={styles.input_group}>
                                <input
                                  type="text" required
                                  value={newEmail}
                                  onChange={(ev) => setNewEmail(ev.target.value)}
                                  onFocus={() => (setNewEmailError(''))}
                                  className={styles.inputBox}
                                />
                                <label>Email</label>
                                <div className={styles.errorLabel}>{newEmailError}</div>
                              </div>

                              {/* Nova senha */}
                              <div className={styles.input_group}>
                                <input
                                  type={visible ? "text" : "password"}
                                  required
                                  value={newPassword}
                                  onChange={(ev) => setNewPassword(ev.target.value)}
                                  onFocus={() => (setNewPasswordError(''))}
                                  className={styles.inputBox}
                                />
                                <label>Senha</label>
                                {isMounted && (
                                  <span className={styles.eye_icon}>
                                    <FontAwesomeIcon
                                      className={styles.icon}
                                      icon={visible ? "eye" : "eye-slash"}
                                      onClick={() => setVisible(!visible)}
                                    />
                                  </span>
                                )}
                                <div className={styles.errorLabel}>{newPasswordError}</div>
                              </div>

                              {/* Confirmar senha */}
                              <div className={styles.input_group}>
                                <input
                                  type={visiblePassConfirm ? "text" : "password"}
                                  required
                                  value={newPasswordConfirm}
                                  onChange={(ev) => setNewPasswordConfirm(ev.target.value)}
                                  onFocus={() => (setNewPasswordConfirmError(''))}
                                  className={styles.inputBox}
                                />
                                <label>Confirmar a senha</label>
                                {isMounted && (
                                  <span className={styles.eye_icon}>
                                    <FontAwesomeIcon
                                      className={styles.icon}
                                      icon={visiblePassConfirm ? "eye" : "eye-slash"}
                                      onClick={() => setVisiblePassConfirm(!visiblePassConfirm)}
                                    />
                                  </span>
                                )}
                                <div className={styles.errorLabel}>{newPasswordConfirmError}</div>
                              </div>

                              <div className={styles.login_button}>
                                <input type="button" onClick={onRegisterButtonClick} value="Criar conta" />
                              </div>

                              <div className={styles.login_register}>
                                <p>Já possui uma conta? <span onClick={toggleForm}>Acessar o site</span></p>
                              </div>
                            </div>

                            <div className={styles.register_title}>
                              <h1>Cadastrar uma nova conta</h1>
                              <p>Que bom que você irá se juntar ao SQLand!</p>
                              <Image className={styles.register_img}
                                src={logoSecundaria}
                                alt="Logo"
                                // className="object-cover cursor-pointer"
                                layout="intrinsic"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLogin;