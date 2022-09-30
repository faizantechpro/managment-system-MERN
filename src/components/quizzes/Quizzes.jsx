import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

import Alert from '../Alert/Alert';
import QuizzesTable from './QuizzesTable';
import quizService from '../../services/quiz.service';
import ModalConfirm from '../modal/ModalConfirmDefault';
import stringConstants from '../../utils/stringConstants.json';
import AlertWrapper from '../Alert/AlertWrapper';
import LayoutHead from '../commons/LayoutHead';
import { sortingTable } from '../../utils/sortingTable';

const constants = stringConstants.settings.resources.quizzes;
const defaultPagination = { page: 1, limit: 10 };

const Quizzes = ({ setId, setCreate }) => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [dataInDB, setDataInDB] = useState(false);
  const [order, setOrder] = useState([]);

  const getQuizzes = async (count) => {
    const quizzes = await quizService.getQuizzes({
      ...pagination,
      order,
      action: 'manage',
    });
    setData(quizzes.data);
    setPagination(quizzes.pagination);
    if (count) setDataInDB(Boolean(quizzes?.pagination?.totalPages));
  };

  const changePaginationPage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    setSelectedQuizzes([]);
  };

  const onHandleEdit = (row) => {
    setId(row.id);
    setCreate(true);
  };

  const deleteQuizzes = async () => {
    const deletedQuizzes = selectedQuizzes.map(async (QuizId) => {
      return new Promise((resolve) => {
        quizService.deleteQuiz(QuizId).then(resolve);
      });
    });
    return Promise.all(deletedQuizzes);
  };

  const handleDelete = async () => {
    await deleteQuizzes();

    setOpenModal(false);
    setSuccessMessage(constants.successMessage);
    getQuizzes();
    setSelectedQuizzes([]);
  };

  useEffect(() => {
    getQuizzes(true);
  }, []);

  useEffect(() => {
    getQuizzes();
  }, [pagination.page, order]);

  const sortTable = ({ name }) => sortingTable({ name, order, setOrder });

  return (
    <div className="row justify-content-center">
      <AlertWrapper>
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>
      <ModalConfirm
        open={openModal}
        onHandleConfirm={handleDelete}
        onHandleClose={() => setOpenModal(false)}
        textBody={constants.deleteConfirmation}
        labelButtonConfirm={constants.acceptConfirmation}
        iconButtonConfirm="delete"
        colorButtonConfirm="outline-danger"
      />
      <div className="col-lg-12">
        <LayoutHead
          onHandleCreate={() => {
            setId(null);
            setCreate(true);
          }}
          buttonLabel={constants.addQuizLabel}
          selectedData={selectedQuizzes}
          dataInDB={dataInDB}
          onDelete={() => setOpenModal(true)}
          allRegister={`${pagination.count || 0} Quizzes`}
        />
        <Card className="mb-5">
          <Card.Body className="p-0">
            <QuizzesTable
              onHandleEdit={onHandleEdit}
              dataSource={data}
              selectedData={selectedQuizzes}
              setSelectedData={setSelectedQuizzes}
              paginationInfo={pagination}
              onPageChange={changePaginationPage}
              dataInDB={dataInDB}
              sortingTable={sortTable}
              onCreateQuiz={() => {
                setId(null);
                setCreate(true);
              }}
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Quizzes;
