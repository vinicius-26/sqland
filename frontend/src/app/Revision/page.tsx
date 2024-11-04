'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TailSpin } from 'react-loader-spinner'; // Spinner importado


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faArrowLeft, faKeyboard, faDatabase, faList, faStore, faCircleQuestion, faRotate } from '@fortawesome/free-solid-svg-icons';
library.add(faArrowRight, faArrowLeft, faKeyboard, faDatabase, faList, faStore, faCircleQuestion, faRotate);

import styles from './styles.module.css';
import { Header } from '@/components/Header/Header';

const Revision: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const [revisions, setRevisions] = useState<any[]>([]);

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

  const [currentRevisionIndex, setCurrentRevisionIndex] = useState(0);

  // Estado para controlar o Modal de Lista de Compras
  const [modalListaComprasVisible, setModalListaComprasVisible] = useState(false);
  const [modalListaComprasAnimationClass, setModalListaComprasAnimationClass] = useState('');

  // Estado para controlar o Modal de Estoque de Mercado
  const [modalEstoqueMercadoVisible, setModalEstoqueMercadoVisible] = useState(false);
  const [modalEstoqueMercadoAnimationClass, setModalEstoqueMercadoAnimationClass] = useState('');

  // Estado para controlar o Modal dos comandos SELECT
  const [modalSelectVisible, setModalSelectVisible] = useState(false);
  const [modalSelectAnimationClass, setModalSelectAnimationClass] = useState('');
  const [modalSelectValue, setModalSelectValue] = useState('');

  const [modalDicaVisible, setModalDicaVisible] = useState(false);
  const [modalDicaAnimationClass, setModalDicaAnimationClass] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  // Estados para controlar os dados exibidos na revisão de insert
  const [productsInsertSessions, setProductsInsertSessions] = useState([
    { id: 1, name: 'Maçã', category: 'Frutas', quantity: 50, price: 2.5 },
    { id: 2, name: 'Bananas', category: 'Frutas', quantity: 30, price: 1.2 }
    // { id: 3, name: 'Peito de Frango', category: 'Carnes', quantity: 20, price: 7.99 },
    // { id: 4, name: 'Leite', category: 'Laticínios', quantity: 40, price: 3.1 },
    // { id: 5, name: 'Pão', category: 'Padaria', quantity: 15, price: 2.8 }
  ]);

  // Estados para controlar os dados exibidos na revisão de update
  const [productsUpdateSessions, setProductsUpdateSessions] = useState([
    { id: 1, name: 'Maçã', category: 'Frutas', quantity: 50, price: 2.5 },
    { id: 2, name: 'Bananas', category: 'Frutas', quantity: 30, price: 1.2 },
    { id: 3, name: 'Peito de Frango', category: 'Carnes', quantity: 20, price: 7.99 }
  ]);

  const [whereUpdate, setWhereUpdate] = useState('');
  const [whereDelete, setWhereDelete] = useState('');
  const [idDelete, setIdDelete] = useState('');

  // Estados para controlar os dados exibidos na revisão de update
  const [productsDeleteSessions, setProductsDeleteSessions] = useState([
    { id: 1, name: 'Maçã', category: 'Frutas', quantity: 50, price: 2.5 },
    { id: 2, name: 'Bananas', category: 'Frutas', quantity: 30, price: 1.2 },
    { id: 3, name: 'Peito de Frango', category: 'Carnes', quantity: 20, price: 7.99 }
  ]);

  // Estados para controlar os dados informados na revisão de insert
  const [nomeProduto, setNomeProduto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valor, setValor] = useState('');

  const [primeiroAcesso, setPrimeiroAcesso] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Componente montado no cliente

    // localStorage.setItem('user', JSON.stringify({ email: 'vistephano123@gmail.com', token: '123' }));
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.email) {
      setEmail(user.email);
      setUserId(user.userId);
      setLoggedIn(true);

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

  useEffect(() => {
    const fetchRevisions = async () => {
      setLoading(true);
      try {

        const response = await fetch(`${apiUrl}/revisions`, { method: 'POST' });
        const data = await response.json();

        setRevisions(data.existingRevision);  // Set the questions from the API
      } catch (error) {
        console.error('Erro ao buscar as revisões:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevisions();
    setModalListaComprasVisible(false);
    setModalEstoqueMercadoVisible(false);
    setModalSelectVisible(false);
    setModalDicaVisible(false);

    setPrimeiroAcesso(false);
  }, []);

  const onNextButtonClick = () => {
    setErrorMessage('');

    setCardAnimationClass('slide_out_left');

    setTimeout(() => {
      setCurrentRevisionIndex(currentRevisionIndex + 1);
      setCardAnimationClass('slide_in_right');
    }, 500);

    // setTimeout(() => {
    //   if (currentRevisionIndex === 2 && !primeiroAcesso) {
    //     openModal('dica');
    //     setPrimeiroAcesso(true);
    //   }
    // }, 950);
  };

  const onPrevButtonClick = () => {
    setErrorMessage('');

    if (currentRevisionIndex > 0) {
      setCardAnimationClass('slide_out_right');

      setTimeout(() => {
        setCurrentRevisionIndex(currentRevisionIndex - 1);
        setCardAnimationClass('slide_in_left');
      }, 500);
    }
  };

  const handleValidateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (currentRevisionIndex < 6) {
      onNextButtonClick();
    } else {

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

      setTimeout(() => {
        setFormAnimationClass('fade_out');
      }, 200);

      setLoading(true);

      setTimeout(() => {
        setIsFormVisible(false);
        resetProgress();
        router.push('/Exercises');
      }, 1000);
    }

  }

  const openModal = (modal: string) => {
    if (modal == 'lista_compras') {
      setModalListaComprasVisible(true);
      setModalListaComprasAnimationClass('active');
    } else if (modal == 'estoque_mercado') {
      setModalEstoqueMercadoVisible(true);
      setModalEstoqueMercadoAnimationClass('active');
    } else if (modal == 'comando_select') {
      setModalSelectVisible(true);
      setModalSelectAnimationClass('active');
    } else if (modal == 'dica') {
      setModalDicaVisible(true);
      setModalDicaAnimationClass('active');
    }
  };

  const closeModal = (modal: string) => {

    // Lista de compras
    if (modal == 'lista_compras') {
      setModalListaComprasAnimationClass('out');
      setTimeout(() => {

        setModalListaComprasVisible(false);

      }, 650);
    }
    // Estoque de mercado
    else if (modal == 'estoque_mercado') {
      setModalEstoqueMercadoAnimationClass('out');
      setTimeout(() => {

        setModalEstoqueMercadoVisible(false);

      }, 650);
    }
    // Comando SELECT
    else if (modal == 'comando_select') {
      setModalSelectAnimationClass('out');
      setTimeout(() => {

        setModalSelectVisible(false);

      }, 650);
    }
    // DICA
    else if (modal == 'dica') {
      setModalDicaAnimationClass('out');
      setTimeout(() => {

        setModalDicaVisible(false);

      }, 650);
    }
  };

  const retornarPaginaInicial = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Previne qualquer comportamento padrão do botão
    setTimeout(() => {
      setFormAnimationClass('fade_out');
    }, 200);

    setTimeout(() => {
      setIsFormVisible(false);
      router.push('/Home');
    }, 1000);
  }

  const insereDadosNoEstado = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (productsInsertSessions.length == 3) {
      setErrorMessage('Restaure a tabela para testar o comando novamente...');
      return;
    }

    if (!nomeProduto || !categoria || !quantidade || !valor) {
      setErrorMessage('Informe os valores corretamente para testar o comando...');
      return;
    }

    // Obter o último ID da lista de produtos, caso a lista não esteja vazia
    const ultimoId = productsInsertSessions.length > 0
      ? productsInsertSessions[productsInsertSessions.length - 1].id
      : 0;

    const novoProduto = {
      id: ultimoId + 1,
      name: nomeProduto,
      category: categoria,
      quantity: Number(quantidade),  // Convertendo para número
      price: Number(valor)         // Convertendo para número
    };

    if (novoProduto.id <= 5) {
      // Atualiza o estado com os produtos antigos e o novo produto
      setProductsInsertSessions((prevProducts) => [
        ...prevProducts,
        novoProduto
      ]);
    }
  };

  const handleClickTestUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!whereUpdate) {
      setProductsUpdateSessions((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,  // Mantém as outras propriedades inalteradas
          name: 'Pão'   // Atualiza o campo name
        }))
      );
    } else {
      setProductsUpdateSessions((prevProducts) =>
        prevProducts.map((product) =>
          product.id === 2
            ? { ...product, name: 'Pão' }  // Se o ID for 2, altera o campo name para "Pão"
            : product                      // Caso contrário, mantém o item inalterado
        )
      );
    }
  };

  const handleClickTestDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (Number(idDelete) < 1 || Number(idDelete) > 3) {
      setErrorMessage('Informe um ID da tabela para testar o comando...');
      return;
    }

    if (!whereDelete) {
      setProductsDeleteSessions([]); // Limpa o estado, simulando o DELETE completo
    } else {
      setProductsDeleteSessions((prevProducts) =>
        prevProducts.filter((product) => product.id !== Number(idDelete)) // Agora filtra corretamente para remover o ID 3
      );
    }
  };

  const retornaEstadoInicialInsert = () => {
    setProductsInsertSessions([
      { id: 1, name: 'Maçã', category: 'Frutas', quantity: 50, price: 2.5 },
      { id: 2, name: 'Bananas', category: 'Frutas', quantity: 30, price: 1.2 }
    ]);
  };

  const retornaEstadoInicialUpdate = () => {
    setProductsUpdateSessions([
      { id: 1, name: 'Maçã', category: 'Frutas', quantity: 50, price: 2.5 },
      { id: 2, name: 'Bananas', category: 'Frutas', quantity: 30, price: 1.2 },
      { id: 3, name: 'Peito de Frango', category: 'Carnes', quantity: 20, price: 7.99 }
    ]);
  };

  const retornaEstadoInicialDelete = () => {
    setProductsDeleteSessions([
      { id: 1, name: 'Maçã', category: 'Frutas', quantity: 50, price: 2.5 },
      { id: 2, name: 'Bananas', category: 'Frutas', quantity: 30, price: 1.2 },
      { id: 3, name: 'Peito de Frango', category: 'Carnes', quantity: 20, price: 7.99 }
    ]);
  };


  const products = [
    { id: 1, name: 'Maça', category: 'Frutas', quantity: 50, price: 2.5 },
    { id: 2, name: 'Bananas', category: 'Frutas', quantity: 30, price: 1.2 },
    { id: 3, name: 'Peito de Frango', category: 'Carnes', quantity: 20, price: 7.99 },
    { id: 4, name: 'Leite', category: 'Laticínios', quantity: 40, price: 3.1 },
    { id: 5, name: 'Pão', category: 'Padaria', quantity: 15, price: 2.8 }
  ];

  const currentRevision = revisions[currentRevisionIndex];

  // Calcula a porcentagem da barra de progresso
  const progressPercentage = ((currentRevisionIndex + 1) / 7) * 100;

  return (
    <>
      {/* Modal Lista de Compras */}
      {modalListaComprasVisible && (
        <div id="modal-container" className={`${styles.modalContainer} ${styles.active} ${modalListaComprasAnimationClass == 'out' ? styles.out : ''}`}>
          <div className={styles.modalBackground} onClick={() => { closeModal('lista_compras') }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2>Lista de mercado</h2>
              <p>Banco de dados analógico</p>

              <div className={styles.lista_mercado}>
                <p>Arroz</p>
                <p>Feijão</p>
                <p>Óleo</p>
                <p>Detergente</p>
                <p>Papel Higiêncio</p>
                <p>Banana</p>
                <p>Maça</p>
                <p>Refrigerante</p>
                <p>Shampoo</p>
              </div>

              <button onClick={() => { closeModal('lista_compras') }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Estoque de Mercado */}
      {modalEstoqueMercadoVisible && (
        <div id="modal-container" className={`${styles.modalContainer} ${styles.active} ${modalEstoqueMercadoAnimationClass == 'out' ? styles.out : ''}`}>
          <div className={styles.modalBackground} onClick={() => { closeModal('estoque_mercado') }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.tableContainer}>
                <h2>Estoque de Mercado</h2>
                <table className={styles.stockTable}>
                  <thead>
                    <tr>
                      <th>ID_Produto</th>
                      <th>Nome_Produto</th>
                      <th>Categoria</th>
                      <th>Quantidade</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.quantity}</td>
                        <td>{product.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button onClick={() => { closeModal('estoque_mercado') }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Comandos SELECT */}
      {modalSelectVisible && (
        <div id="modal-container" className={`${styles.modalContainer} ${styles.active} ${modalSelectAnimationClass == 'out' ? styles.out : ''}`}>
          <div className={styles.modalBackground} onClick={() => { closeModal('comando_select') }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>


              {modalSelectValue && <h2>{(modalSelectValue == 'PRODUTOS_INSERT' || modalSelectValue == 'PRODUTOS_UPDATE' || modalSelectValue == 'PRODUTOS_DELETE') ? 'PRODUTOS' : modalSelectValue} {modalSelectValue == 'WHERE_DELETE' && 'WHERE'}</h2>}

              {/* SELECT */}
              {modalSelectValue == 'SELECT' &&
                <p>O comando 'SELECT' é responsável por dizer ao banco de dados que queremos <strong>recuperar</strong> as informações armazenadas em determinado local do banco. Na tradução do inglês: "selecione", "selecionar", "escolher".</p>
              }

              {modalSelectValue == '*' &&
                <p>O caracter * diz ao banco de dados que queremos recuperar <strong>TODAS</strong> as colunas daquela tabela. Poderia ser substituído, por exemplo, por "SELECT <strong>NOME_DO_PRODUTO</strong>, <strong>CATEGORIA</strong> FROM PRODUTOS;" dessa forma, o banco de dados exibiria apenas os dados das duas colunas, ao invés de todas.</p>
              }

              {modalSelectValue == 'FROM' &&
                <p>É uma forma de dizer para o banco de dados de <strong>ONDE</strong> ele deve trazer as informações, ou seja, em qual local ele deve realizar a busca. <br /> <br /> Traduzindo: "SELECT" (<strong>SELECIONE</strong>) "*" (<strong>TODAS AS COLUNAS</strong>) "FROM" (<strong>DE</strong>) [...] </p>
              }

              {modalSelectValue == 'PRODUTOS' &&
                <p>Este trecho tem a função de finalizar o comando ao banco de dados. Nele é dito em qual local o banco deve realizar a busca, neste caso é o <strong>NOME</strong> da tabela: 'PRODUTOS'. <br /> <br /> "SELECT" (<strong>SELECIONE</strong>) "*" (<strong>TODAS AS COLUNAS</strong>) "FROM" (<strong>DA</strong>) "PRODUTOS" (<strong>TABELA PRODUTOS</strong>)</p>
              }

              {/* INSERT */}
              {modalSelectValue == 'INSERT INTO' &&
                <p>Ao usar este comando estamos dizendo para o banco de dados o seguinte: "INSIRA EM".</p>
              }

              {modalSelectValue == 'PRODUTOS_INSERT' &&
                <p>Este trecho tem a função de informar ao banco de dados em qual tabela os dados serão inseridos. <br /> <br /> "INSERT INTO" (<strong>INSIRA EM</strong>) "PRODUTOS" (<strong>TABELA PRODUTOS</strong>)</p>
              }

              {modalSelectValue == '(NOME_PRODUTO, CATEGORIA, QUANTIDADE, VALOR)' &&
                <p>Este ponto do comando sinaliza para o banco de dados quais campos serão preenchidos com os respectivos dados que virão a seguir do comando VALUES. <br /> <br /> "INSERT INTO" (<strong>INSIRA EM</strong>) "PRODUTOS" (<strong>TABELA PRODUTOS</strong>) "(NOME_PRODUTO, CATEGORIA, [...])" (<strong>DENTRO DOS CAMPOS: NOME_PRODUTO, CATEGORIA, [...]</strong>)</p>
              }

              {modalSelectValue == 'VALUES' &&
                <p>A partir daqui, estaremos informando para o banco, quais <strong>valores</strong> serão armazenados nos respectivos campos que foram informados no comando. <br /> <br /> "INSERT INTO" (<strong>INSIRA EM</strong>) "PRODUTOS" (<strong>TABELA PRODUTOS</strong>) "(NOME_PRODUTO, CATEGORIA, [...])" (<strong>DENTRO DOS CAMPOS: NOME_PRODUTO, CATEGORIA, [...]</strong>) "VALUES ([...])" (<strong>OS SEGUINTES VALORES: [...]</strong>)</p>
              }

              {/* UPDATE */}
              {modalSelectValue == 'UPDATE' &&
                <p>Este comando dirá para o banco de dados o seguinte: <strong>ATUALIZE</strong> determinado valor. Na tradução do inglês: "atualizar" ou "atualize".</p>
              }

              {modalSelectValue == 'PRODUTOS_UPDATE' &&
                <p>A palavra "PRODUTOS", ou seja, que vem a seguir do comando UPDATE, serve para dizermos ao banco de dados em qual <strong>tabela</strong> gostaríamos que a <strong>atualização</strong> dos dados seja feita. <br /> <br /> "UPDATE" (<strong>ATUALIZE</strong>) "PRODUTOS" (<strong>A TABELA PRODUTOS</strong>)</p>
              }

              {modalSelectValue == "SET NOME_PRODUTO = 'Pão'" &&
                <p>Neste contexto "SET" significa <strong>DEFINA</strong> e a palavra a seguir "NOME_PRODUTO" é o nome do campo (coluna) cujo valor será atualizado. O que vier após o sinal de "=" é o que gostaríamos que o valor daquele campo receba após execução do comando. <br /> <br /> <br /> "UPDATE" (<strong>ATUALIZE</strong>) "PRODUTOS" (<strong>A TABELA PRODUTOS</strong>) "SET" (<strong>DEFINA</strong>) "NOME_PRODUTO" (<strong>O CAMPO "NOME_PRODUTO"</strong>) "=" (<strong>COMO</strong>) "'Pão'" (<strong>'Pão'</strong>) <br /><br /> <br /><strong>Importante:</strong> Se neste ponto <strong>não</strong> utilizarmos uma cláusula WHERE ('onde') corretamente, <strong>TODOS</strong> os registros serão afetados pelo comando UPDATE. Você pode fazer um teste utilizando o botão <strong>"Testar Comando"</strong>, sem utilizar a cláusula WHERE, o efeito ocorrerá na tabela abaixo.</p>
              }

              {modalSelectValue == 'WHERE' &&
                <p>A cláusula <strong>WHERE</strong> é usada para <strong>filtrar</strong> registros. Ela é utilizada para recuperar/alterar apenas os registros que atendem a uma condição especificada. <br /> <br /> <br /> "UPDATE" (<strong>ATUALIZE</strong>) "PRODUTOS" (<strong>A TABELA PRODUTOS</strong>) "SET" (<strong>DEFINA</strong>) "NOME_PRODUTO" (<strong>O CAMPO "NOME_PRODUTO"</strong>) "=" (<strong>COMO</strong>) "'Pão'" (<strong>'Pão'</strong>) "WHERE ID_PRODUTO = 2" (<strong>ONDE O VALOR DE ID_PRODUTO SEJA IGUAL A 2</strong>)</p>
              }

              {/* DELETE */}
              {modalSelectValue == 'DELETE FROM' &&
                <p>A palavra "DELETE" neste contexto significa literalmente <strong>REMOVA</strong>. Já a palavra "FROM" aprendemos no comando SELECT que ela serve para dizermos ao banco aonde ele fará a remoção dos dados, ou seja, em qual tabela. <br /> <br /> "DELETE" (<strong>REMOVA</strong>) "FROM" (<strong>DE</strong>)</p>
              }

              {modalSelectValue == "PRODUTOS_DELETE" &&
                <p>A palavra "PRODUTOS", que vem a seguir do comando FROM, como já aprendemos antes, serve para dizermos ao banco de dados em qual <strong>tabela</strong> gostaríamos que a <strong>remoção</strong> dos dados seja feita. <br /> <br /> "DELETE" (<strong>REMOVA</strong>) "FROM" (<strong>DE</strong>) "PRODUTOS" (<strong>TABELA 'PRODUTOS'</strong>)</p>
              }

              {modalSelectValue == 'WHERE_DELETE' &&
                <p>Como também já aprendemos antes, a cláusula <strong>WHERE</strong> é usada para <strong>filtrar</strong> registros. Ela pode ser utilizada tanto em DELETES e UPDATES como também em SELECT's. <br /> <br /> <br /> "DELETE" (<strong>REMOVA</strong>) "FROM" (<strong>DE</strong>) "PRODUTOS" (<strong>TABELA 'PRODUTOS'</strong>) "WHERE ID_PRODUTO = 1" (<strong>ONDE  O VALOR DE ID_PRODUTO SEJA IGUAL A 1</strong>)<br /><br /> <br /><strong>Importante:</strong> Assim como aprendemos anteriormente, se <strong>não</strong> utilizarmos uma cláusula WHERE ('onde') corretamente, <strong>TODOS</strong> os registros serão afetados pelo comando DELETE. Neste caso, todos os registros da tabela referida serão <strong>excluídos</strong> permanentemente.</p>
              }

              <button onClick={() => { closeModal('comando_select') }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dica */}
      {modalDicaVisible && (
        <div id="modal-container" className={`${styles.modalContainer} ${styles.active} ${modalDicaAnimationClass == 'out' ? styles.out : ''}`}>
          <div className={styles.modalBackground} onClick={() => { closeModal('dica') }}>
            <div className={styles.modalDica} onClick={(e) => e.stopPropagation()}>
              <h2>Dica</h2>
              <p>Clique sobre os comandos SQL para obter explicações específicas sobre cada um.</p>

              <button onClick={() => { closeModal('dica') }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      <div className={`${styles.animation_control} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
        <div className={styles.contenedor}>
          {/* Barra de Progresso */}
          <div className={`${styles.progress_bar_container} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
            <div
              className={styles.progress_bar}
              style={{ width: `${progressPercentage}%` }} // Atualiza a largura dinamicamente
            ></div>
          </div>

          {/* <div className={`${styles.main_icon} ${formAnimationClass == 'fade_in' ? styles.fade_in : styles.fade_out} ${isFormVisible ? styles.fade_in : styles.hidden}`}>
            <FontAwesomeIcon
              icon="database"
            />
            <span>SQLand</span>
          </div> */}

          <Header color="purple_dark" />

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
                {/* Icone de Voltar */}
                {(isMounted) && (
                  <>
                    <div className={`${styles.next_icon} ${cardAnimationClass === 'slide_in_right' ? styles.slide_in_right : cardAnimationClass === 'slide_in_left' ? styles.slide_in_left : cardAnimationClass === 'slide_out_right' ? styles.slide_out_right : styles.slide_out_left} ${currentRevisionIndex === 0 && styles.hidden_visibility}`}>
                      <span id="prev">
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon="arrow-left"
                          onClick={() => onPrevButtonClick()}
                        />
                      </span>
                    </div>
                  </>
                )}

                <div className={`${styles.card} ${cardAnimationClass === 'slide_in_right' ? styles.slide_in_right : cardAnimationClass === 'slide_in_left' ? styles.slide_in_left : cardAnimationClass === 'slide_out_right' ? styles.slide_out_right : styles.slide_out_left}`}>

                  {/* Titulo */}
                  <div className={styles.card_title}>
                    {currentRevision && (
                      <h2>
                        {currentRevision.title}
                      </h2>
                    )}
                    {(currentRevision && currentRevisionIndex) >= 3 &&
                      <FontAwesomeIcon
                        className={`${styles.icon_dica} ${(currentRevision && currentRevisionIndex) == 3 && styles.anim_pulse} `}
                        icon="circle-question"
                        onClick={() => { openModal('dica') }}
                      />}
                  </div>

                  <div className={styles.card_content}>

                    {currentRevision && currentRevision.revision_text ? (
                      <div className={styles.card_text}>
                        <p dangerouslySetInnerHTML={{
                          __html: currentRevision.revision_text.replace(/coleção de informações armazenadas como dados em um sistema de computador/g, "<strong>coleção de informações armazenadas como dados em um sistema de computador</strong>").replace(/Mas/g, "<br/> <br/> Mas")
                        }}>
                        </p>
                      </div>
                    ) : null}

                    {/* Icones e Botões */}
                    <div className={styles.card_icons_buttons}>

                      {/* Icones da revisão 1 */}
                      {(currentRevision && currentRevisionIndex === 0) && (
                        <>
                          <div>
                            <FontAwesomeIcon
                              className={styles.icon}
                              icon="list"
                            />
                            <br />
                            <span onClick={() => { openModal('lista_compras') }}>Ver lista de compras</span>
                          </div>
                          <div>
                            <FontAwesomeIcon
                              className={styles.icon}
                              icon="store"
                            />
                            <br />
                            <span onClick={() => { openModal('estoque_mercado') }}>Ver estoque de um mercado</span>
                          </div>
                        </>
                      )}

                      {/* Icones da revisão 4 */}
                      {(currentRevision && currentRevisionIndex === 3) && (
                        <>
                          <div className={styles.selectRevisionComands}>
                            <div className={styles.selectComand}>
                              <p><span onClick={() => { openModal('comando_select'); setModalSelectValue('SELECT'); }}>SELECT</span>  <span onClick={() => { openModal('comando_select'); setModalSelectValue('*'); }}>*</span> <span onClick={() => { openModal('comando_select'); setModalSelectValue('FROM'); }}>FROM</span> <span onClick={() => { openModal('comando_select'); setModalSelectValue('PRODUTOS'); }}>PRODUTOS</span>;</p>
                            </div>
                            <div className={styles.tableSelectRevision}>
                              <table className={styles.stockTableSelectRevision}>
                                <thead>
                                  <tr>
                                    <th>ID_Produto</th>
                                    <th>Nome_Produto</th>
                                    <th>Categoria</th>
                                    <th>Quantidade</th>
                                    <th>Valor</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>1</td>
                                    <td>Maça</td>
                                    <td>Frutas</td>
                                    <td>50</td>
                                    <td>2.50</td>
                                  </tr>
                                  <tr>
                                    <td>...</td>
                                    <td>...</td>
                                    <td>...</td>
                                    <td>...</td>
                                    <td>...</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Icones da revisão 5 */}
                      {(currentRevision && currentRevisionIndex === 4) && (
                        <>
                          <div className={styles.insertRevisionComands}>
                            <div className={styles.insertComand}>
                              <p></p>
                              <p>
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue('INSERT INTO'); }}>INSERT INTO</span>&nbsp;
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue('PRODUTOS_INSERT'); }}>PRODUTOS</span>&nbsp;
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue('(NOME_PRODUTO, CATEGORIA, QUANTIDADE, VALOR)'); }}>(NOME_PRODUTO, CATEGORIA, QUANTIDADE, VALOR)</span>&nbsp;
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue('VALUES'); }}>VALUES</span>&nbsp;(
                                <input type="text" required value={nomeProduto} onChange={(ev) => setNomeProduto(ev.target.value)} onFocus={() => { setErrorMessage('') }} /> <span> , </span>
                                <input type="text" required value={categoria} onChange={(ev) => setCategoria(ev.target.value)} onFocus={() => { setErrorMessage('') }} /> <span> , </span>
                                <input type="number" required value={quantidade} onChange={(ev) => setQuantidade(ev.target.value)} onFocus={() => { setErrorMessage('') }} /> <span> , </span>
                                <input type="number" required value={valor} onChange={(ev) => setValor(ev.target.value)} onFocus={() => { setErrorMessage('') }} /> )
                              </p>

                              <div className={styles.insert_test_commands}>
                                <button onClick={(e) => { insereDadosNoEstado(e) }}>Testar Comando</button>

                                <div className={styles.icon_reset}>

                                  <FontAwesomeIcon
                                    icon="rotate"
                                    onClick={() => { retornaEstadoInicialInsert(); }}
                                  />
                                  <p>Restaurar tabela</p>
                                </div>
                              </div>

                              <p></p>

                            </div>
                            <div className={styles.tableSelectRevision}>
                              <table className={styles.stockTableSelectRevision}>
                                <thead>
                                  <tr>
                                    <th>ID_Produto</th>
                                    <th>Nome_Produto</th>
                                    <th>Categoria</th>
                                    <th>Quantidade</th>
                                    <th>Valor</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {productsInsertSessions.map((product) => (
                                    <tr key={product.id}>
                                      <td>{product.id}</td>
                                      <td>{product.name}</td>
                                      <td>{product.category}</td>
                                      <td>{product.quantity}</td>
                                      <td>{product.price.toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* <div className={styles.subtitulo}>
                              <span onClick={() => { retornaEstadoInicialInsert(); }}>Retornar tabela para o estado inicial</span>
                            </div> */}
                          </div>
                        </>
                      )}

                      {/* Icones da revisão 6 */}
                      {(currentRevision && currentRevisionIndex === 5) && (
                        <>
                          <div className={styles.updateRevisionComands}>
                            <div className={styles.updateComand}>
                              <p></p>
                              <p>
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue('UPDATE'); }}>UPDATE</span>&nbsp;
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue('PRODUTOS_UPDATE'); }}>PRODUTOS</span>&nbsp;
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue("SET NOME_PRODUTO = 'Pão'"); }}>SET NOME_PRODUTO = 'Pão'</span>&nbsp;
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue('WHERE'); }}>{whereUpdate}</span>
                              </p>

                              <p></p>

                              <div className={styles.insert_test_commands}>
                                <button onClick={(e) => { handleClickTestUpdate(e) }}>Testar Comando</button>
                                {!whereUpdate ? <span onClick={() => { setWhereUpdate("WHERE ID_PRODUTO = '2' "); }}>Adicionar cláuscula WHERE</span> : <span onClick={() => { setWhereUpdate('') }}>Remover cláuscula WHERE</span>}

                                <div className={styles.icon_reset}>
                                  <FontAwesomeIcon
                                    icon="rotate"
                                    onClick={() => { retornaEstadoInicialUpdate(); }}
                                  />
                                  <p>Restaurar tabela</p>
                                </div>
                              </div>

                              <p></p>

                              {/* <button onClick={(e) => { handleClickTestUpdate(e) }}>Testar Comando</button>
                              {!whereUpdate ? <span onClick={() => { setWhereUpdate("WHERE ID_PRODUTO = '2' "); }}>Adicionar cláuscula WHERE</span> : <span onClick={() => { setWhereUpdate('') }}>Remover cláuscula WHERE</span>} */}

                            </div>
                            <div className={styles.tableSelectRevision}>
                              <table className={styles.stockTableSelectRevision}>
                                <thead>
                                  <tr>
                                    <th>ID_Produto</th>
                                    <th>Nome_Produto</th>
                                    <th>Categoria</th>
                                    <th>Quantidade</th>
                                    <th>Valor</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {productsUpdateSessions.map((product) => (
                                    <tr key={product.id}>
                                      <td>{product.id}</td>
                                      <td>{product.name}</td>
                                      <td>{product.category}</td>
                                      <td>{product.quantity}</td>
                                      <td>{product.price.toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* <div className={styles.subtitulo}>
                              <span onClick={() => { retornaEstadoInicialUpdate(); }}>Retornar tabela para o estado inicial</span>
                            </div> */}
                          </div>
                        </>
                      )}

                      {/* Icones da revisão 7 */}
                      {(currentRevision && currentRevisionIndex === 6) && (
                        <>
                          <div className={styles.updateRevisionComands}>
                            <div className={styles.updateComand}>
                              <p></p>

                              <p>
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue('DELETE FROM'); }}>DELETE FROM</span>&nbsp;
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue('PRODUTOS_DELETE'); }}>PRODUTOS</span>&nbsp;
                                <span onClick={() => { openModal('comando_select'); setModalSelectValue('WHERE_DELETE'); }}>{whereDelete}</span>&nbsp;{whereDelete && <input type="number" required value={idDelete} min='1' max='3' onChange={(ev) => setIdDelete(ev.target.value)} onFocus={() => { setErrorMessage('') }} />}
                              </p>

                              <p></p>

                              <div className={styles.insert_test_commands}>
                                <button onClick={(e) => { handleClickTestDelete(e) }}>Testar Comando</button>
                                {!whereDelete ? <span onClick={() => { setWhereDelete("WHERE ID_PRODUTO =  "); }}>Adicionar cláuscula WHERE</span> : <span onClick={() => { setWhereDelete('') }}>Remover cláuscula WHERE</span>}

                                <div className={styles.icon_reset}>
                                  <FontAwesomeIcon
                                    icon="rotate"
                                    onClick={() => { retornaEstadoInicialDelete(); }}
                                  />
                                  <p>Restaurar tabela</p>
                                </div>
                              </div>

                              {/* <button onClick={(e) => { handleClickTestDelete(e) }}>Testar Comando</button>
                              {!whereDelete ? <span onClick={() => { setWhereDelete("WHERE ID_PRODUTO =  "); }}>Adicionar cláuscula WHERE</span> : <span onClick={() => { setWhereDelete('') }}>Remover cláuscula WHERE</span>} */}

                              <p></p>
                            </div>

                            <div className={styles.tableSelectRevision}>
                              <table className={styles.stockTableSelectRevision}>
                                <thead>
                                  <tr>
                                    <th>ID_Produto</th>
                                    <th>Nome_Produto</th>
                                    <th>Categoria</th>
                                    <th>Quantidade</th>
                                    <th>Valor</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {productsDeleteSessions.map((product) => (
                                    <tr key={product.id}>
                                      <td>{product.id}</td>
                                      <td>{product.name}</td>
                                      <td>{product.category}</td>
                                      <td>{product.quantity}</td>
                                      <td>{product.price.toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* <div className={styles.subtitulo}>
                              <span onClick={() => { retornaEstadoInicialDelete(); }}>Retornar tabela para o estado inicial</span>
                            </div> */}
                          </div>
                        </>
                      )}

                    </div>
                  </div>

                  <div className={styles.errorLabel}>{errorMessage}</div>
                  {/* Botão de Avançar */}
                  <div className={styles.btn_avancar}>
                    {/* <button onClick={(e) => { retornarPaginaInicial(e) }} className={styles.btn_retornar}>Página inicial</button> */}
                    {currentRevisionIndex === 6 &&
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
                        <span className={styles.text}> {currentRevisionIndex === 6 ? 'Iniciar Exercícios' : 'Próximo'}</span>
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
                    }
                  </div>
                </div>

                {/* Icone de Avançar */}
                <div className={`${styles.next_icon} ${cardAnimationClass === 'slide_in_right' ? styles.slide_in_right : cardAnimationClass === 'slide_in_left' ? styles.slide_in_left : cardAnimationClass === 'slide_out_right' ? styles.slide_out_right : styles.slide_out_left} ${currentRevisionIndex === 6 && styles.hidden_visibility}`}>
                  <span id="next" onClick={() => onNextButtonClick()}>
                    <FontAwesomeIcon className={styles.icon} icon="arrow-right" />
                  </span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Revision;